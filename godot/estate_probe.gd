extends Node2D
## Cảnh kiểm chứng LT-14. Thay đổi ô đất và vàng chỉ theo phản hồi từ apply-actions.

const INK := Color("#3d2314")
const PAPER := Color("#f3e3c3")
const Farmer := preload("res://farmer.gd")
const TouchJoystick := preload("res://touch_joystick.gd")
const EstateCamera := preload("res://estate_camera.gd")
const RicePlot := preload("res://rice_plot.gd")
const RicePlotScene := preload("res://rice_plot.tscn")
const AnimalSlotScene := preload("res://animal_slot.tscn")
const Sheet := preload("res://sheet.gd")
const EstateFeatures := preload("res://estate_features.gd")
const FarmProbeState := preload("res://farm_probe_state.gd")
const GRASS_SOURCE_ID := 0
const SEASON_NAMES := {"XUAN": "Xuân", "HA": "Hạ", "THU": "Thu", "DONG": "Đông"}
const RESULT_ICON := "[\\x{1F000}-\\x{1FAFF}\\x{2600}-\\x{27BF}\\x{FE0F}]"
const TAP_SLOP := 12.0
const MOUSE_POINTER := -2

@export var grass_by_season: Dictionary[String, Texture2D] = {}

@onready var camera: EstateCamera = $EstateCamera
@onready var ground: TileMapLayer = $World/EstateMap/Terrain/Ground
@onready var player: Farmer = $World/EstateMap/PlayerSpawn/Player
@onready var primary_plot: RicePlot = $World/EstateMap/RicePlot
@onready var features: EstateFeatures = $World/EstateMap/EstateFeatures
@onready var transport: Node = $Transport
@onready var header: PanelContainer = $HUD/Margin/Layout/Header
@onready var footer: PanelContainer = $HUD/Margin/Layout/Footer
@onready var joystick: TouchJoystick = $HUD/Margin/Layout/Space/Joystick
@onready var season_label: Label = $HUD/Margin/Layout/Header/Row/Season
@onready var gold: Label = $HUD/Margin/Layout/Header/Row/Gold
@onready var metrics: Label = $HUD/Margin/Layout/Header/Row/Metrics
@onready var plot_title: Label = $HUD/Margin/Layout/Footer/Row/Text/Title
@onready var status: Label = $HUD/Margin/Layout/Footer/Row/Text/Status
@onready var action: Button = $HUD/Margin/Layout/Footer/Row/Action
@onready var seeds_button: Button = $HUD/Margin/Layout/Footer/Row/Seeds
@onready var store_button: Button = $HUD/Margin/Layout/Footer/Row/Store
@onready var orders_button: Button = $HUD/Margin/Layout/Footer/Row/Orders
@onready var sheet: Sheet = $HUD/Sheet
@onready var confirm_overlay: Control = $HUD/Confirm
@onready var confirm_panel: PanelContainer = $HUD/Confirm/Center/Panel
@onready var confirm_title: Label = $HUD/Confirm/Center/Panel/Content/Title
@onready var confirm_details: Label = $HUD/Confirm/Center/Panel/Content/Details
@onready var cancel_button: Button = $HUD/Confirm/Center/Panel/Content/Buttons/Cancel
@onready var confirm_button: Button = $HUD/Confirm/Center/Panel/Content/Buttons/Apply

var farm := FarmProbeState.new()
var notice := ""
var busy := false
var connected := false
var ready_ms := 0
var plots: Dictionary[String, Node2D] = {}
var slot_items: Dictionary[String, String] = {}
var seed_id := FarmProbeState.RICE_ID
var sheet_kind := ""
var pot: Array[String] = []
var orders_key := ""
var plot_specs: Dictionary[String, Dictionary] = {}
var crop_frames: Dictionary[String, Array] = {}
var selected_plot := FarmProbeState.PLOT_ID
var walk_path := PackedVector2Array()
var pending_task: Dictionary = {}
var confirmation: Dictionary = {}
var drag_ids: Array[String] = []
var world_bounds := Rect2()
var pointers: Dictionary[int, Vector2] = {}
var tap_start := Vector2.ZERO
var tap_possible := false
var can_pan := false
var grass_atlas: TileSetAtlasSource
var base_grass: Texture2D
var shown_season := ""
var leading_icons := RegEx.create_from_string("^" + RESULT_ICON + "+\\s*")
var inline_icons := RegEx.create_from_string(RESULT_ICON)


