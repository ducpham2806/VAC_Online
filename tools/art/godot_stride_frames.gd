extends SceneTree
## From the repository root: godot --headless --script tools/art/godot_stride_frames.gd
## Build pixel keyframes on the original sprites, with palette colours and pinned contact feet.

const INK := Color("#3d2314")
const DARK := Color("#3e474d")
const CLOTH := Color("#5c6b73")
const LIGHT := Color("#8e9a9f")
const SHOE := Color("#a0673a")
const SHOE_LIGHT := Color("#dca57a")
const SOURCE := "art/source/p0_ai/"
const OUTPUT := "godot/sprites/"


func _initialize() -> void:
	var torso := Image.load_from_file(SOURCE + "farmer_walk_left_2.png")
	var atlas := Image.create_empty(48 * 9, 64, false, Image.FORMAT_RGBA8)
	# One leg plants and travels back under the hip. The other bends, clears it and reaches forward.
	var ankle_x := [11, 17, 23, 29, 35, 31, 23, 16]
	var ankle_y := [59, 59, 59, 58, 57, 51, 52, 56]
	var knee_x := [19, 20, 22, 25, 27, 25, 18, 17]
	var knee_y := [50, 51, 51, 51, 51, 48, 48, 50]
	var lift := [0, 1, 0, -1, 0, 1, 0, -1]
	for i in range(8):
		var art := Image.create_empty(48, 64, false, Image.FORMAT_RGBA8)
		var far := (i + 4) % 8
		_leg(art, Vector2i(27, 44 + lift[i]), Vector2i(knee_x[far] + 2, knee_y[far]),
			Vector2i(ankle_x[far], ankle_y[far] - 1), true, far)
		_leg(art, Vector2i(23, 44 + lift[i]), Vector2i(knee_x[i], knee_y[i]),
			Vector2i(ankle_x[i], ankle_y[i]), false, i)
		_torso(art, torso, lift[i])
		atlas.blit_rect(art, Rect2i(0, 0, 48, 64), Vector2i(i * 48, 0))
	var idle := Image.create_empty(48, 64, false, Image.FORMAT_RGBA8)
	_leg(idle, Vector2i(27, 44), Vector2i(28, 51), Vector2i(27, 58), true, 2)
	_leg(idle, Vector2i(23, 44), Vector2i(22, 51), Vector2i(22, 59), false, 2)
	_torso(idle, torso, 0)
	atlas.blit_rect(idle, Rect2i(0, 0, 48, 64), Vector2i(8 * 48, 0))
	var error := atlas.save_png(OUTPUT + "farmer_stride.png")
	for id in ["ANI_01", "ANI_03"]:
		if error == OK:
			error = _bird_stride(id)
	for id in ["bacbay", "cohuong"]:
		if error == OK:
			error = _npc_stride(id)
	quit(error)


func _torso(art: Image, source: Image, bob: int) -> void:
	art.blit_rect_mask(source, source, Rect2i(0, 0, 48, 45), Vector2i(0, bob + 1))
	# Preserve the dangling hand below the shirt hem.
	art.blit_rect_mask(source, source, Rect2i(24, 45, 6, 2), Vector2i(24, 46 + bob))


func _leg(art: Image, hip: Vector2i, knee: Vector2i, ankle: Vector2i, far: bool, phase: int) -> void:
	var hx := hip.x
	var kx := knee.x
	var ax := ankle.x
	var upper := PackedVector2Array([hip + Vector2i(-4, -1), hip + Vector2i(4, -1),
		knee + Vector2i(3, -1), ankle + Vector2i(2, 1), ankle + Vector2i(-3, 1),
		knee + Vector2i(-4, 0)])
	_polygon(art, upper, INK)
	_polygon(art, PackedVector2Array([Vector2i(hx - 3, hip.y), Vector2i(hx + 3, hip.y),
		Vector2i(kx + 2, knee.y), Vector2i(ax + 1, ankle.y), Vector2i(ax - 2, ankle.y),
		Vector2i(kx - 3, knee.y)]), DARK if far else CLOTH)
	if not far:
		_polygon(art, PackedVector2Array([knee + Vector2i(-2, -3), knee + Vector2i(1, -2),
			knee + Vector2i(1, 1), knee + Vector2i(-2, 0)]), LIGHT)
	var toe := ankle + Vector2i(-5, -1 if phase in [0, 7] else (2 if phase == 4 else 1))
	_polygon(art, PackedVector2Array([toe + Vector2i(0, -1), ankle + Vector2i(2, -2),
		ankle + Vector2i(3, 1), ankle + Vector2i(2, 2), toe + Vector2i(1, 2),
		toe + Vector2i(-1, 0)]), INK)
	_polygon(art, PackedVector2Array([toe, ankle + Vector2i(1, -1), ankle + Vector2i(2, 1),
		toe + Vector2i(1, 1)]), SHOE if far else SHOE_LIGHT)


