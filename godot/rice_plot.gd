extends Area2D

@export var growth_textures: Array[Texture2D]

@onready var hit_area: CollisionShape2D = $HitArea
@onready var rice: Sprite2D = $Rice
@onready var wet_soil: Sprite2D = $WetSoil


func hits(point: Vector2) -> bool:
	var shape := hit_area.shape as RectangleShape2D
	return Rect2(-shape.size * 0.5, shape.size).has_point(hit_area.to_local(point))


func in_reach(point: Vector2) -> bool:
	var shape := hit_area.shape as RectangleShape2D
	return Rect2(-shape.size * 1.5, shape.size * 3.0).has_point(hit_area.to_local(point))


func approach_point() -> Vector2:
	var shape := hit_area.shape as RectangleShape2D
	return hit_area.to_global(Vector2(-shape.size.x, 0))


func render(stage: int, watered: bool) -> void:
	rice.visible = stage >= 0
	if rice.visible:
		rice.texture = growth_textures[stage]
	wet_soil.visible = watered


func play_effect(action_type: String) -> void:
	match action_type:
		"PLANT":
			$SowFx/Dust.restart()
			$SowFx/Seeds.restart()
		"WATER":
			$WaterFx.restart()
		"HARVEST":
			$HarvestFx.restart()