func _enter_tree() -> void:
	var board: Sheet = $HUD/Sheet
	board.style_button = _style_button
	board.style_panel = _panel.bind(PAPER, 14)


func _ready() -> void:
	_style_hud()
	if ground.tile_set != null and ground.tile_set.has_source(GRASS_SOURCE_ID):
		grass_atlas = ground.tile_set.get_source(GRASS_SOURCE_ID) as TileSetAtlasSource
		if grass_atlas != null:
			base_grass = grass_atlas.texture
	features.configure(ground)
	_add_plots()
	world_bounds = _map_bounds()
	camera.configure(world_bounds, player.global_position)
	get_viewport().size_changed.connect(_on_viewport_resized)
	action.pressed.connect(_on_action)
	seeds_button.pressed.connect(_open_sheet.bind("SEEDS"))
	store_button.pressed.connect(_open_sheet.bind("STORE"))
	orders_button.pressed.connect(_open_sheet.bind("ORDERS"))
	sheet.chosen.connect(_on_sheet_chosen)
	sheet.closed.connect(_on_sheet_closed)
	cancel_button.pressed.connect(_close_confirmation)
	confirm_button.pressed.connect(_approve_estate)
	$CropTimer.timeout.connect(_update_view)
	$MetricsTimer.timeout.connect(_update_metrics)
	_load_cache()
	_refresh([])


func _add_plots() -> void:
	plots[FarmProbeState.PLOT_ID] = primary_plot
	for spec: Dictionary in features.data.plots:
		plot_specs[spec.id] = spec
	for id: String in features.data.crops:
		if id == FarmProbeState.RICE_ID:
			continue
		var frames: Array[Texture2D] = []
		for stage in range(4):
			frames.append(load("res://generated/%s_%d.png" % [id, stage]))
		crop_frames[id] = frames
	for spec: Dictionary in features.data.slots:
		var slot := AnimalSlotScene.instantiate()
		slot.name = "Animal"
		features.slot_marker(spec.id).add_child(slot)
		var textures: Array[Texture2D] = []
		for frame in range(2):
			textures.append(load("res://generated/%s_%d.png" % [spec.item, frame]))
		slot.setup(textures)
		slot.hide()
		plots[spec.id] = slot
		slot_items[spec.id] = spec.item


func _render_plots() -> void:
	if not farm.snapshot.is_empty() and farm.tile(selected_plot).is_empty():
		selected_plot = FarmProbeState.PLOT_ID
	for id: String in farm.tiles:
		if plots.has(id) or not plot_specs.has(id):
			continue
		var plot := RicePlotScene.instantiate() as RicePlot
		plot.name = id
		primary_plot.get_parent().add_child(plot)
		plot.global_position = features.plot_position(
			plot_specs[id], primary_plot.global_position, plot_specs[FarmProbeState.PLOT_ID]
		)
		plots[id] = plot
	for id: String in plots:
		var plot: Node2D = plots[id]
		var cell := farm.tile(id)
		plot.visible = not cell.is_empty() or (id == FarmProbeState.PLOT_ID and farm.snapshot.is_empty())
		if plot.visible:
			var item_id: String = cell.itemId if cell.get("itemId") is String else ""
			plot.render(farm.stage(cell), cell.get("watered", false), id == selected_plot, crop_frames.get(item_id, []))


func _map_bounds() -> Rect2:
	var used := ground.get_used_rect()
	if not used.has_area() or ground.tile_set == null:
		return get_viewport_rect()
	var tile_size := Vector2(ground.tile_set.tile_size)
	var corner := ground.map_to_local(used.position) - tile_size * 0.5
	return ground.global_transform * Rect2(corner, Vector2(used.size) * tile_size)


func _on_viewport_resized() -> void:
	pointers.clear()
	drag_ids.clear()
	camera.fit_viewport()


