extends Sprite2D
## Short steps use their own foot poses while the interaction marker stays fixed.

@export_range(0.0, 8.0) var shuffle_distance := 5.0
@export_range(2.0, 15.0) var rest_seconds := 6.0
@export var step_atlas: Texture2D
var step_frames: Array[Texture2D] = []
var poses: Dictionary = {}
var motion := "IDLE"
var elapsed := 0.0
var remaining := 1.0
var origin := Vector2.ZERO
var destination := Vector2.ZERO
var start := Vector2.ZERO
var base_scale := Vector2.ONE
var phase := 0.0
var rng := RandomNumberGenerator.new()


func configure(frames: Dictionary) -> void:
	poses = frames
	step_frames.clear()
	if step_atlas != null:
		var cell := step_atlas.get_size() / Vector2(4, 1)
		for i in range(4):
			var pose := AtlasTexture.new()
			pose.atlas = step_atlas
			pose.region = Rect2(Vector2(cell.x * i, 0), cell)
			step_frames.append(pose)
	origin = position
	base_scale = scale
	rng.seed = hash(str(get_path()))
	phase = rng.randf_range(0.0, TAU)
	remaining = rng.randf_range(2.0, rest_seconds)


func talk() -> void:
	motion = "TALK"
	elapsed = 0.0
	remaining = 2.4


func _process(delta: float) -> void:
	if poses.is_empty():
		return
	elapsed += delta
	remaining -= delta
	if remaining <= 0.0:
		if motion == "IDLE":
			motion = "SHUFFLE"
			start = position
			destination = origin + Vector2(-shuffle_distance if start.x > origin.x else shuffle_distance, 0)
			remaining = 1.4
		else:
			motion = "IDLE"
			remaining = rng.randf_range(rest_seconds * 0.7, rest_seconds * 1.5)
		elapsed = 0.0
	var pose := "talk" if motion == "TALK" else "idle"
	var frame_index := int(elapsed * 2.0) % 2 if motion == "TALK" else int(elapsed * 1.2 + phase) % 2
	texture = poses[pose][frame_index]
	if motion == "SHUFFLE":
		var progress := clampf(elapsed / 1.4, 0.0, 1.0)
		position = start.lerp(destination, smoothstep(0.0, 1.0, progress))
		if not step_frames.is_empty():
			var step := mini(int(progress * 4.0), 3)
			texture = step_frames[step if destination.x > start.x else 3 - step]
	# The texture is bottom-anchored in the scene: breathing keeps the feet fixed.
	scale = base_scale * Vector2(1.0, 1.0 + sin(elapsed * 1.8 + phase) * 0.006)
	rotation = sin(elapsed * 4.0) * 0.018 if motion == "TALK" else 0.0
