extends Node
## LT-14 bước 0. Điểm nối cùng origin của bộ thử cục bộ.

@onready var http: HTTPRequest = $HTTPRequest


func send(actions: Array) -> Dictionary:
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