func _physics_process(delta: float) -> void:
	var using_joystick := joystick.is_engaged()
	var manual := joystick.direction if using_joystick else Input.get_vector("walk_left", "walk_right", "walk_up", "walk_down")
	if _modal():
		player.stand()
	elif not busy and pending_task.is_empty() and (using_joystick or manual != Vector2.ZERO):
		walk_path.clear()
		if manual != Vector2.ZERO:
			camera.follow()
		_step_manual(manual * player.walk_speed * delta, delta)
	elif not walk_path.is_empty():
		if player.step_toward(walk_path[0], delta):
			walk_path.remove_at(0)
	else:
		player.stand()
	if not pending_task.is_empty() and walk_path.is_empty():
		var task := pending_task
		pending_task = {}
		_finish_task(task)
	camera.track(player.global_position, delta)


func _step_manual(motion: Vector2, delta: float) -> void:
	var point := player.global_position
	var next := _clamp_walk(point + motion)
	if not features.is_free(Vector2(next.x, point.y)):
		next.x = point.x
	if not features.is_free(next):
		next.y = point.y
	player.step_toward(next, delta)


func _unhandled_input(event: InputEvent) -> void:
	# A real touch owns the world tap. Emulated mouse input still reaches HUD buttons.
	if event.device == InputEvent.DEVICE_ID_EMULATION:
		return
	if event is InputEventScreenTouch and event.pressed:
		_press_world(event.index, event.position)
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_press_world(MOUSE_POINTER, event.position)


func _unhandled_key_input(event: InputEvent) -> void:
	if confirm_overlay.visible and event.is_action_pressed("ui_cancel"):
		_close_confirmation()
		get_viewport().set_input_as_handled()


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
		drag_ids.clear()


func _press_world(id: int, point: Vector2) -> void:
	if _on_hud(point) or pointers.has(id) or pointers.size() >= 2:
		return
	tap_possible = pointers.is_empty()
	tap_start = point
	var plot_id := _plot_at(_to_world(point))
	can_pan = not tap_possible or plot_id.is_empty()
	drag_ids.clear()
	if tap_possible and not plot_id.is_empty():
		drag_ids.append(plot_id)
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
	elif not drag_ids.is_empty():
		var span := point - previous
		var steps := maxi(1, ceili(span.length() / (features.tile_size * 0.5)))
		for step in range(1, steps + 1):
			var plot_id := _plot_at(_to_world(previous + span * float(step) / steps))
			if not plot_id.is_empty() and not drag_ids.has(plot_id):
				drag_ids.append(plot_id)


func _release_world(id: int, point: Vector2, canceled: bool) -> void:
	if not pointers.erase(id):
		return
	if not canceled and not _on_hud(point):
		if tap_possible and point.distance_to(tap_start) <= TAP_SLOP:
			_tap_world(point)
		elif not drag_ids.is_empty():
			_batch_plots()
	tap_possible = false
	drag_ids.clear()


func _plot_at(point: Vector2) -> String:
	for id: String in plots:
		var plot: Node2D = plots[id]
		if plot.visible and plot.hits(point):
			return id
	return ""


func _on_hud(point: Vector2) -> bool:
	return _modal() or header.get_global_rect().has_point(point) or footer.get_global_rect().has_point(point)


func _tap_world(viewport_point: Vector2) -> void:
	if busy or not pending_task.is_empty() or _on_hud(viewport_point):
		return
	var point := _to_world(viewport_point)
	var plot_id := _plot_at(point)
	if not plot_id.is_empty():
		selected_plot = plot_id
		notice = ""
		_on_action()
		_update_view()
		return
	var target := features.target_at(point)
	if not target.is_empty():
		if not connected:
			_refresh([])
			return
		_queue_task({"target": target}, features.world_area(target))
		return
	_walk_to(point)


func _to_world(viewport_point: Vector2) -> Vector2:
	return get_canvas_transform().affine_inverse() * viewport_point


func _walk_to(target: Vector2) -> void:
	walk_path = features.walk_path(player.global_position, _clamp_walk(target))
	if not walk_path.is_empty():
		camera.follow()


