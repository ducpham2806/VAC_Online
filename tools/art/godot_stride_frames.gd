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
	# Match the four original contacts in SpriteFrames. The legs overlap on the passing poses,
	# but every row retains its original width, outline and colours.
	var contacts := [0, 2, 1, 3]
	var front_in := [6, 3, 8, 5]
	var rear_in := [9, 6, 5, 3]
	var bend_front := [0, 2, 2, 0]
	var bend_rear := [2, 0, 0, 2]
	for i in range(contacts.size()):
		var source := Image.load_from_file(SOURCE + "farmer_walk_left_%d.png" % contacts[i])
		if source == null or source.get_size() != Vector2i(48, 64):
			push_error("Missing 48x64 farmer contact frame %d" % contacts[i])
			return ERR_FILE_CORRUPT
		var pose := source.duplicate() as Image
		# At row 53 the two legs separate. Everything above it comes directly from the contact.
		pose.fill_rect(Rect2i(0, 53, 48, 11), Color.TRANSPARENT)
		_shift_leg_rows(pose, source, 26, 48, -rear_in[i], bend_rear[i])
		_shift_leg_rows(pose, source, 0, 26, front_in[i], bend_front[i])
		atlas.blit_rect(pose, Rect2i(0, 0, 48, 64), Vector2i(i * 48, 0))
	return atlas.save_png(OUTPUT + "farmer_stride.png")


func _shift_leg_rows(pose: Image, source: Image, left: int, right: int, travel: int, lift: int) -> void:
	for y in range(53, 63):
		var weight := smoothstep(53.0, 61.0, float(y))
		var dx := roundi(travel * weight)
		var dy := roundi(lift * smoothstep(56.0, 62.0, float(y)))
		# Keep the calf and shoe pixels attached, reaching the toe lift over several rows.
		var row := Rect2i(left, y, right - left, 1)
		pose.blit_rect_mask(source, source, row, Vector2i(left + dx, y - dy))


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
