extends Control

const NO_POINTER := -1
const MOUSE_POINTER := -2

@export var travel_radius := 48.0
@export var deadzone := 8.0

@onready var base: Panel = $Base
@onready var knob: Panel = $Knob

var direction := Vector2.ZERO
var pointer_id := NO_POINTER
var origin := Vector2.ZERO
var center := Vector2.ZERO


func _ready() -> void:
	reset()
	resized.connect(reset)


func is_engaged() -> bool:
	return pointer_id != NO_POINTER


func reset() -> void:
	pointer_id = NO_POINTER
	direction = Vector2.ZERO
	base.hide()
	knob.hide()


func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT and is_node_ready():
		reset()


func _input(event: InputEvent) -> void:
	if event.device == InputEvent.DEVICE_ID_EMULATION:
		return
	var handled := false
	if event is InputEventScreenTouch:
		handled = _press(event.index, event.position) if event.pressed else _release(event.index)
	elif event is InputEventScreenDrag:
		handled = _drag(event.index, event.position)
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		handled = _press(MOUSE_POINTER, event.position) if event.pressed else _release(MOUSE_POINTER)
	elif event is InputEventMouseMotion:
		handled = _drag(MOUSE_POINTER, event.position)
	if handled:
		get_viewport().set_input_as_handled()


func _press(id: int, viewport_point: Vector2) -> bool:
	var point := _local_point(viewport_point)
	if is_engaged() or not Rect2(Vector2.ZERO, size).has_point(point):
		return false
	pointer_id = id
	origin = point
	var half := base.size * 0.5
	center = point.clamp(half, (size - half).max(half))
	base.position = center - half
	knob.position = center - knob.size * 0.5
	base.show()
	knob.show()
	return true


func _drag(id: int, viewport_point: Vector2) -> bool:
	if id != pointer_id:
		return false
	var displacement := _local_point(viewport_point) - origin
	var radius := maxf(travel_radius, 1.0)
	var offset := displacement.limit_length(radius)
	var threshold := clampf(deadzone, 0.0, radius - 0.1)
	var strength := clampf(inverse_lerp(threshold, radius, offset.length()), 0.0, 1.0)
	direction = offset.normalized() * strength
	var knob_travel := maxf(0.0, (base.size.x - knob.size.x) * 0.5)
	knob.position = center + offset * (knob_travel / radius) - knob.size * 0.5
	return true


func _release(id: int) -> bool:
	if id != pointer_id:
		return false
	reset()
	return true


func _local_point(viewport_point: Vector2) -> Vector2:
	return get_global_transform_with_canvas().affine_inverse() * viewport_point