func _clamp_walk(target: Vector2) -> Vector2:
	var margin := Vector2(24, 24).min(world_bounds.size * 0.5)
	return target.clamp(world_bounds.position + margin, world_bounds.end - margin)


func _queue_task(task: Dictionary, area: Rect2) -> void:
	walk_path.clear()
	notice = ""
	task["area"] = area
	if features.in_reach(player.global_position, area):
		_finish_task(task)
	else:
		walk_path = features.walk_path(player.global_position, area.get_center(), area)
		if walk_path.is_empty():
			notice = "Chưa tìm được đường đến đó."
		else:
			pending_task = task
			camera.follow()
	_update_view()


func _finish_task(task: Dictionary) -> void:
	if not connected or not features.in_reach(player.global_position, task.area):
		return
	if task.has("target"):
		_interact_estate(task.target)
		return
	var commands: Array[Dictionary] = []
	var ids: Array = task.ids
	var kind: String = task.kind
	for id: String in ids:
		var command := _plot_command(id)
		if command.get("type") != kind:
			continue
		commands.append(command)
		if commands.size() >= int(features.data.dragMax):
			break
	if not commands.is_empty():
		_refresh(commands)
	else:
		_update_view()


func _modal() -> bool:
	return confirm_overlay.visible or sheet.visible


## Giống cho ô: chỗ nuôi dùng đúng loài của chỗ đó, ô ruộng dùng giống đang chọn nếu đúng mùa.
func _seed_for(id: String) -> String:
	if slot_items.has(id):
		return slot_items[id]
	return seed_id if farm.in_season(features.data.items[seed_id].seasons) else ""


func _plot_command(id: String) -> Dictionary:
	return farm.plot_command(id, _seed_for(id))


func _item_name(id: String) -> String:
	if features.data.items.has(id):
		return features.data.items[id].name
	if features.data.materials.has(id):
		return features.data.materials[id].name
	return id


func _on_action() -> void:
	if busy or not pending_task.is_empty() or _modal():
		return
	if not connected or (farm.clock_rate == 0.0 and farm.stage(farm.tile(selected_plot)) >= 0):
		_refresh([])
		return
	var command := _plot_command(selected_plot)
	if not command.is_empty():
		_queue_task({"ids": [selected_plot], "kind": command.type}, plots[selected_plot].world_area())


func _batch_plots() -> void:
	if not connected or busy or not pending_task.is_empty() or _modal():
		return
	var first := drag_ids[0]
	var command := _plot_command(first)
	if command.is_empty():
		return
	selected_plot = first
	_queue_task({"ids": drag_ids.duplicate(), "kind": command.type}, plots[first].world_area())


func _interact_estate(target: Dictionary) -> void:
	var command := features.command(target, int(farm.snapshot.get("level", 1)))
	if command.has("panel"):
		_open_sheet(command.panel)
	elif not command.has("action"):
		notice = command.get("hint", "")
	elif not command.has("title"):
		_refresh([command.action], features.world_area(target).get_center())
	else:
		confirmation = command
		confirmation["point"] = features.world_area(target).get_center()
		_show_confirmation()
	_update_view()


func _show_confirmation() -> void:
	var rule: Dictionary = confirmation.rule
	var cost := PackedStringArray(["%d vàng" % int(rule.gold)])
	var have := PackedStringArray(["%d vàng" % int(farm.snapshot.get("gold", 0))])
	var enough := int(farm.snapshot.get("gold", 0)) >= int(rule.gold)
	if rule.has("stamina"):
		var stamina := int(farm.snapshot.get("stamina", 0))
		cost.append("%d năng lượng" % int(rule.stamina))
		have.append("%d năng lượng" % stamina)
		enough = enough and stamina >= int(rule.stamina)
	var materials: Dictionary = rule.get("mats", {})
	for id: String in materials:
		var name_text: String = features.data.materials[id].name.to_lower()
		cost.append("%d %s" % [int(materials[id]), name_text])
		have.append("%d %s" % [farm.stock(id), name_text])
		enough = enough and farm.stock(id) >= int(materials[id])
	confirm_title.text = confirmation.title
	confirm_details.text = "%s\nCần %s\nĐang có %s" % [confirmation.unlocks, " + ".join(cost), " · ".join(have)]
	confirm_button.disabled = not enough
	confirm_button.text = "Xác nhận" if enough else "Thiếu chi phí"
	confirm_overlay.show()
	cancel_button.grab_focus()


