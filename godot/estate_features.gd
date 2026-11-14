extends Node2D

const DATA_PATH := "res://generated/estate.json"
const PAPER := Color("#f3e3c3")
const FOLIAGE := {"HA": Color("#e8ffe0"), "THU": Color("#ffd890"), "DONG": Color("#b8b0a0")}
const WATER := {"THU": Color("#3a7f7a"), "DONG": Color("#5e7f78")}

@export var wild_grass: Texture2D
@export var wild_weed: Texture2D

var data: Dictionary
var targets: Array[Dictionary] = []
var regions: Array[Dictionary] = []
var estate: Dictionary
var tile_size := 32.0
var ground: TileMapLayer
var navigation := AStarGrid2D.new()


func configure(terrain: TileMapLayer) -> void:
	ground = terrain
	tile_size = float(ground.tile_set.tile_size.x)
	data = JSON.parse_string(FileAccess.get_file_as_string(DATA_PATH))
	for rule: Dictionary in data.obstacles:
		_add_target(rule.id, rule, "CLEAR")
	for rule: Dictionary in data.repairs:
		_add_target(rule.id, rule, "REPAIR")
	for rule: Dictionary in data.regions:
		_add_target("Region%d" % (int(rule.index) + 1), rule, "RECLAIM")
		regions.append(targets.back())
	navigation.region = ground.get_used_rect()
	navigation.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_NEVER
	navigation.update()
	_render_estate()


func _add_target(node_name: String, rule: Dictionary, kind: String) -> void:
	var marker := get_node(node_name) as Marker2D
	var size := Vector2(rule.size[0], rule.size[1]) * tile_size
	var rect := Rect2(marker.position - Vector2(size.x * 0.5, size.y), size)
	targets.append({"marker": marker, "rect": rect, "kind": kind, "rule": rule})


func sync(state: Dictionary) -> void:
	var next: Dictionary = state.get("estate") if state.get("estate") is Dictionary else {}
	if estate != next:
		estate = next
		_render_estate()


func set_season(season: String) -> void:
	var tint: Color = FOLIAGE.get(season, Color.WHITE)
	$SacredTree/Sprite.modulate = tint
	for target in targets:
		if target.rule.get("kind") == "TREE":
			target.marker.get_node("Sprite").modulate = tint
	$Pond/Water.modulate = WATER.get(season, Color("#2e8b8d"))


func _render_estate() -> void:
	navigation.fill_solid_region(navigation.region, false)
	for id: String in data.scenery:
		var shape: Dictionary = data.scenery[id]
		var marker := get_node(id) as Marker2D
		var size := Vector2(shape.w, shape.h) * tile_size
		_block(Rect2(marker.position - Vector2(size.x * 0.5, size.y), size))
	for target in targets:
		var marker: Marker2D = target.marker
		match target.kind:
			"CLEAR":
				marker.visible = not estate.get("cleared", []).has(target.rule.id)
				if marker.visible:
					_block(target.rect)
			"REPAIR":
				var repaired: bool = estate.get("repaired", []).has(target.rule.id)
				marker.get_node("Sprite").visible = not repaired
				marker.get_node("Rubble").visible = not repaired
				marker.get_node("Repaired").visible = repaired
				_block(target.rect)
	queue_redraw()


func _draw() -> void:
	if wild_grass == null:
		return
	for target in targets:
		if target.kind != "RECLAIM" or int(target.rule.index) < reclaimed():
			continue
		var area: Rect2 = target.rect
		for y in range(int(target.rule.size[1])):
			for x in range(int(target.rule.size[0])):
				var top := area.position + Vector2(x, y) * tile_size
				draw_texture_rect(wild_grass, Rect2(top, Vector2.ONE * tile_size), false, Color("#d8c4a0"))
				if wild_weed != null and (x + y * 3) % 4 == 0:
					draw_texture_rect(wild_weed, Rect2(top + Vector2(4, 3), Vector2(24, 24)), false)
		if int(target.rule.index) == reclaimed():
			var inside := area.grow(-2)
			draw_rect(inside, Color(PAPER, 0.12))
			draw_rect(Rect2(inside.position, Vector2(inside.size.x, 2)), PAPER)
			draw_rect(Rect2(inside.position.x, inside.end.y - 2, inside.size.x, 2), PAPER)
			draw_rect(Rect2(inside.position, Vector2(2, inside.size.y)), PAPER)
			draw_rect(Rect2(inside.end.x - 2, inside.position.y, 2, inside.size.y), PAPER)


