extends Node2D
## Mũi tên chỉ chỗ cần làm của bước hướng dẫn (GP-62).

const INK := Color("#3d2314")
const READY := Color("#ffd166")

var phase := 0.0
var anchor := Vector2.ZERO


func point_at(target: Variant) -> void:
	visible = target is Vector2
	set_process(visible)
	if visible:
		anchor = target


func _process(delta: float) -> void:
	phase = fmod(phase + delta * 4.0, TAU)
	global_position = anchor + Vector2(0, -6.0 - absf(sin(phase)) * 6.0)


func _draw() -> void:
	draw_colored_polygon(PackedVector2Array([Vector2(-9, -16), Vector2(9, -16), Vector2(0, 0)]), INK)
	draw_colored_polygon(PackedVector2Array([Vector2(-6, -14), Vector2(6, -14), Vector2(0, -3)]), READY)