func _close_confirmation() -> void:
	confirm_overlay.hide()
	confirmation = {}


func _approve_estate() -> void:
	if not connected or busy or confirmation.is_empty() or confirm_button.disabled:
		return
	var approved := confirmation
	_close_confirmation()
	_refresh([approved.action], approved.point)


func _open_sheet(kind: String) -> void:
	if busy or not pending_task.is_empty() or confirm_overlay.visible:
		return
	walk_path.clear()
	sheet_kind = kind
	notice = ""
	orders_key = ""
	_update_view()


func _on_sheet_closed() -> void:
	sheet_kind = ""
	pot.clear()
	notice = ""
	_update_view()


func _on_sheet_chosen(id: String) -> void:
	if busy:
		return
	var parts := id.split(":")
	var value := parts[1] if parts.size() > 1 else ""
	match parts[0]:
		"seed":
			seed_id = value
			sheet.close()
			notice = "Đã chọn giống %s." % _item_name(value)
		"pot":
			if pot.size() < int(features.data.kitchen.potMax):
				pot.append(value)
		"empty":
			pot.clear()
		_:
			var command := _sheet_command(parts[0], value)
			if connected and not command.is_empty():
				if parts[0] == "discover":
					pot.clear()
				_refresh([command])
				return
	_update_view()


func _sheet_command(kind: String, value: String) -> Dictionary:
	match kind:
		"sell": return {"type": "SELL", "itemId": value, "qty": farm.stock(value)}
		"eat": return {"type": "EAT", "productId": value}
		"cook": return {"type": "COOK", "productId": value}
		"collect": return {"type": "COLLECT_DISH"}
		"discover": return {"type": "DISCOVER", "ingredientIds": pot.duplicate()}
		"deliver": return {"type": "DELIVER_ORDER", "slot": int(value)}
		"skip": return {"type": "SKIP_ORDER", "slot": int(value)}
	return {}


func _render_sheet() -> void:
	if sheet_kind.is_empty():
		return
	var level := int(farm.snapshot.get("level", 1))
	var rows: Array = []
	var title := ""
	var info := ""
	match sheet_kind:
		"SEEDS":
			title = "Chọn giống"
			info = "Giống đang chọn dùng cho mọi ô ruộng trống."
			for id: String in features.data.crops:
				var item: Dictionary = features.data.items[id]
				var button := {"id": "seed:" + id, "label": "Chọn"}
				if level < int(item.level):
					button = {"id": "seed:" + id, "label": "Cấp %d" % int(item.level), "disabled": true}
				elif not farm.in_season(item.seasons):
					button = {"id": "seed:" + id, "label": "Trái vụ", "disabled": true}
				elif id == seed_id:
					button = {"id": "seed:" + id, "label": "Đang chọn", "disabled": true}
				rows.append({
					"text": "%s\nHạt %d vàng · %d phút · bán %d vàng" % [item.name, int(item.cost), int(item.minutes), int(item.sell)],
					"buttons": [button],
				})
		"STORE":
			title = "Kho"
			info = "Bán thẳng cho HTX, hoặc để dành giao đơn được thưởng cao hơn."
			rows = _store_rows()
		"KITCHEN":
			title = "Bếp Củi"
			rows = _kitchen_rows(level)
		"ORDERS":
			title = "Bảng đơn HTX"
			info = "Giao đủ hàng được thưởng cao hơn bán thẳng."
			rows = _order_rows(level)
	sheet.present(title, notice if not notice.is_empty() else info, rows)


