extends AnimatedSprite2D

@export_range(1.0, 500.0, 1.0, "suffix:px/s") var walk_speed := 96.0

var facing := "down"
var work_pose: Tween


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
	play("walk_" + facing)
	return next.is_equal_approx(target)


func _face(movement: Vector2) -> void:
	if absf(movement.x) > absf(movement.y):
		facing = "left" if movement.x < 0.0 else "right"
	elif not movement.is_zero_approx():
		facing = "up" if movement.y < 0.0 else "down"


func stand() -> void:
	var idle := StringName("idle_" + facing)
	if animation != idle:
		animation = idle
		stop()


func work_toward(target: Vector2) -> void:
	_face(target - global_position)
	stand()
	if work_pose != null:
		work_pose.kill()
	var lean := -8.0 if facing == "left" else 8.0
	work_pose = create_tween()
	work_pose.tween_property(self, "rotation_degrees", lean, 0.10)
	work_pose.tween_property(self, "rotation_degrees", 0.0, 0.22)
