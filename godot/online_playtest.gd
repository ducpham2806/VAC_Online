extends RefCounted

var pending: Array = []
var player := ""
var session := 0
var last_level := -1
var path := ""


func record(cache_path: String, actions: Array, reply: Dictionary) -> void:
	var timestamp := Time.get_datetime_string_from_system(true) + "Z"
	if path.is_empty():
		path = cache_path.get_basename() + "_events.json"
		_open()
		_add("SESSION", timestamp)
	var counts := {}
	for result: Dictionary in reply.results:
		var index := int(result.get("index", -1))
		if result.get("ok", false) and index >= 0 and index < actions.size():
			var kind: String = actions[index].type
			counts[kind] = counts.get(kind, 0) + 1
	for kind: String in counts:
		_add("ACTION", timestamp, kind, counts[kind])
	var level := int(reply.state.get("level", 0))
	if last_level >= 0 and level > last_level:
		_add("LEVEL", timestamp, "", level)
	last_level = level
	_save()


func confirm(count: int) -> void:
	pending = pending.slice(count)
	_save()


func _open() -> void:
	if FileAccess.file_exists(path):
		var stored: Variant = JSON.parse_string(FileAccess.get_file_as_string(path))
		if stored is Dictionary and stored.get("player") is String and stored.get("pending") is Array:
			player = stored.player
			session = int(stored.get("session", 0))
			pending = stored.pending
	if player.is_empty():
		player = Crypto.new().generate_random_bytes(16).hex_encode()
	session = mini(100000, session + 1)


func _add(kind: String, timestamp: String, name := "", value := -1) -> void:
	var event := {"player": player, "session": session, "t": timestamp, "type": kind}
	if not name.is_empty():
		event["name"] = name
	if value >= 0:
		event["value"] = value
	pending.append(event)


func _save() -> void:
	var file := FileAccess.open(path, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify({"player": player, "session": session, "pending": pending}))
	file.close()
	if OS.has_feature("web"):
		JavaScriptBridge.force_fs_sync()
