extends Node2D
## Chỗ nuôi gà, vịt, cá (GP-02). Cùng cách gọi với ô ruộng để dùng chung chạm và kéo.

const INK := Color("#3d2314")
const PAPER := Color("#f3e3c3")
const READY := Color("#ffd166")
const SIZE := Vector2(32, 32)
const CORNER := 8.0

@onready var animal: Sprite2D = $Animal

var frames: Array[Texture2D] = []
var occupied := false
var ripe := false
var selected := false
@export_range(1.0, 20.0) var idle_min := 4.0
@export_range(1.0, 30.0) var idle_max := 8.0
@export_range(0.0, 8.0) var wander_distance := 5.0
var aquatic := false
var motion := "IDLE"
var remaining := 0.0
var elapsed := 0.0
var duration := 1.0
var wander_from := Vector2.ZERO
var wander_to := Vector2.ZERO
var rng := RandomNumberGenerator.new()


func setup(textures: Array[Texture2D], is_aquatic := false) -> void:
	frames = textures
	aquatic = is_aquatic
	rng.seed = hash(str(get_path()))
	var height := float(textures[0].get_height())
	# Chân con vật chạm mép dưới ô.
	animal.offset = Vector2(0, SIZE.y * 0.5 - height * 0.5)
	set_process(false)


func hits(point: Vector2) -> bool:
	return world_area().has_point(point)


func world_area() -> Rect2:
	return Rect2(global_position - SIZE * 0.5, SIZE)


func render(stage: int, _watered: bool, is_selected: bool, _frames: Array) -> void:
	var now_occupied := stage >= 0
	var now_ripe := stage == 3
	if now_occupied == occupied and now_ripe == ripe and is_selected == selected:
		return
	var was_occupied := occupied
	occupied = now_occupied
	ripe = now_ripe
	selected = is_selected
	if occupied and not was_occupied:
		animal.position = Vector2.ZERO
		_enter("SUBMERGED" if aquatic else "IDLE", rng.randf_range(idle_min, idle_max))
	elif not occupied:
		animal.visible = false
		animal.position = Vector2.ZERO
		animal.rotation = 0.0
	set_process(occupied)
	queue_redraw()


func _enter(state: String, seconds: float) -> void:
	motion = state
	elapsed = 0.0
	duration = seconds
	remaining = seconds
	animal.rotation = 0.0
	animal.modulate.a = 1.0
	animal.visible = occupied and state != "SUBMERGED"
	animal.texture = frames[0]
	if state == "WALK":
		wander_from = animal.position
		wander_to = Vector2(rng.randf_range(-wander_distance, wander_distance), 0)


func _process(delta: float) -> void:
	elapsed += delta
	remaining -= delta
	if remaining <= 0.0:
		if aquatic:
			match motion:
				"SUBMERGED": _enter("SURFACE", 0.4)
				"SURFACE": _enter("JUMP", 0.9)
				"JUMP": _enter("DIVE", 0.4)
				_: _enter("SUBMERGED", rng.randf_range(idle_min * 1.5, idle_max * 1.5))
		elif motion == "IDLE":
			var action: String = ["PECK", "WALK", "PREEN"][rng.randi_range(0, 2)]
			_enter(action, 1.4 if action == "WALK" else 1.1)
		else:
			animal.position.y = 0.0
			_enter("IDLE", rng.randf_range(idle_min, idle_max))
	var t := clampf(elapsed / duration, 0.0, 1.0)
	match motion:
		"PECK": animal.texture = frames[1 if int(elapsed * 5.0) % 2 == 0 else 0]
		"PREEN": animal.rotation = sin(t * TAU) * 0.07
		"WALK":
			animal.position = wander_from.lerp(wander_to, smoothstep(0.0, 1.0, t))
			animal.position.y = -absf(sin(t * TAU * 2.0))
			animal.flip_h = wander_to.x > wander_from.x
		"SURFACE":
			animal.modulate.a = t * 0.6
			animal.position.y = 2.0
		"JUMP":
			animal.texture = frames[int(t * 8.0) % 2]
			animal.position.y = -sin(t * PI) * 12.0
			animal.rotation = lerpf(-0.3, 0.3, t)
		"DIVE":
			animal.position.y = t * 4.0
			animal.modulate.a = 1.0 - t
	queue_redraw()


func _draw() -> void:
	if occupied and aquatic:
		var ripple := 0.35 if motion == "SUBMERGED" else 0.7 * (1.0 - clampf(elapsed / duration, 0.0, 1.0))
		draw_set_transform(Vector2(0, 12), 0.0, Vector2(1.0, 0.3))
		draw_arc(Vector2.ZERO, 5.0 + fmod(elapsed, 2.0) * 2.0, 0.0, TAU, 20, Color(PAPER, ripple), 1.0)
		draw_set_transform(Vector2.ZERO)
	var area := Rect2(-SIZE * 0.5, SIZE).grow(-2)
	if not occupied or selected:
		var color := READY if selected else Color(PAPER, 0.85)
		for corner: Vector2 in [area.position, Vector2(area.end.x, area.position.y), area.end, Vector2(area.position.x, area.end.y)]:
			var inward := (area.get_center() - corner).sign()
			draw_line(corner, corner + Vector2(inward.x * CORNER, 0), color, 2.0)
			draw_line(corner, corner + Vector2(0, inward.y * CORNER), color, 2.0)
	if ripe:
		var mark := Vector2(area.end.x - 5, area.position.y + 3)
		draw_circle(mark, 5.0, INK)
		draw_circle(mark, 3.5, READY)


func play_effect(_action_type: String) -> void:
	var pop := create_tween()
	scale = Vector2(1.25, 1.25)
	pop.tween_property(self, "scale", Vector2.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
