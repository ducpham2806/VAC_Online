extends Node2D
## Cảnh kiểm chứng LT-14. Thay đổi ô đất và vàng chỉ theo phản hồi từ apply-actions.

const PLOT_ID := "P5_7"
const CACHE_PATH := "user://vac_probe_snapshot.json"
const INK := Color("#3d2314")
const PAPER := Color("#f3e3c3")
const Farmer := preload("res://farmer.gd")
const TouchJoystick := preload("res://touch_joystick.gd")
const TAP_SLOP := 12.0

@onready var world: Node2D = $World
@onready var player: Farmer = $World/EstateMap/PlayerSpawn/Player
@onready var plot_hit: CollisionShape2D = $World/EstateMap/RicePlot/HitArea
@onready var crop: Sprite2D = $World/EstateMap/RicePlot/Rice
@onready var sow_dust: CPUParticles2D = $World/EstateMap/RicePlot/SowFx/Dust
@onready var sow_seeds: CPUParticles2D = $World/EstateMap/RicePlot/SowFx/Seeds
@onready var transport: Node = $Transport
@onready var header: PanelContainer = $HUD/Margin/Layout/Header
@onready var footer: PanelContainer = $HUD/Margin/Layout/Footer
@onready var joystick: TouchJoystick = $HUD/Margin/Layout/Space/Joystick
@onready var gold: Label = $HUD/Margin/Layout/Header/Row/Gold
@onready var metrics: Label = $HUD/Margin/Layout/Header/Row/Metrics
@onready var status: Label = $HUD/Margin/Layout/Footer/Row/Text/Status
@onready var action: Button = $HUD/Margin/Layout/Footer/Row/Action

var snapshot: Dictionary = {}
var busy := false
var connected := false
var ready_ms := 0
var has_walk_target := false
var walk_target := Vector2.ZERO
var sow_fx_pending := false
var touch_id := -1
var touch_start := Vector2.ZERO
var touch_dragged := false


func _ready() -> void:
	_style_hud()
	_center_world()
	get_viewport().size_changed.connect(_center_world)
	action.pressed.connect(_on_action)
	$MetricsTimer.timeout.connect(_update_metrics)
	_load_cache()
	_refresh([])


func _center_world() -> void:
	touch_id = -1
	var base_size := Vector2(
		ProjectSettings.get_setting("display/window/size/viewport_width"),
		ProjectSettings.get_setting("display/window/size/viewport_height")
	)
	world.position = ((get_viewport_rect().size - base_size) * 0.5).floor()


func _physics_process(delta: float) -> void:
	var using_joystick := joystick.is_engaged()
	var manual := joystick.direction if using_joystick else Input.get_vector("walk_left", "walk_right", "walk_up", "walk_down")
	if not busy and (using_joystick or manual != Vector2.ZERO):
		has_walk_target = false
		var target := player.global_position + manual * player.walk_speed * delta
		player.step_toward(_clamp_walk(target), delta)
	elif has_walk_target:
		has_walk_target = not player.step_toward(_clamp_walk(world.to_global(walk_target)), delta)
	else:
		player.stand()
	if not has_walk_target:
		_play_sow_fx()


func _unhandled_input(event: InputEvent) -> void:
	# A real touch owns the world tap. Emulated mouse input still reaches HUD buttons.
	if event.device == InputEvent.DEVICE_ID_EMULATION:
		return
	if event is InputEventScreenTouch:
		_track_touch(event)
	elif event is InputEventScreenDrag and event.index == touch_id:
		touch_dragged = touch_dragged or event.position.distance_to(touch_start) > TAP_SLOP
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_tap_world(event.position)


func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT:
		touch_id = -1


func _track_touch(event: InputEventScreenTouch) -> void:
	if event.pressed:
		if touch_id == -1 and not _on_hud(event.position):
			touch_id = event.index
			touch_start = event.position
			touch_dragged = false
	elif event.index == touch_id:
		touch_id = -1
		if not event.canceled and not touch_dragged and event.position.distance_to(touch_start) <= TAP_SLOP:
			_tap_world(event.position)


func _on_hud(point: Vector2) -> bool:
	return header.get_global_rect().has_point(point) or footer.get_global_rect().has_point(point)


func _tap_world(viewport_point: Vector2) -> void:
	if busy or _on_hud(viewport_point):
		return
	var pointer := get_canvas_transform().affine_inverse() * viewport_point
	var shape := plot_hit.shape as RectangleShape2D
	var plot_bounds := Rect2(-shape.size * 0.5, shape.size)
	if plot_bounds.has_point(plot_hit.to_local(pointer)):
		_on_action()
		return
	_walk_to(pointer)


func _walk_to(target: Vector2) -> void:
	_play_sow_fx()
	walk_target = world.to_local(target)
	has_walk_target = true


func _clamp_walk(target: Vector2) -> Vector2:
	var bounds := get_viewport_rect().grow(-24)
	return target.clamp(bounds.position, bounds.end)


func _play_sow_fx() -> void:
	if not sow_fx_pending:
		return
	sow_fx_pending = false
	sow_dust.restart()
	sow_seeds.restart()


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
			if not actions.is_empty() and not results.is_empty():
				sow_fx_pending = true
				if not has_walk_target:
					_play_sow_fx()
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
