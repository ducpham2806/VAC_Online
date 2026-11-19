extends Area2D

@export_range(0.0, 3.0) var wind_strength := 0.7
@export var growth_textures: Array[Texture2D]

@onready var hit_area: CollisionShape2D = $HitArea
@onready var rice: Sprite2D = $Rice
@onready var wet_soil: Sprite2D = $WetSoil


func _ready() -> void:
	var wind := ShaderMaterial.new()
	wind.shader = preload("res://ambient_wind.gdshader")
	wind.set_shader_parameter("strength", wind_strength)
	wind.set_shader_parameter("rooted_from", 0.75)
	wind.set_shader_parameter("phase", global_position.x * 0.03 + global_position.y * 0.017)
	rice.material = wind


func hits(point: Vector2) -> bool:
	return world_area().has_point(point)


func world_area() -> Rect2:
	var shape := hit_area.shape as RectangleShape2D
	return hit_area.global_transform * Rect2(-shape.size * 0.5, shape.size)


func render(stage: int, watered: bool, selected: bool, frames: Array) -> void:
	rice.visible = stage >= 0
	if rice.visible:
		rice.texture = growth_textures[stage] if frames.is_empty() else frames[stage]
	wet_soil.visible = watered
	$Outline.visible = selected


func play_effect(action_type: String) -> void:
	match action_type:
		"PLANT":
			$SowFx/Dust.restart()
			$SowFx/Seeds.restart()
		"WATER":
			$WaterFx.restart()
		"HARVEST":
			$HarvestFx.restart()
