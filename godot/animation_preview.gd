extends Node2D
## F6: a local animation review, without Auth, farm saves or server actions.

@export var walk_end := Vector2(540, 300)
@export_range(1.0, 20.0) var walk_pause := 2.5
var walk_start := Vector2.ZERO
var pause_left := 2.5
var forward := true
var talk_clock := 0.0

func _ready() -> void:
	RenderingServer.set_default_clear_color(Color("#f3e3c3"))
	walk_start = $Farmer.position
	for entry in [[$Hen, "ANI_01"], [$Duck, "ANI_03"], [$Fish, "AQUA_01"]]:
		var textures: Array[Texture2D] = [load("res://generated/%s_0.png" % entry[1]), load("res://generated/%s_1.png" % entry[1])]
		entry[0].setup(textures, entry[1] == "AQUA_01", entry[1])
		entry[0].render(3, false, false, [])
	for entry in [[$BacBay, "bacbay"], [$CoHuong, "cohuong"]]:
		var frames := {}
		for pose in ["idle", "talk"]:
			frames[pose] = [load("res://generated/npc_%s_%s_0.png" % [entry[1], pose]), load("res://generated/npc_%s_%s_1.png" % [entry[1], pose])]
		entry[0].configure(frames)
	$Crop.render(3, true, false, [])
	var wind := ShaderMaterial.new()
	wind.shader = preload("res://ambient_wind.gdshader")
	wind.set_shader_parameter("strength", 1.2)
	$Tree.material = wind

func _process(delta: float) -> void:
	talk_clock += delta
	if talk_clock >= 12.0:
		$BacBay.talk()
		$CoHuong.talk()
		talk_clock = 0.0
	if pause_left > 0.0:
		pause_left -= delta
		$Farmer.stand()
	elif $Farmer.step_toward(walk_end if forward else walk_start, delta):
		forward = not forward
		pause_left = walk_pause
	queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(274, 112, 52, 40), Color("#2e8b8d"))
	var font := ThemeDB.fallback_font
	var ink := Color("#3d2314")
	draw_string(font, Vector2(20, 28), "VAC · Xem chuyển động (F6)", HORIZONTAL_ALIGNMENT_LEFT, -1, 20, ink)
	draw_string(font, Vector2(20, 50), "Dùng asset hiện có · không tác động bản lưu", HORIZONTAL_ALIGNMENT_LEFT, -1, 14, ink)
	for entry in [["Gà", 60], ["Vịt", 175], ["Cá", 290], ["Lúa", 405], ["Cây", 535]]:
		draw_string(font, Vector2(entry[1], 196), entry[0], HORIZONTAL_ALIGNMENT_LEFT, -1, 14, ink)
	draw_string(font, Vector2(48, 338), "NPC: nghỉ / bước ngắn / nói", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, ink)
	draw_string(font, Vector2(340, 338), "Điền chủ: nghỉ / đi trái–phải", HORIZONTAL_ALIGNMENT_LEFT, -1, 13, ink)
	draw_string(font, Vector2(20, 220), "Gà: %s · Cá: %s" % [$Hen.motion, $Fish.motion], HORIZONTAL_ALIGNMENT_LEFT, -1, 13, ink)
