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
	var atlas := Image.create_empty(48 * 4, 64 * 3, false, Image.FORMAT_RGBA8)
	var directions := ["left", "down", "up"]
	for row in range(directions.size()):
		var direction: String = directions[row]
		var sources: Array[Image] = []
		for contact in range(4):
			var art := Image.load_from_file(SOURCE + "farmer_walk_%s_%d.png" % [direction, contact])
			if art == null or art.get_size() != Vector2i(48, 64):
				push_error("Missing 48x64 farmer frame %s %d" % [direction, contact])
				return ERR_FILE_CORRUPT
			sources.append(art)
		# Following the reference's Walk beat: pass, reach, opposite pass, opposite reach.
		# SpriteFrames place the original contacts and settling poses between these cells.
		var passes: Array[int] = [2, 1, 3, 0]
		for column in range(passes.size()):
			var source := sources[passes[column]]
			var pose := source.duplicate() as Image
			if direction == "left":
				_side_step(pose, source, column)
			else:
				_depth_step(pose, source, column)
			atlas.blit_rect(pose, Rect2i(0, 0, 48, 64), Vector2i(column * 48, row * 64))
	return atlas.save_png(OUTPUT + "farmer_stride.png")


func _side_step(pose: Image, source: Image, phase: int) -> void:
	# Bring the intact shoes closer under the hips on the passing beat. Only the swinging
	# shoe lifts one pixel. The two reaching poses come partway back to the original stride.
	var passing := phase % 2 == 0
	var approach := 5 if passing else 2
	var front_lift := -1 if phase == 2 else 0
	var rear_lift := -1 if phase == 0 else 0
	pose.fill_rect(Rect2i(0, 53, 48, 11), Color.TRANSPARENT)
	_side_leg(pose, source, Rect2i(26, 55, 22, 9), Vector2i(-approach, rear_lift))
	_side_leg(pose, source, Rect2i(0, 55, 26, 9), Vector2i(approach, front_lift))


func _side_leg(pose: Image, source: Image, shoe: Rect2i, travel: Vector2i) -> void:
	# Taper the shift at the cuff. Copy the whole shoe once, preserving the sole and toe.
	var seam := Rect2i(shoe.position.x, 53, shoe.size.x, 1)
	pose.blit_rect_mask(source, source, seam, seam.position)
	var cuff := Rect2i(shoe.position.x, 54, shoe.size.x, 1)
	var mid := Vector2i((Vector2(travel) * 0.5).round())
	pose.blit_rect_mask(source, source, cuff, cuff.position + mid)
	pose.blit_rect_mask(source, source, shoe, shoe.position + travel)


func _depth_step(pose: Image, source: Image, phase: int) -> void:
	# In the frontal and rear views the feet move in depth, with very little side travel.
	# Only close the shorter leg toward the ground plane. Leave the support leg untouched.
	var swing_x := 0 if phase in [0, 3] else 24
	var strip := Rect2i(swing_x, 56, 24, 8)
	var used := source.get_region(strip).get_used_rect()
	var shift := clampi(strip.size.y - used.end.y - 1, 0, 2)
	if shift == 0:
		return
	pose.fill_rect(strip, Color.TRANSPARENT)
	var cuff := Rect2i(swing_x, strip.position.y, strip.size.x, 1)
	for y in range(shift):
		pose.blit_rect_mask(source, source, cuff, cuff.position + Vector2i(0, y))
	pose.blit_rect_mask(source, source, strip, strip.position + Vector2i(0, shift))


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