func _bird_stride(id: String) -> Error:
	var bird := Image.load_from_file(SOURCE + id + "_0.png")
	var atlas := Image.create_empty(48 * 4, 48, false, Image.FORMAT_RGBA8)
	var far_hip := Vector2i(28, 39)
	var near_hip := Vector2i(22, 39)
	var stride_x := [4, 1, -3, -1]
	var stride_y := [46, 46, 45, 42]
	for i in range(4):
		var art := Image.create_empty(48, 48, false, Image.FORMAT_RGBA8)
		for leg in range(2):
			var hip := far_hip if leg == 0 else near_hip
			var phase := (i + 2 * leg) % 4
			var foot := Vector2i(hip.x + stride_x[phase], stride_y[phase])
			_polygon(art, PackedVector2Array([hip + Vector2i(-2, -1), hip + Vector2i(1, -1),
				foot + Vector2i(0, -2), foot + Vector2i(4, -1), foot + Vector2i(4, 1),
				foot + Vector2i(-2, 1)]), INK)
			_polygon(art, PackedVector2Array([hip, hip + Vector2i(1, 1), foot + Vector2i(0, -1),
				foot + Vector2i(3, 0), foot + Vector2i(-1, 0)]), Color("#ff9800") if leg else SHOE)
		art.blit_rect_mask(bird, bird, Rect2i(0, 0, 48, 40), Vector2i(0, -int(i % 2)))
		atlas.blit_rect(art, Rect2i(0, 0, 48, 48), Vector2i(i * 48, 0))
	return atlas.save_png(OUTPUT + id + "_stride.png")


func _npc_stride(id: String) -> Error:
	var source := Image.load_from_file("art/source/p1_ai/npc_%s_idle_0.png" % id)
	var size := source.get_size()
	var atlas := Image.create_empty(size.x * 4, size.y, false, Image.FORMAT_RGBA8)
	# Move individual shoes below the hem. The cane, book and torso retain their original pixels.
	var seam := 31 if id == "bacbay" else 32
	var hem := 66 if id == "bacbay" else 68
	for pose in range(4):
		var art := source.duplicate() as Image
		if pose % 2 == 1:
			var left := pose == 1
			var foot := Rect2i(20 if left else seam, hem,
				seam - 20 if left else 42 - seam, size.y - hem)
			art.fill_rect(foot, Color.TRANSPARENT)
			art.blit_rect_mask(source, source, foot, foot.position + Vector2i(-1 if left else 1, -2))
		atlas.blit_rect(art, Rect2i(Vector2i.ZERO, size), Vector2i(pose * size.x, 0))
	return atlas.save_png(OUTPUT + "npc_%s_step.png" % id)


func _polygon(art: Image, shape: PackedVector2Array, color: Color) -> void:
	var bounds := Rect2(shape[0], Vector2.ZERO)
	for point in shape:
		bounds = bounds.expand(point)
	for y in range(maxi(0, int(bounds.position.y)), mini(art.get_height(), int(bounds.end.y) + 1)):
		for x in range(maxi(0, int(bounds.position.x)), mini(art.get_width(), int(bounds.end.x) + 1)):
			if Geometry2D.is_point_in_polygon(Vector2(x + 0.5, y + 0.5), shape):
				art.set_pixel(x, y, color)
