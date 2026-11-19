extends SceneTree
## Presentation-only checks: pause budgets, submersion, stride and fixed interaction anchors.

var checks := 0
var failures := 0

func _initialize() -> void:
	_run.call_deferred()

func check(ok: bool, label: String) -> void:
	checks += 1
	if not ok:
		failures += 1
	print(("PASS " if ok else "FAIL ") + label)

func _run() -> void:
	var farmer = load("res://farmer.tscn").instantiate()
	root.add_child(farmer)
	farmer.set_process(false)
	farmer.step_toward(Vector2(24, 0), 0.125)
	check(farmer.animation == &"walk_right" and farmer.flip_h, "đi phải dùng bộ chân trái lật hướng")
	check(farmer.frame == 2, "khung chân đi theo quãng đường thực")
	var stride: SpriteFrames = farmer.sprite_frames
	var unique_poses := {}
	for i in range(stride.get_frame_count(&"walk_right")):
		unique_poses[stride.get_frame_texture(&"walk_right", i).get_image().get_data()] = true
	check(unique_poses.size() == 8, "duỗi, dồn lực, chân ngang và nhấc gót có 8 dáng riêng")
	var distance: float = farmer.walk_distance
	farmer.step_toward(farmer.position, 1.0)
	check(farmer.walk_distance == distance and str(farmer.animation).begins_with("idle"), "dừng thì không chạy chân")
	check(absf(farmer.offset.y + farmer.sprite_frames.get_frame_texture(farmer.animation, 0).get_image().get_used_rect().end.y - 32.0) < 0.01, "idle giữ chân ở gốc nhân vật")
	farmer.step_toward(Vector2(-24, 0), 0.125)
	check(farmer.animation == &"walk_left" and not farmer.flip_h, "đi trái không bị lẫn hướng")
	var animals: Array[Node] = []
	for i in range(2):
		var animal = load("res://animal_slot.tscn").instantiate()
		animal.name = "Animal%d" % i
		root.add_child(animal)
		var textures: Array[Texture2D] = [load("res://generated/%s_0.png" % ("ANI_01" if i == 0 else "AQUA_01")), load("res://generated/%s_1.png" % ("ANI_01" if i == 0 else "AQUA_01"))]
		animal.setup(textures, i == 1, "ANI_01" if i == 0 else "AQUA_01")
		animal.render(3, false, false, [])
		animal.set_process(false)
		animals.append(animal)
	var hen = animals[0]
	var fish = animals[1]
	check(hen.motion == "IDLE" and hen.animal.texture == hen.frames[0], "gà chín vẫn nghỉ, không mổ liên tục")
	check(fish.motion == "SUBMERGED" and not fish.animal.visible, "cá nghỉ dưới nước")
	var resting := 0
	var underwater := 0
	var seen := {}
	for i in range(1200):
		hen._process(0.1)
		fish._process(0.1)
		seen[hen.motion] = true
		seen[fish.motion] = true
		resting += int(hen.motion == "IDLE")
		underwater += int(fish.motion == "SUBMERGED")
	check(resting > 850, "gà dành phần lớn thời gian nghỉ")
	check(underwater > 950, "cá dành phần lớn thời gian lặn")
	for state in ["PECK", "WALK", "PREEN", "SURFACE", "JUMP", "DIVE"]:
		check(seen.has(state), "có trạng thái " + state)
	fish._enter("JUMP", 0.9)
	fish._process(0.1)
	check(Vector2.LEFT.rotated(fish.animal.rotation).y < -0.7, "đầu cá hướng lên khi cất mình")
	fish._process(0.35)
	check(fish.animal.position.y < -9.0 and absf(fish.animal.rotation) < 0.01, "cá nằm ngang ở đỉnh cung")
	fish._process(0.35)
	check(Vector2.LEFT.rotated(fish.animal.rotation).y > 0.7, "đầu cá chúi xuống khi rơi")
	fish._process(0.15)
	check(fish.motion == "DIVE" and Vector2.LEFT.rotated(fish.animal.rotation).y > 0.7, "cá giữ hướng đầu khi chìm")
	check(hen.walk_frames.size() == 4, "gà có khung nhấc chân riêng")
	fish._enter("SUBMERGED", 9.0)
	fish.render(3, false, true, [])
	check(fish.motion == "SUBMERGED" and not fish.animal.visible, "chọn ô không ép cá nổi lên")
	var npc = Sprite2D.new()
	npc.set_script(load("res://ambient_npc.gd"))
	npc.centered = false
	npc.step_atlas = load("res://sprites/npc_bacbay_step.png")
	npc.offset = Vector2(-24, -64)
	root.add_child(npc)
	npc.configure({"idle": [load("res://generated/npc_bacbay_idle_0.png"), load("res://generated/npc_bacbay_idle_1.png")], "talk": [load("res://generated/npc_bacbay_talk_0.png"), load("res://generated/npc_bacbay_talk_1.png")]})
	npc.set_process(false)
	var moved := false
	var used_step := false
	for i in range(500):
		npc._process(0.1)
		moved = moved or npc.position.x != npc.origin.x
		used_step = used_step or npc.texture in npc.step_frames
	check(moved and absf(npc.position.x - npc.origin.x) <= npc.shuffle_distance, "NPC bước quanh trong vùng tương tác")
	check(used_step, "NPC đổi khung chân khi bước")
	npc.talk()
	npc._process(0.4)
	check(npc.motion == "TALK" and npc.texture in npc.poses.talk, "NPC chuyển dáng nói chuyện")
	farmer.queue_free()
	npc.queue_free()
	for animal in animals:
		animal.queue_free()
	await process_frame
	print("%d/%d bước qua" % [checks - failures, checks])
	quit(1 if failures else 0)
