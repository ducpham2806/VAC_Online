extends Sprite2D
## Small in-place shuffles use the supplied idle poses; marker and interaction stay fixed.

@export_range(0.0, 8.0) var shuffle_distance := 5.0
@export_range(2.0, 15.0) var rest_seconds := 6.0
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
			destination = origin + Vector2(rng.randf_range(-shuffle_distance, shuffle_distance), 0)
			remaining = 1.4
		else:
			motion = "IDLE"
			remaining = rng.randf_range(rest_seconds * 0.7, rest_seconds * 1.5)
		elapsed = 0.0
	var pose := "talk" if motion == "TALK" else "idle"
	var frame_index := int(elapsed * (3.0 if motion == "TALK" else 1.2) + phase) % 2
	texture = poses[pose][frame_index]
	if motion == "SHUFFLE":
		position = start.lerp(destination, smoothstep(0.0, 1.0, elapsed / 1.4))
	# The texture is bottom-anchored in the scene: breathing keeps the feet fixed.
	scale = base_scale * Vector2(1.0, 1.0 + sin(elapsed * 1.8 + phase) * 0.006)
	rotation = sin(elapsed * 4.0) * 0.018 if motion == "TALK" else 0.0
