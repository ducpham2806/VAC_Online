extends Node2D
## Cảnh kiểm chứng LT-14. Thay đổi ô đất và vàng chỉ theo phản hồi từ apply-actions.

const PLOT_ID := "P5_7"
const CACHE_PATH := "user://vac_probe_snapshot.json"
const INK := Color("#3d2314")
const PAPER := Color("#f3e3c3")

@onready var world: Node2D = $World
@onready var player_spawn: Marker2D = $World/EstateMap/PlayerSpawn
@onready var player: Sprite2D = $World/EstateMap/PlayerSpawn/Player
@onready var plot_hit: CollisionShape2D = $World/EstateMap/RicePlot/HitArea
@onready var crop: Sprite2D = $World/EstateMap/RicePlot/Rice
@onready var transport: Node = $Transport
@onready var header: PanelContainer = $HUD/Margin/Layout/Header
@onready var footer: PanelContainer = $HUD/Margin/Layout/Footer
@onready var gold: Label = $HUD/Margin/Layout/Header/Row/Gold
@onready var metrics: Label = $HUD/Margin/Layout/Header/Row/Metrics
@onready var status: Label = $HUD/Margin/Layout/Footer/Row/Text/Status
@onready var action: Button = $HUD/Margin/Layout/Footer/Row/Action

var snapshot: Dictionary = {}
var busy := false
var connected := false
var ready_ms := 0
var walk: Tween


func _ready() -> void:
	_style_hud()
	_center_world()
	get_viewport().size_changed.connect(_center_world)
	action.pressed.connect(_on_action)
	$MetricsTimer.timeout.connect(_update_metrics)
	_load_cache()
	_refresh([])


func _center_world() -> void:
	var base_size := Vector2(
		ProjectSettings.get_setting("display/window/size/viewport_width"),
		ProjectSettings.get_setting("display/window/size/viewport_height")
	)
	world.position = ((get_viewport_rect().size - base_size) * 0.5).floor()


func _unhandled_input(event: InputEvent) -> void:
	if event is not InputEventMouseButton or event.button_index != MOUSE_BUTTON_LEFT or not event.pressed:
		return
	if busy:
		return
	var pointer := get_global_mouse_position()
	var shape := plot_hit.shape as RectangleShape2D
	var plot_bounds := Rect2(-shape.size * 0.5, shape.size)
	if plot_bounds.has_point(plot_hit.to_local(pointer)):
		_on_action()
		return
	var bounds := get_viewport_rect().grow(-24)
	var target := pointer.clamp(bounds.position, bounds.end)
	_walk_to(target)


func _walk_to(target: Vector2) -> void:
	if walk != null:
		walk.kill()
	var local_target := player_spawn.to_local(target)
	player.flip_h = local_target.x < player.position.x
	walk = create_tween()
	walk.tween_property(player, "position", local_target, 0.3).set_trans(Tween.TRANS_SINE)


func _on_action() -> void:
	if busy:
		return
	if not connected or _is_planted():
		_refresh([])
		return
	_walk_to(plot_hit.global_position + Vector2(-21, 0))
	_refresh([{"type": "PLANT", "tileId": PLOT_ID, "itemId": "CROP_01"}])


func _is_planted() -> bool:
	for tile: Dictionary in snapshot.get("tiles", []):
		if tile.get("id") == PLOT_ID:
			return tile.get("itemId") == "CROP_01"
	return false


func _refresh(actions: Array) -> void:
	busy = true
	action.disabled = true
	status.text = "Đang gửi lệnh gieo…" if not actions.is_empty() else "Đang đọc nông trại…"
	var reply: Dictionary = await transport.send(actions)
	busy = false
	if reply.has("error"):
		connected = false
		status.text = "Mất kết nối. Đang xem bản đã tải." if not snapshot.is_empty() else str(reply.error)
	else:
		connected = true
		snapshot = reply.state
		if ready_ms == 0 and OS.has_feature("web"):
			var performance := JavaScriptBridge.get_interface("performance")
			ready_ms = roundi(float(performance.now()))
			_update_metrics()
		_store_cache()
		var results: Array = reply.get("results", [])
		if not results.is_empty() and not results[0].get("ok", false):
			status.text = str(results[0].get("message", "Gieo chưa thành công."))
		elif _is_planted():
			status.text = "Lúa đã lưu trên máy chủ thử nghiệm."
		else:
			status.text = "Chạm ô sáng hoặc bấm Gieo lúa."
	_update_view()


func _update_view() -> void:
	gold.text = "Vàng %d" % int(snapshot.get("gold", 0)) if not snapshot.is_empty() else "Vàng —"
	var planted := _is_planted()
	crop.visible = planted
	action.text = "Gieo lúa" if connected and not planted else "Đọc lại"
	action.disabled = busy


func _update_metrics() -> void:
	metrics.text = "  %d FPS" % Engine.get_frames_per_second()
	if ready_ms > 0:
		metrics.text += " · Tải %.1f s" % (ready_ms / 1000.0)


func _load_cache() -> void:
	if not FileAccess.file_exists(CACHE_PATH):
		return
	var cached: Variant = JSON.parse_string(FileAccess.get_file_as_string(CACHE_PATH))
	if cached is Dictionary and cached.get("tiles") is Array:
		snapshot = cached
		_update_view()


func _store_cache() -> void:
	var file := FileAccess.open(CACHE_PATH, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify(snapshot))
	file.close()
	if OS.has_feature("web"):
		JavaScriptBridge.force_fs_sync()


func _panel(color: Color, margin: float = 10) -> StyleBoxFlat:
	var panel := StyleBoxFlat.new()
	panel.bg_color = color
	panel.border_color = INK
	panel.set_border_width_all(2)
	panel.set_corner_radius_all(5)
	panel.content_margin_left = margin
	panel.content_margin_right = margin
	panel.content_margin_top = 5
	panel.content_margin_bottom = 5
	return panel


func _style_hud() -> void:
	header.add_theme_stylebox_override("panel", _panel(PAPER, 12))
	footer.add_theme_stylebox_override("panel", _panel(PAPER))
	for label: Label in [gold, metrics, $HUD/Margin/Layout/Header/Row/Title, $HUD/Margin/Layout/Footer/Row/Text/Title, status]:
		label.add_theme_color_override("font_color", INK)
	action.add_theme_stylebox_override("normal", _panel(Color("#ffd166")))
	action.add_theme_stylebox_override("hover", _panel(Color("#fff3b0")))
	action.add_theme_stylebox_override("pressed", _panel(Color("#f5b700")))
	action.add_theme_stylebox_override("disabled", _panel(Color("#e0c79a")))
	for style in ["font_color", "font_pressed_color", "font_hover_color", "font_focus_color", "font_disabled_color"]:
		action.add_theme_color_override(style, INK)
