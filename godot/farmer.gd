extends AnimatedSprite2D

@export_range(1.0, 500.0, 1.0, "suffix:px/s") var walk_speed := 96.0

var facing := "down"


func step_toward(target: Vector2, delta: float) -> bool:
	var next := global_position.move_toward(target, walk_speed * delta)
	var movement := next - global_position
	if movement.is_zero_approx():
		stand()
		return true

	global_position = next
	if absf(movement.x) > absf(movement.y):
		facing = "left" if movement.x < 0.0 else "right"
	else:
		facing = "up" if movement.y < 0.0 else "down"
	play("walk_" + facing)
	return next.is_equal_approx(target)


func stand() -> void:
	var idle := StringName("idle_" + facing)
	if animation != idle:
		animation = idle
		stop()
