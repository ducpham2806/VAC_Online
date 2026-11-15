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
var bob := 0.0


func setup(textures: Array[Texture2D]) -> void:
	frames = textures
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
	occupied = now_occupied
	ripe = now_ripe
	selected = is_selected
	animal.visible = occupied
	if occupied:
		animal.texture = frames[1 if ripe else 0]
	animal.position = Vector2.ZERO
	set_process(ripe)
	queue_redraw()


func _process(delta: float) -> void:
	bob = fmod(bob + delta * 5.0, TAU)
	animal.position.y = -absf(sin(bob)) * 3.0


func _draw() -> void:
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
