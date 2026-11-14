extends Node
## LT-14. Chọn API online khi bản dựng có cấu hình project thử.

const SupabaseFarm := preload("res://supabase_farm.gd")
const CONFIG_PATH := "res://generated/godot_online.json"
const FIXTURE_CACHE := "user://vac_probe_snapshot.json"

@onready var http: HTTPRequest = $HTTPRequest
@onready var event_http: HTTPRequest = $PlaytestRequest

var online: SupabaseFarm
var config_error := false


func _ready() -> void:
	if not FileAccess.file_exists(CONFIG_PATH):
		return
	var config: Variant = JSON.parse_string(FileAccess.get_file_as_string(CONFIG_PATH))
	if config is Dictionary:
		online = SupabaseFarm.new(config, http, event_http)
	config_error = online == null or not online.is_configured()


func cache_path() -> String:
	if config_error:
		return ""
	return online.cache_path() if online != null else FIXTURE_CACHE


func send(actions: Array) -> Dictionary:
	if config_error:
		return {"error": "Cấu hình nông trại online chưa hợp lệ."}
	if online != null:
		return await online.send(actions)
	var url := "http://127.0.0.1:4173/api/actions"
	if OS.has_feature("web"):
		var location := JavaScriptBridge.get_interface("location")
		url = str(location.origin) + "/api/actions"
	var headers := PackedStringArray(["Content-Type: application/json"])
	var started := http.request(url, headers, HTTPClient.METHOD_POST, JSON.stringify({"actions": actions}))
	if started != OK:
		return {"error": "Chưa gửi được yêu cầu."}
	var reply: Array = await http.request_completed
	if reply[0] != HTTPRequest.RESULT_SUCCESS or reply[1] != 200:
		push_warning("Godot probe HTTPRequest result=%s status=%s" % [reply[0], reply[1]])
		return {"error": "Chưa đọc được từ máy chủ thử nghiệm."}
	var body: PackedByteArray = reply[3]
	var payload: Variant = JSON.parse_string(body.get_string_from_utf8())
	if payload is Dictionary and payload.get("state") is Dictionary:
		return payload
	return {"error": "Phản hồi thử nghiệm sai định dạng."}
