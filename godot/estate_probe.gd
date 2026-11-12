extends Node2D
## Cảnh kiểm chứng LT-14. Thay đổi ô đất và vàng chỉ theo phản hồi từ apply-actions.

const INK := Color("#3d2314")
const PAPER := Color("#f3e3c3")
const Farmer := preload("res://farmer.gd")
const TouchJoystick := preload("res://touch_joystick.gd")
const EstateCamera := preload("res://estate_camera.gd")
const RicePlot := preload("res://rice_plot.gd")
const FarmProbeState := preload("res://farm_probe_state.gd")
const TAP_SLOP := 12.0
const MOUSE_POINTER := -2

@onready var camera: EstateCamera = $EstateCamera
@onready var ground: TileMapLayer = $World/EstateMap/Terrain/Ground
@onready var player: Farmer = $World/EstateMap/PlayerSpawn/Player
@onready var plot: RicePlot = $World/EstateMap/RicePlot
@onready var transport: Node = $Transport
@onready var header: PanelContainer = $HUD/Margin/Layout/Header
@onready var footer: PanelContainer = $HUD/Margin/Layout/Footer
@onready var joystick: TouchJoystick = $HUD/Margin/Layout/Space/Joystick
@onready var gold: Label = $HUD/Margin/Layout/Header/Row/Gold
@onready var metrics: Label = $HUD/Margin/Layout/Header/Row/Metrics
@onready var plot_title: Label = $HUD/Margin/Layout/Footer/Row/Text/Title
@onready var status: Label = $HUD/Margin/Layout/Footer/Row/Text/Status
@onready var action: Button = $HUD/Margin/Layout/Footer/Row/Action

@onready var sell: Button = $HUD/Margin/Layout/Footer/Row/Sell

var farm := FarmProbeState.new()
var notice := ""
var busy := false
var connected := false
var ready_ms := 0
var has_walk_target := false
var walk_target := Vector2.ZERO
var pending_plot := false
var world_bounds := Rect2()
var pointers: Dictionary[int, Vector2] = {}
var tap_start := Vector2.ZERO
var tap_possible := false
var can_pan := false


func _ready() -> void:
	_style_hud()
	world_bounds = _map_bounds()
	camera.configure(world_bounds, player.global_position)
	get_viewport().size_changed.connect(_on_viewport_resized)
	action.pressed.connect(_on_action)
	sell.pressed.connect(_on_sell)
	$CropTimer.timeout.connect(_update_view)
	$MetricsTimer.timeout.connect(_update_metrics)
	_load_cache()
	_refresh([])


func _map_bounds() -> Rect2:
	var used := ground.get_used_rect()
	if not used.has_area() or ground.tile_set == null:
		return get_viewport_rect()
	var tile_size := Vector2(ground.tile_set.tile_size)
	var corner := ground.map_to_local(used.position) - tile_size * 0.5
	return ground.global_transform * Rect2(corner, Vector2(used.size) * tile_size)


func _on_viewport_resized() -> void:
	pointers.clear()
	camera.fit_viewport()


func _physics_process(delta: float) -> void:
	var using_joystick := joystick.is_engaged()
	var manual := joystick.direction if using_joystick else Input.get_vector("walk_left", "walk_right", "walk_up", "walk_down")
	if not busy and not pending_plot and (using_joystick or manual != Vector2.ZERO):
		has_walk_target = false
		if manual != Vector2.ZERO:
			camera.follow()
		var target := player.global_position + manual * player.walk_speed * delta
		player.step_toward(_clamp_walk(target), delta)
	elif has_walk_target:
		has_walk_target = not player.step_toward(walk_target, delta)
	else:
		player.stand()
	if pending_plot and not has_walk_target:
		pending_plot = false
		_send_plot_command()
	camera.track(player.global_position, delta)


