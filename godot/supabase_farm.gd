extends RefCounted

const Playtest := preload("res://online_playtest.gd")
const REFRESH_MARGIN_SECONDS := 30.0

var endpoint: String
var api_key: String
var region: String
var session_path: String
var session: Dictionary = {}
var session_invalid := false
var http: HTTPRequest
var event_http: HTTPRequest
var playtest: Playtest
var events_inflight := false


func _init(config: Dictionary, game_request: HTTPRequest, event_request: HTTPRequest) -> void:
	endpoint = str(config.get("url", "")).strip_edges().trim_suffix("/")
	api_key = str(config.get("publishable_key", "")).strip_edges()
	region = str(config.get("region", "ap-southeast-1"))
	http = game_request
	event_http = event_request
	session_path = "user://vac_online_session_%s.json" % endpoint.sha256_text().left(24)
	if FileAccess.file_exists(session_path):
		var stored: Variant = JSON.parse_string(FileAccess.get_file_as_string(session_path))
		if stored is Dictionary and _valid_session(stored):
			session = stored
		else:
			session_invalid = true
	if config.get("playtest", false) == true:
		playtest = Playtest.new()


func is_configured() -> bool:
	var origins := RegEx.create_from_string("^https://[A-Za-z0-9.-]+(:[0-9]+)?$|^http://(localhost|127\\.0\\.0\\.1):[0-9]+$")
	if origins.search(endpoint) == null or not api_key.begins_with("sb_publishable_"):
		return false
	return RegEx.create_from_string("^[A-Za-z0-9_-]*$").search(region) != null


func cache_path() -> String:
	if session.is_empty():
		return ""
	var account: String = session.user_id
	return "user://vac_online_farm_%s.json" % (endpoint + "|" + account).sha256_text().left(32)


func send(actions: Array) -> Dictionary:
	var auth_error := await _ensure_session()
	if not auth_error.is_empty():
		return {"error": auth_error}
	var reply := await _apply(actions)
	if reply.status == 401:
		auth_error = await _ensure_session(true)
		if not auth_error.is_empty():
			return {"error": auth_error}
		reply = await _apply(actions)
	var body: Variant = reply.body
	if reply.status != 200 or not _valid_snapshot(body):
		if reply.status == 401:
			return {"error": "Máy chủ từ chối phiên đăng nhập. Bấm Đọc lại để thử kết nối."}
		if reply.status == 400:
			return {"error": "Máy chủ từ chối thao tác. Bấm Đọc lại để lấy trạng thái mới."}
		if not actions.is_empty():
			return {"error": "Chưa rõ kết quả thao tác. Bấm Đọc lại để đối chiếu."}
		return {"error": "Chưa đọc được nông trại online. Bấm Đọc lại để kết nối."}
	body["clockRate"] = 1.0
	if playtest != null:
		playtest.record(cache_path(), actions, body)
		_send_events()
	return body


func _apply(actions: Array) -> Dictionary:
	var headers := _headers(session.access_token)
	if not region.is_empty():
		headers.append("x-region: " + region)
	return await _post(http, "/functions/v1/apply-actions", headers, {"actions": actions})


func _ensure_session(force_refresh := false) -> String:
	if session_invalid:
		return "Không đọc được phiên đã lưu. Dữ liệu nông trại đã tải vẫn dùng để xem."
	if not session.is_empty() and not force_refresh:
		if float(session.expires_at) > Time.get_unix_time_from_system() + REFRESH_MARGIN_SECONDS:
			return ""
	var refreshing := not session.is_empty()
	var path := "/auth/v1/token?grant_type=refresh_token" if refreshing else "/auth/v1/signup"
	var payload := {"refresh_token": session.refresh_token} if refreshing else {}
	var reply := await _post(http, path, _headers(), payload)
	if reply.status < 200 or reply.status >= 300 or reply.body is not Dictionary:
		if refreshing and reply.status in [400, 401, 403]:
			return "Phiên đã lưu không làm mới được. Nông trại đã tải vẫn dùng để xem."
		return "Chưa kết nối được dịch vụ đăng nhập. Bấm Đọc lại để thử."
	var body: Dictionary = reply.body
	var user: Variant = body.get("user")
	var expires_in: Variant = body.get("expires_in")
	if user is not Dictionary or not _is_number(expires_in) or float(expires_in) <= 0.0:
		return "Dịch vụ đăng nhập trả phiên sai định dạng."
	var next := {
		"user_id": user.get("id"),
		"access_token": body.get("access_token"),
		"refresh_token": body.get("refresh_token"),
		"expires_at": Time.get_unix_time_from_system() + float(expires_in),
	}
	if not _valid_session(next) or (refreshing and next.user_id != session.user_id):
		return "Dịch vụ đăng nhập trả phiên sai định dạng."
	session = next
	_save_session()
	return ""


func _save_session() -> void:
	var temp_path := session_path + ".tmp"
	var file := FileAccess.open(temp_path, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify(session))
	file.close()
	if DirAccess.rename_absolute(temp_path, session_path) == OK and OS.has_feature("web"):
		JavaScriptBridge.force_fs_sync()


func _send_events() -> void:
	if events_inflight or playtest.pending.is_empty():
		return
	events_inflight = true
	var batch := playtest.pending.slice(0, 500)
	var headers := _headers(session.access_token)
	headers.append("Prefer: return=minimal")
	var reply := await _post(event_http, "/rest/v1/playtest_events", headers, batch)
	if reply.status >= 200 and reply.status < 300:
		playtest.confirm(batch.size())
	events_inflight = false


func _headers(token := "") -> PackedStringArray:
	var headers := PackedStringArray(["Content-Type: application/json", "apikey: " + api_key])
	if not token.is_empty():
		headers.append("Authorization: Bearer " + token)
	return headers


func _post(request: HTTPRequest, path: String, headers: PackedStringArray, body: Variant) -> Dictionary:
	if request.request(endpoint + path, headers, HTTPClient.METHOD_POST, JSON.stringify(body)) != OK:
		return {"status": 0, "body": null}
	var reply: Array = await request.request_completed
	if reply[0] != HTTPRequest.RESULT_SUCCESS:
		return {"status": 0, "body": null}
	var raw: PackedByteArray = reply[3]
	var payload: Variant = JSON.parse_string(raw.get_string_from_utf8()) if not raw.is_empty() else null
	return {"status": reply[1], "body": payload}


func _valid_session(value: Dictionary) -> bool:
	for field in ["user_id", "access_token", "refresh_token"]:
		if value.get(field) is not String or value[field].is_empty():
			return false
	return _is_number(value.get("expires_at"))


func _valid_snapshot(value: Variant) -> bool:
	return value is Dictionary and value.get("state") is Dictionary and value.state.get("tiles") is Array \
		and value.get("results") is Array and _is_number(value.get("serverNow"))


func _is_number(value: Variant) -> bool:
	return value is int or value is float
