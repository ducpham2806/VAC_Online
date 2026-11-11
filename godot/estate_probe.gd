extends Node2D
## Cảnh kiểm chứng LT-14. Thay đổi ô đất và vàng chỉ theo phản hồi từ apply-actions.

const GRASS := preload("res://generated/tile_grass_xuan.png")
const SOIL := preload("res://generated/tile_tilled_dry.png")
const RICE := preload("res://generated/CROP_01_1.png")
const FARMER := preload("res://generated/farmer_walk_down_0.png")
const HOUSE := preload("res://generated/house_0.png")
const TREE := preload("res://generated/tree_0.png")
const ROCK := preload("res://generated/rock_0.png")
const FENCE := preload("res://generated/fence_0.png")
const TILE := 32
const PLOT_ID := "P5_7"
const CACHE_PATH := "user://vac_probe_snapshot.json"
const INK := Color("#3d2314")
const PAPER := Color("#f3e3c3")

@onready var player: Sprite2D = $Player
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
	player.texture = FARMER
	player.offset = Vector2(0, -29)
	_style_hud()
	_position_scene()
	get_viewport().size_changed.connect(_position_scene)
	action.pressed.connect(_on_action)
	$MetricsTimer.timeout.connect(_update_metrics)
	_load_cache()
	_refresh([])


func _origin() -> Vector2:
	return (get_viewport_rect().size * 0.5 + Vector2(0, 22)).floor()


func _plot_rect() -> Rect2:
	return Rect2(_origin() + Vector2(0, 8), Vector2(TILE, TILE))


func _position_scene() -> void:
	if walk != null and walk.is_running():
		walk.kill()
	player.position = _origin() + Vector2(-69, 12)
	queue_redraw()


func _draw() -> void:
	draw_texture_rect(GRASS, get_viewport_rect(), true)
	var center := _origin()
	draw_rect(Rect2(center + Vector2(-185, 16), Vector2(105, 16)), Color("#c99e67"))
	_draw_at_feet(HOUSE, center + Vector2(-158, 27))
	_draw_at_feet(TREE, center + Vector2(145, 0))
	_draw_at_feet(ROCK, center + Vector2(127, 70))
	_draw_at_feet(ROCK, center + Vector2(-142, 84))
	for column in range(4):
		var fence_position := center + Vector2(-96 + 43 * column, -61)
		_draw_at_feet(FENCE, fence_position)
	for row in range(2):
		for column in range(5):
			draw_texture(SOIL, center + Vector2((column - 2) * TILE, 8 + row * TILE))
	var plot := _plot_rect()
	if _is_planted():
		_draw_at_feet(RICE, plot.get_center() + Vector2(0, 15))
	draw_rect(plot.grow(-1), Color("#fff3b0"), false, 2)


func _draw_at_feet(texture: Texture2D, feet: Vector2) -> void:
	draw_texture(texture, feet - Vector2(texture.get_width() * 0.5, texture.get_height()))


func _unhandled_input(event: InputEvent) -> void:
	if event is not InputEventMouseButton or event.button_index != MOUSE_BUTTON_LEFT or not event.pressed:
		return
	if busy:
		return
	if _plot_rect().has_point(get_global_mouse_position()):
		_on_action()
		return
	var bounds := get_viewport_rect().grow(-24)
	var target := get_global_mouse_position().clamp(bounds.position, bounds.end)
	_walk_to(target)


func _walk_to(target: Vector2) -> void:
	if walk != null:
		walk.kill()
	player.flip_h = target.x < player.position.x
	walk = create_tween()
	walk.tween_property(player, "position", target, 0.3).set_trans(Tween.TRANS_SINE)


func _on_action() -> void:
	if busy:
		return
	if not connected or _is_planted():
		_refresh([])
		return
	_walk_to(_plot_rect().get_center() + Vector2(-21, 0))
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
	action.text = "Gieo lúa" if connected and not _is_planted() else "Đọc lại"
	action.disabled = busy
	queue_redraw()


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