func _unhandled_input(event: InputEvent) -> void:
	# A real touch owns the world tap. Emulated mouse input still reaches HUD buttons.
	if event.device == InputEvent.DEVICE_ID_EMULATION:
		return
	if event is InputEventScreenTouch and event.pressed:
		_press_world(event.index, event.position)
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_press_world(MOUSE_POINTER, event.position)


func _input(event: InputEvent) -> void:
	if event.device == InputEvent.DEVICE_ID_EMULATION:
		return
	if event is InputEventScreenDrag:
		_drag_world(event.index, event.position)
	elif event is InputEventScreenTouch and not event.pressed:
		_release_world(event.index, event.position, event.canceled)
	elif event is InputEventMouseMotion:
		_drag_world(MOUSE_POINTER, event.position)
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and not event.pressed:
		_release_world(MOUSE_POINTER, event.position, false)


func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT:
		pointers.clear()


func _press_world(id: int, point: Vector2) -> void:
	if _on_hud(point) or pointers.has(id) or pointers.size() >= 2:
		return
	tap_possible = pointers.is_empty()
	tap_start = point
	can_pan = not tap_possible or not plot.hits(_to_world(point))
	pointers[id] = point


func _drag_world(id: int, point: Vector2) -> void:
	if not pointers.has(id):
		return
	var previous := pointers[id]
	pointers[id] = point
	if tap_possible:
		if point.distance_to(tap_start) <= TAP_SLOP:
			return
		tap_possible = false
		previous = tap_start
	if can_pan and not joystick.is_engaged():
		camera.pan((point - previous) / float(pointers.size()))


func _release_world(id: int, point: Vector2, canceled: bool) -> void:
	if not pointers.erase(id):
		return
	if tap_possible and not canceled and point.distance_to(tap_start) <= TAP_SLOP:
		_tap_world(point)
	tap_possible = false


func _on_hud(point: Vector2) -> bool:
	return header.get_global_rect().has_point(point) or footer.get_global_rect().has_point(point)


func _tap_world(viewport_point: Vector2) -> void:
	if busy or _on_hud(viewport_point):
		return
	var pointer := _to_world(viewport_point)
	if plot.hits(pointer):
		_on_action()
		return
	pending_plot = false
	_walk_to(pointer)


func _to_world(viewport_point: Vector2) -> Vector2:
	return get_canvas_transform().affine_inverse() * viewport_point


func _walk_to(target: Vector2) -> void:
	camera.follow()
	walk_target = _clamp_walk(target)
	has_walk_target = true


func _clamp_walk(target: Vector2) -> Vector2:
	var margin := Vector2(24, 24).min(world_bounds.size * 0.5)
	return target.clamp(world_bounds.position + margin, world_bounds.end - margin)


func _on_action() -> void:
	if busy or pending_plot:
		return
	if not connected or (farm.clock_rate == 0.0 and farm.stage(farm.tile()) >= 0):
		_refresh([])
		return
	if farm.plot_command().is_empty():
		return
	if plot.in_reach(player.global_position):
		has_walk_target = false
		_send_plot_command()
	else:
		pending_plot = true
		_walk_to(plot.approach_point())
		_update_view()


func _send_plot_command() -> void:
	var command := farm.plot_command()
	if not command.is_empty() and plot.in_reach(player.global_position):
		_refresh([command])


func _on_sell() -> void:
	var qty := farm.stock()
	if connected and farm.clock_rate > 0.0 and not busy and not pending_plot and qty > 0:
		_refresh([{"type": "SELL", "itemId": FarmProbeState.RICE_ID, "qty": qty}])


