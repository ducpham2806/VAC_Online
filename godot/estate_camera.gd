extends Camera2D

@export var follow_offset := Vector2(69.0, -34.0)
@export_range(0.1, 24.0, 0.1) var follow_speed := 8.0

var world_bounds := Rect2()
var following := true


func configure(bounds: Rect2, target: Vector2) -> void:
	world_bounds = bounds
	_move_center(target + follow_offset)
	force_update_scroll()


func follow() -> void:
	following = true


func track(target: Vector2, delta: float) -> void:
	if following:
		var weight := 1.0 - exp(-follow_speed * delta)
		_move_center(global_position.lerp(target + follow_offset, weight))


func pan(viewport_delta: Vector2) -> void:
	following = false
	_move_center(global_position - viewport_delta / zoom)


func fit_viewport() -> void:
	_move_center(global_position)
	force_update_scroll()


func _move_center(target: Vector2) -> void:
	var half_view := (get_viewport_rect().size / zoom * 0.5).min(world_bounds.size * 0.5)
	var center := target.clamp(world_bounds.position + half_view, world_bounds.end - half_view)
	if not global_position.is_equal_approx(center):
		global_position = center
		force_update_scroll()