func _store_rows() -> Array:
	var rows: Array = []
	var inventory: Dictionary = farm.snapshot.get("inventory", {})
	for id: String in inventory:
		var qty := int(inventory[id])
		if qty <= 0:
			continue
		var item: Dictionary = features.data.items.get(id, {})
		var buttons: Array = []
		var text := "%s × %d" % [_item_name(id), qty]
		if item.has("stamina"):
			text += " · ăn +%d năng lượng" % int(item.stamina)
			buttons.append({"id": "eat:" + id, "label": "Ăn", "disabled": busy})
		if int(item.get("sell", 0)) > 0:
			text += "\nBán %d vàng mỗi đơn vị" % int(item.sell)
			buttons.append({"id": "sell:" + id, "label": "Bán hết", "disabled": busy or farm.clock_rate == 0.0})
		rows.append({"text": text, "buttons": buttons})
	if rows.is_empty():
		rows.append({"text": "Kho chưa có gì. Thu hoạch để có nông sản."})
	return rows


func _kitchen_rows(level: int) -> Array:
	var rows: Array = []
	var kitchen: Dictionary = features.data.kitchen
	var machines: Dictionary = farm.snapshot.get("machines", {})
	var machine: Dictionary = machines.get(kitchen.id, {})
	var cooking: Variant = machine.get("craftItemId")
	if not cooking is String:
		rows.append({"text": "Bếp đang rảnh. Chọn món để nấu."})
	elif farm.now() < float(machine.get("readyAt", 0)):
		rows.append({"text": "Đang nấu %s · còn %d giây" % [_item_name(cooking), farm.seconds_until(float(machine.readyAt))]})
	else:
		rows.append({
			"text": "%s đã chín." % _item_name(cooking),
			"buttons": [{"id": "collect", "label": "Lấy món", "disabled": busy}],
		})
	var known: Array = farm.snapshot.get("discoveredRecipes", [])
	for id: String in kitchen.recipes:
		var item: Dictionary = features.data.items[id]
		var text := "%s · %d phút · ăn +%d năng lượng\n" % [item.name, int(item.minutes), int(item.stamina)]
		var buttons: Array = []
		if id == kitchen.starter or known.has(id):
			var needs := PackedStringArray()
			var enough := true
			for part: Dictionary in item.recipe:
				needs.append("%d %s (có %d)" % [int(part.qty), _item_name(part.itemId), farm.stock(part.itemId)])
				enough = enough and farm.stock(part.itemId) >= int(part.qty)
			text += "Cần " + ", ".join(needs)
			buttons.append({"id": "cook:" + id, "label": "Nấu", "disabled": busy or cooking is String or not enough})
		else:
			text += "Chưa biết công thức. Thử ở Nồi Đất: %d nguyên liệu, có %s." % [int(item.hint.totalQty), _item_name(item.hint.firstItemId)]
		if level < int(item.level):
			buttons = [{"id": "cook:" + id, "label": "Cấp %d" % int(item.level), "disabled": true}]
		rows.append({"text": text, "buttons": buttons})
	var inside := PackedStringArray()
	var counts: Dictionary[String, int] = {}
	for id in pot:
		counts[id] = counts.get(id, 0) + 1
	for id: String in counts:
		inside.append("%d %s" % [counts[id], _item_name(id)])
	rows.append({
		"text": "Nồi Đất · bỏ 1–%d nguyên liệu để tìm món mới, nguyên liệu không mất\nTrong nồi: %s" % [
			int(kitchen.potMax), ", ".join(inside) if not pot.is_empty() else "trống"
		],
		"buttons": [
			{"id": "empty", "label": "Bỏ hết", "disabled": pot.is_empty()},
			{"id": "discover", "label": "Thử nấu", "disabled": busy or pot.is_empty()},
		],
	})
	var inventory: Dictionary = farm.snapshot.get("inventory", {})
	for id: String in inventory:
		var qty := int(inventory[id])
		var item: Dictionary = features.data.items.get(id, {})
		if qty <= 0 or item.is_empty() or item.has("recipe"):
			continue
		var used: int = counts.get(id, 0)
		rows.append({
			"text": "%s · có %d · trong nồi %d" % [item.name, qty, used],
			"buttons": [{"id": "pot:" + id, "label": "Thêm", "disabled": pot.size() >= int(kitchen.potMax) or used >= qty}],
		})
	return rows


