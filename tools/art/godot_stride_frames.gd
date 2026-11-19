extends SceneTree
## From the repository root: godot --headless --script tools/art/godot_stride_frames.gd
## Build walk in-betweens from the original sprite pixels.

const INK := Color("#3d2314")
const SHOE := Color("#a0673a")
const SOURCE := "art/source/p0_ai/"
const OUTPUT := "godot/sprites/"


func _initialize() -> void:
	var error := _farmer_inbetweens()
	for id in ["ANI_01", "ANI_03"]:
		if error == OK:
			error = _bird_stride(id)
	for id in ["bacbay", "cohuong"]:
		if error == OK:
			error = _npc_stride(id)
	quit(error)


func _farmer_inbetweens() -> Error:
	var atlas := Image.create_empty(48 * 4, 64, false, Image.FORMAT_RGBA8)
	# Source sprites face left. Keep one shoe on the original ground line in each pose.
	# The negative rotations pick up the heel. The positive rotations lead with the toe.
	var contacts := [0, 2, 1, 3]
	var front_steps := [Vector2i(3, 0), Vector2i(4, -2), Vector2i(4, -3), Vector2i(2, 0)]
	var rear_steps := [Vector2i(-5, -2), Vector2i(-2, 0), Vector2i(-3, 0), Vector2i(-5, -2)]
	var front_angles := [0.0, 18.0, 12.0, 0.0]
	var rear_angles := [-18.0, 0.0, 0.0, -12.0]
	for i in range(contacts.size()):
		var source := Image.load_from_file(SOURCE + "farmer_walk_left_%d.png" % contacts[i])
		if source == null or source.get_size() != Vector2i(48, 64):
			push_error("Missing 48x64 farmer contact frame %d" % contacts[i])
			return ERR_FILE_CORRUPT
		var pose := source.duplicate() as Image
		pose.fill_rect(Rect2i(0, 53, 48, 11), Color.TRANSPARENT)
		_place_lower_leg(pose, source, Rect2i(26, 55, 22, 9), Vector2(32, 55),
			rear_steps[i], rear_angles[i])
		_place_lower_leg(pose, source, Rect2i(0, 55, 26, 9), Vector2(20, 55),
			front_steps[i], front_angles[i])
		atlas.blit_rect(pose, Rect2i(0, 0, 48, 64), Vector2i(i * 48, 0))
	return atlas.save_png(OUTPUT + "farmer_stride.png")


func _place_lower_leg(pose: Image, source: Image, shoe: Rect2i, ankle: Vector2,
		travel: Vector2i, degrees: float) -> void:
	# Keep each cuff row intact and join it to the shifted ankle. Never shear the shoe itself.
	for y in range(53, shoe.position.y):
		var weight := (y - 53.0) / (shoe.position.y - 53.0)
		var shift := Vector2i((Vector2(travel) * weight).round())
		shift.y = maxi(53 - y, shift.y)
		var row := Rect2i(shoe.position.x, y, shoe.size.x, 1)
		pose.blit_rect_mask(source, source, row, row.position + shift)
	if is_zero_approx(degrees):
		pose.blit_rect_mask(source, source, shoe, shoe.position + travel)
		return

	# Sample the whole original shoe around the ankle at nearest pixel, preserving its palette.
	var angle := deg_to_rad(degrees)
	var new_ankle := ankle + Vector2(travel)
	for y in range(53, pose.get_height()):
		for x in range(pose.get_width()):
			var from := ankle + (Vector2(x, y) - new_ankle).rotated(-angle)
			var pixel := Vector2i(from.round())
			if shoe.has_point(pixel):
				var color := source.get_pixelv(pixel)
				if color.a > 0.0:
					pose.set_pixel(x, y, color)


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