func _refresh(actions: Array) -> void:
	busy = true
	notice = "Đang gửi thao tác…" if not actions.is_empty() else "Đang đọc nông trại…"
	_update_view()
	var reply: Dictionary = await transport.send(actions)
	busy = false
	if reply.has("error"):
		connected = false
		farm.freeze()
		notice = str(reply.error)
	else:
		connected = true
		farm.receive(reply)
		notice = ""
		if ready_ms == 0 and OS.has_feature("web"):
			var performance := JavaScriptBridge.get_interface("performance")
			ready_ms = roundi(float(performance.now()))
			_update_metrics()
		_store_cache()
		var results: Array = reply.get("results", [])
		if not results.is_empty() and not actions.is_empty():
			if results[0].get("ok", false):
				var action_type: String = actions[0].type
				if action_type == "SELL":
					notice = "Đã bán lúa cho HTX."
				else:
					player.work_toward(plot.global_position)
					plot.play_effect(action_type)
			else:
				notice = str(results[0].get("message", "Thao tác chưa thành công."))
	_update_view()


func _update_view() -> void:
	var tile := farm.tile()
	var stage := farm.stage(tile)
	var watered: bool = tile.get("watered", false)
	var qty := farm.stock()
	plot.render(stage, watered)
	gold.text = "Vàng %d" % int(farm.snapshot.get("gold", 0)) if not farm.snapshot.is_empty() else "Vàng —"
	plot_title.text = "Ruộng lúa · Kho %d" % qty
	var command: String = farm.plot_command().get("type", "")
	var labels := {"PLANT": "Gieo lúa", "WATER": "Tưới lúa", "HARVEST": "Gặt lúa"}
	var waiting := connected and farm.clock_rate > 0.0 and command.is_empty()
	action.text = labels.get(command, "Đang lớn" if waiting else "Đọc lại") if connected else "Đọc lại"
	action.disabled = busy or pending_plot or waiting
	sell.disabled = not connected or farm.clock_rate == 0.0 or busy or pending_plot or qty == 0
	if not notice.is_empty():
		status.text = notice
	elif pending_plot:
		status.text = "Đang đi tới ô ruộng…"
	elif stage >= 0 and farm.clock_rate == 0.0:
		status.text = "Lúa đã lưu trên máy chủ thử nghiệm."
	elif stage == 3:
		status.text = "Lúa đã chín. Chạm ô sáng để gặt."
	elif stage >= 0:
		var phase := "Đã tưới" if watered else "Chạm ô để tưới"
		status.text = "%s · Chín sau %d giây" % [phase, farm.seconds_to_mature(tile)]
	elif qty > 0:
		status.text = "Lúa đã vào kho. Có thể bán cho HTX."
	else:
		status.text = "Chạm ô sáng hoặc bấm Gieo lúa."


func _update_metrics() -> void:
	metrics.text = "  %d FPS" % Engine.get_frames_per_second()
	if ready_ms > 0:
		metrics.text += " · Tải %.1f s" % (ready_ms / 1000.0)


func _load_cache() -> void:
	var path: String = transport.cache_path()
	if path.is_empty() or not FileAccess.file_exists(path):
		return
	var cached: Variant = JSON.parse_string(FileAccess.get_file_as_string(path))
	if cached is Dictionary:
		if cached.get("tiles") is Array:
			farm.receive({"state": cached})
		elif cached.get("state") is Dictionary:
			farm.receive(cached)
		_update_view()


func _store_cache() -> void:
	var path: String = transport.cache_path()
	if path.is_empty():
		return
	var file := FileAccess.open(path, FileAccess.WRITE)
	if file == null:
		return
	file.store_string(JSON.stringify(farm.cache_payload()))
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
	for label: Label in [gold, metrics, $HUD/Margin/Layout/Header/Row/Title, plot_title, status]:
		label.add_theme_color_override("font_color", INK)
	for button: Button in [action, sell]:
		button.add_theme_stylebox_override("normal", _panel(Color("#ffd166")))
		button.add_theme_stylebox_override("hover", _panel(Color("#fff3b0")))
		button.add_theme_stylebox_override("pressed", _panel(Color("#f5b700")))
		button.add_theme_stylebox_override("disabled", _panel(Color("#e0c79a")))
		for style in ["font_color", "font_pressed_color", "font_hover_color", "font_focus_color", "font_disabled_color"]:
			button.add_theme_color_override(style, INK)