func _order_rows(level: int) -> Array:
	var rows: Array = []
	var board: Dictionary = farm.snapshot.get("orders") if farm.snapshot.get("orders") is Dictionary else {}
	var slots: Array = board.get("slots", [null, null, null])
	var ready_at: Array = board.get("readyAt", [0, 0, 0])
	var due := PackedInt32Array()
	for index in range(slots.size()):
		var order: Variant = slots[index]
		if order is Dictionary:
			var lines := PackedStringArray()
			var enough := true
			for line: Dictionary in order.lines:
				var have := farm.stock(line.itemId)
				lines.append("%s %d/%d" % [_item_name(line.itemId), mini(have, int(line.qty)), int(line.qty)])
				enough = enough and have >= int(line.qty)
			rows.append({
				"text": "%s\nThưởng +%d vàng · +%d XP" % [" · ".join(lines), int(order.gold), int(order.xp)],
				"buttons": [
					{"id": "deliver:%d" % index, "label": "Giao", "disabled": busy or not enough},
					{"id": "skip:%d" % index, "label": "Bỏ", "disabled": busy},
				],
			})
		elif farm.now() < float(ready_at[index]):
			rows.append({"text": "Đơn mới sau %d giây." % farm.seconds_until(float(ready_at[index]))})
		else:
			due.append(index)
			rows.append({"text": "Chưa có hàng để HTX đặt. Trồng thêm hoặc lên cấp."})
	# Chỗ trống hết thời gian chờ thì xin đơn mới. Mỗi tình trạng chỉ xin một lần.
	var key := "%d|%s" % [level, due]
	if not due.is_empty() and key != orders_key and connected and not busy and farm.clock_rate > 0.0:
		orders_key = key
		_refresh.call_deferred([{"type": "REFRESH_ORDERS"}])
	return rows


func _refresh(actions: Array, work_point := Vector2.ZERO) -> void:
	busy = true
	notice = "Đang gửi thao tác…" if not actions.is_empty() else "Đang đọc nông trại…"
	_update_view()
	var previous_cache: String = transport.cache_path()
	var reply: Dictionary = await transport.send(actions)
	busy = false
	if reply.has("error"):
		connected = false
		if previous_cache != transport.cache_path():
			farm.receive({"state": {}})
		else:
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
		_show_results(actions, results, work_point)
	_update_view()


func _show_results(actions: Array, results: Array, work_point: Vector2) -> void:
	var succeeded := 0
	for result: Dictionary in results:
		var index := int(result.get("index", -1))
		if index < 0 or index >= actions.size():
			continue
		var command: Dictionary = actions[index]
		if not result.get("ok", false):
			if notice.is_empty() and command.type != "REFRESH_ORDERS":
				notice = _result_text(result, "Thao tác chưa thành công.")
			continue
		succeeded += 1
		var plot_id: String = command.get("tileId", "")
		if plots.has(plot_id):
			var plot := plots[plot_id]
			player.work_toward(plot.global_position)
			plot.play_effect(command.type)
		elif command.type != "REFRESH_ORDERS":
			if work_point != Vector2.ZERO:
				player.work_toward(work_point)
			notice = _result_text(result, "Đã xong.")
	if succeeded > 1 and notice.is_empty():
		notice = "Đã làm xong %d ô." % succeeded


func _result_text(result: Dictionary, fallback: String) -> String:
	# Font mặc định của bản Web thiếu emoji trong thông báo dùng chung với Phaser.
	var message := leading_icons.sub(str(result.get("message", fallback)), "")
	message = message.replace("🪙", "vàng").replace("⚡", "năng lượng").replace("💎", "ngọc")
	return inline_icons.sub(message, "", true).replace("  ", " ").strip_edges()