func reclaimed() -> int:
	return int(estate.get("reclaimed", 0))


func plot_position(spec: Dictionary, primary: Vector2, primary_spec: Dictionary) -> Vector2:
	var cell := Vector2(spec.x, spec.y)
	if int(spec.region) < 0:
		return primary + (cell - Vector2(primary_spec.x, primary_spec.y)) * tile_size
	var target := regions[int(spec.region)]
	var origin := Vector2(target.rule.x, target.rule.y)
	var rect: Rect2 = target.rect
	return to_global(rect.position + (cell - origin + Vector2(0.5, 0.5)) * tile_size)


func target_at(point: Vector2) -> Dictionary:
	var local := to_local(point)
	for target in targets:
		var marker: Marker2D = target.marker
		if not marker.visible or (target.kind == "RECLAIM" and int(target.rule.index) < reclaimed()):
			continue
		var hit: Rect2 = target.rect
		if target.kind != "RECLAIM":
			var sprite: Sprite2D = marker.get_node("Sprite" if marker.get_node("Sprite").visible else "Repaired")
			var art := sprite.get_rect()
			art.position += marker.position + sprite.position
			hit = hit.merge(art)
		if hit.has_point(local):
			return target
	return {}


func command(target: Dictionary, level: int) -> Dictionary:
	var rule: Dictionary = target.rule
	match target.kind:
		"CLEAR":
			return {"action": {"type": "CLEAR", "obstacleId": rule.id}}
		"REPAIR":
			if estate.get("repaired", []).has(rule.id):
				return {"hint": "%s đã sửa." % rule.name}
			if level < int(rule.get("minLevel", 0)):
				return {"hint": "Sửa %s mở ở cấp %d." % [rule.name, rule.minLevel]}
			return {
				"action": {"type": "REPAIR", "structureId": rule.id},
				"title": "Sửa %s" % rule.name, "unlocks": "Mở %s" % rule.unlocks, "rule": rule,
			}
		"RECLAIM":
			if int(rule.index) != reclaimed():
				return {"hint": "Khai hoang vùng %d trước." % (reclaimed() + 1)}
			return {
				"action": {"type": "RECLAIM", "regionIndex": int(rule.index)},
				"title": "Khai hoang vùng %d" % (reclaimed() + 1),
				"unlocks": "Mở %d ô ruộng" % rule.count, "rule": rule,
			}
	return {}


func in_reach(point: Vector2, area: Rect2) -> bool:
	return area.grow(tile_size * float(data.reach)).has_point(point)


func world_area(target: Dictionary) -> Rect2:
	return global_transform * target.rect


func _cell(point: Vector2) -> Vector2i:
	return ground.local_to_map(ground.to_local(point))


func _world(cell: Vector2i) -> Vector2:
	return ground.to_global(ground.map_to_local(cell))


func _block(area: Rect2) -> void:
	var first := _cell(to_global(area.position + Vector2.ONE))
	var last := _cell(to_global(area.end - Vector2.ONE))
	var covered := navigation.region.intersection(Rect2i(first, last - first + Vector2i.ONE))
	if covered.has_area():
		navigation.fill_solid_region(covered, true)


func is_free(point: Vector2) -> bool:
	var cell := _cell(point)
	return navigation.region.has_point(cell) and not navigation.is_point_solid(cell)


func walk_path(from: Vector2, point: Vector2, area := Rect2()) -> PackedVector2Array:
	var start := _cell(from)
	var finish := _cell(point)
	if not navigation.region.has_point(start):
		return []
	if not area.has_area():
		if not is_free(point):
			return []
		var cells := navigation.get_id_path(start, finish)
		if cells.is_empty():
			return []
		var route := _waypoints(cells)
		route.append(point)
		return route

	var reach := area.grow(tile_size * float(data.reach))
	var first := _cell(reach.position + Vector2.ONE)
	var last := _cell(reach.end - Vector2.ONE)
	var best: Array[Vector2i] = []
	for y in range(first.y, last.y + 1):
		for x in range(first.x, last.x + 1):
			var cell := Vector2i(x, y)
			if not navigation.region.has_point(cell) or navigation.is_point_solid(cell):
				continue
			var candidate := navigation.get_id_path(start, cell)
			if not candidate.is_empty() and (best.is_empty() or candidate.size() < best.size()):
				best = candidate
	return _waypoints(best)


func _waypoints(cells: Array[Vector2i]) -> PackedVector2Array:
	var path := PackedVector2Array()
	for index in range(1, cells.size()):
		path.append(_world(cells[index]))
	return path
