extends AnimatedSprite2D

@export_range(1.0, 500.0, 1.0, "suffix:px/s") var walk_speed := 96.0

@export_range(16.0, 96.0) var walk_cycle_distance := 48.0
var walk_distance := 0.0
var facing := "down"
var _foot_offsets: Dictionary = {}
var idle_time := 0.0
var base_scale := Vector2.ONE
var work_pose: Tween


func _ready() -> void:
	base_scale = scale
	frame_changed.connect(_ground_feet)
	_ground_feet()


func _process(delta: float) -> void:
	idle_time += delta
	scale = base_scale * Vector2(1.0, 1.0 + sin(idle_time * 1.8) * 0.005) if str(animation).begins_with("idle_") else base_scale


func _ground_feet() -> void:
	var image_texture := sprite_frames.get_frame_texture(animation, frame)
	if not _foot_offsets.has(image_texture):
		var image := image_texture.get_image()
		_foot_offsets[image_texture] = image.get_height() * 0.5 - image.get_used_rect().end.y
	offset.y = _foot_offsets[image_texture]


func step_toward(target: Vector2, delta: float) -> bool:
	var next := global_position.move_toward(target, walk_speed * delta)
	var movement := next - global_position
	if movement.is_zero_approx():
		stand()
		return true

	global_position = next
	if work_pose != null and work_pose.is_running():
		work_pose.kill()
		rotation_degrees = 0.0
	_face(movement)
	flip_h = facing == "right"
	var clip := StringName("walk_" + facing)
	if animation != clip:
		animation = clip
	pause()
	walk_distance += movement.length()
	var frame_count := sprite_frames.get_frame_count(clip)
	frame = int(walk_distance / walk_cycle_distance * frame_count) % frame_count
	_ground_feet()
	return next.is_equal_approx(target)


func _face(movement: Vector2) -> void:
	if absf(movement.x) > absf(movement.y):
		facing = "left" if movement.x < 0.0 else "right"
	elif not movement.is_zero_approx():
		facing = "up" if movement.y < 0.0 else "down"


func stand() -> void:
	flip_h = facing == "right"
	var idle := StringName("idle_" + facing)
	if animation != idle:
		animation = idle
		stop()
		_ground_feet()


func work_toward(target: Vector2) -> void:
	_face(target - global_position)
	stand()
	if work_pose != null:
		work_pose.kill()
	var lean := -8.0 if facing == "left" else 8.0
	work_pose = create_tween()
	work_pose.tween_property(self, "rotation_degrees", lean, 0.10)
	work_pose.tween_property(self, "rotation_degrees", 0.0, 0.22)
