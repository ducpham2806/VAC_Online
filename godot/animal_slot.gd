extends Node2D
## Chỗ nuôi gà, vịt, cá (GP-02). Cùng cách gọi với ô ruộng để dùng chung chạm và kéo.

const INK := Color("#3d2314")
const PAPER := Color("#f3e3c3")
const READY := Color("#ffd166")
const SIZE := Vector2(32, 32)
const CORNER := 8.0
const FISH_SURFACE := 11.0
const FISH_TRAVEL := 20.0
const FISH_HEIGHT := 21.0
const BIRD_STRIDES := {
	"ANI_01": preload("res://sprites/ANI_01_stride.png"),
	"ANI_03": preload("res://sprites/ANI_03_stride.png"),
}

@onready var animal: Sprite2D = $Animal

var frames: Array[Texture2D] = []
var walk_frames: Array[Texture2D] = []
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


func setup(textures: Array[Texture2D], is_aquatic := false, item_id := "") -> void:
	frames = textures
	aquatic = is_aquatic
	rng.seed = hash(str(get_path()))
	var height := float(textures[0].get_height())
	# Chân con vật chạm mép dưới ô.
	animal.offset = Vector2(0, SIZE.y * 0.5 - height * 0.5)
	if aquatic:
		# Rotate around the fish body, which sits low in the source frame.
		animal.offset.y = -6.0
	var atlas: Texture2D = BIRD_STRIDES.get(item_id)
	walk_frames.clear()
	if atlas != null:
		for i in range(4):
			var pose := AtlasTexture.new()
			pose.atlas = atlas
			pose.region = Rect2(i * 48, 0, 48, 48)
			walk_frames.append(pose)
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
	animal.scale = Vector2.ONE
	animal.modulate.a = 1.0
	animal.visible = occupied and state != "SUBMERGED"
	animal.texture = frames[0]
	if state == "WALK":
		wander_from = animal.position
		# Cross to the other half of the slot so the foot poses read as a step.
		wander_to = Vector2(wander_distance if wander_from.x <= 0.0 else -wander_distance, 0)


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
		"PECK":
			# Lean in, touch the ground twice, then return to the upright pose.
			var dip := pow(sin(t * PI), 2.0) * (0.64 + 0.36 * absf(sin(t * TAU)))
			animal.texture = frames[1 if dip >= 0.52 else 0]
			animal.scale.y = 1.0 - 0.035 * dip
		"PREEN":
			var tuck := sin(t * PI)
			animal.rotation = sin(t * TAU * 2.0) * tuck * 0.045
			animal.scale.y = 1.0 - tuck * 0.04
		"WALK":
			animal.position = wander_from.lerp(wander_to, smoothstep(0.0, 1.0, t))
			# Both supplied bird sprites face right.
			animal.flip_h = wander_to.x < wander_from.x
			if not walk_frames.is_empty():
				animal.texture = walk_frames[mini(int(t * walk_frames.size()), walk_frames.size() - 1)]
		"SURFACE":
			_fish_pose(0.0)
			animal.position.y += (1.0 - t) * 4.0
			animal.modulate.a = smoothstep(0.0, 1.0, t)
		"JUMP":
			_fish_pose(t)
		"DIVE":
			_fish_pose(1.0)
			animal.position += Vector2(-3.0, 8.0) * t
			animal.modulate.a = 1.0 - smoothstep(0.0, 1.0, t)
	if aquatic:
		queue_redraw()


func _fish_pose(progress: float) -> void:
	# Parabola in screen coordinates. Source fish looks left, so subtract its rest heading.
	animal.position = Vector2(FISH_TRAVEL * (0.5 - progress),
		FISH_SURFACE - 4.0 * FISH_HEIGHT * progress * (1.0 - progress))
	var velocity := Vector2(-FISH_TRAVEL, 4.0 * FISH_HEIGHT * (2.0 * progress - 1.0))
	animal.rotation = wrapf(velocity.angle() - PI, -PI, PI)
	animal.texture = frames[1 if cos(progress * TAU * 2.0) < 0.0 else 0]


func _draw() -> void:
	if occupied and aquatic:
		var ripple := 0.35 if motion == "SUBMERGED" else 0.7 * (1.0 - clampf(elapsed / duration, 0.0, 1.0))
		var wave_x := FISH_TRAVEL * 0.5 if motion == "SURFACE" else -FISH_TRAVEL * 0.5
		draw_set_transform(Vector2(wave_x, FISH_SURFACE), 0.0, Vector2(1.0, 0.3))
		draw_arc(Vector2.ZERO, 5.0 + fmod(elapsed, 2.0) * 2.0, 0.0, TAU, 20, Color(PAPER, ripple), 1.0)
		draw_set_transform(Vector2.ZERO)
		if motion == "DIVE":
			var t := clampf(elapsed / duration, 0.0, 1.0)
			var splash := Vector2(wave_x, FISH_SURFACE)
			for side in [-1.0, 1.0]:
				draw_circle(splash + Vector2(side * (3.0 + 10.0 * t), -28.0 * t * (1.0 - t)),
					1.25, Color(PAPER, 1.0 - t))
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