func _update_view() -> void:
	_update_season()
	features.sync(farm.snapshot)
	_render_plots()
	_render_sheet()
	var tile := farm.tile(selected_plot)
	var stage := farm.stage(tile)
	var watered: bool = tile.get("watered", false)
	var is_slot := slot_items.has(selected_plot)
	var blocked := busy or not pending_task.is_empty()
	gold.text = "Cấp %d · Vàng %d · NL %d" % [
		int(farm.snapshot.get("level", 1)), int(farm.snapshot.get("gold", 0)), int(farm.snapshot.get("stamina", 0))
	] if not farm.snapshot.is_empty() else "Vàng —"
	plot_title.text = "Kho · Lúa %d · Gỗ %d · Đá %d" % [farm.stock(), farm.stock("MAT_GO"), farm.stock("MAT_DA")]
	var held: Variant = tile.get("itemId")
	var crop_name := _item_name(held) if held is String else "Cây"
	var seed_name := _item_name(slot_items[selected_plot] if is_slot else seed_id)
	var command: String = _plot_command(selected_plot).get("type", "")
	var labels := {"PLANT": "Thả nuôi" if is_slot else "Gieo hạt", "WATER": "Tưới", "HARVEST": "Thu hoạch"}
	var waiting := connected and farm.clock_rate > 0.0 and command.is_empty()
	var out_of_season := connected and not tile.is_empty() and stage < 0 and _seed_for(selected_plot).is_empty()
	action.text = labels.get(command, "Đang lớn" if waiting else "Đọc lại") if connected else "Đọc lại"
	if out_of_season:
		action.text = "Trái vụ"
	action.disabled = blocked or waiting or out_of_season
	for button: Button in [seeds_button, store_button, orders_button]:
		button.disabled = not connected or blocked
	if not notice.is_empty():
		status.text = notice
	elif not pending_task.is_empty():
		status.text = "Đang đi tới…"
	elif stage >= 0 and farm.clock_rate == 0.0:
		status.text = "%s đã lưu trên máy chủ thử nghiệm." % crop_name
	elif stage == 3:
		status.text = "%s đã tới lứa. Chạm để thu." % crop_name if is_slot else "%s đã chín. Chạm ô để thu hoạch." % crop_name
	elif stage >= 0:
		var phase := crop_name if is_slot or watered else "Chạm ô để tưới"
		status.text = "%s · %s sau %d giây" % [phase, "Tới lứa" if is_slot else "Chín", farm.seconds_to_mature(tile)]
	elif out_of_season:
		status.text = "Mùa này không gieo %s được. Bấm Giống để đổi." % seed_name
	elif is_slot:
		status.text = "Chỗ nuôi %s. Chạm để thả, giá %d vàng." % [seed_name, int(features.data.items[slot_items[selected_plot]].cost)]
	else:
		status.text = "Giống %s. Chạm ô ruộng để gieo, chạm chướng ngại để dọn." % seed_name


func _update_season() -> void:
	var current := farm.season_id()
	season_label.text = "Mùa —" if current.is_empty() else "%s · ngày %d/%d" % [
		SEASON_NAMES[current], farm.season_day(), FarmProbeState.Calendar.DAYS
	]
	if shown_season != current:
		shown_season = current
		features.set_season(current)
	var texture: Texture2D = grass_by_season.get(current, base_grass)
	if grass_atlas != null and texture != grass_atlas.texture:
		grass_atlas.texture = texture


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
	confirm_panel.add_theme_stylebox_override("panel", _panel(PAPER, 18))
	footer.add_theme_stylebox_override("panel", _panel(PAPER))
	for label: Label in [gold, metrics, season_label, $HUD/Margin/Layout/Header/Row/Title, plot_title, status, confirm_title, confirm_details]:
		label.add_theme_color_override("font_color", INK)
	for button: Button in [action, seeds_button, store_button, orders_button, cancel_button, confirm_button]:
		_style_button(button)


func _style_button(button: Button) -> void:
	button.add_theme_stylebox_override("normal", _panel(Color("#ffd166")))
	button.add_theme_stylebox_override("hover", _panel(Color("#fff3b0")))
	button.add_theme_stylebox_override("pressed", _panel(Color("#f5b700")))
	button.add_theme_stylebox_override("disabled", _panel(Color("#e0c79a")))
	for style in ["font_color", "font_pressed_color", "font_hover_color", "font_focus_color", "font_disabled_color"]:
		button.add_theme_color_override(style, INK)
