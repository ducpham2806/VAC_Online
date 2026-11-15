extends Node
## Âm thanh tổng hợp khi chạy (AR-40): tiếng gảy và gõ từ sóng sin tắt dần, không dùng file ngoài.

const RATE := 22050
const VOICES := 4
## Mỗi tiếng là các nốt [tần số Hz, bắt đầu giây, dài giây, độ lớn]; tần số 0 là tiếng xào xạc.
const SOUNDS := {
	"tap": [[880.0, 0.0, 0.06, 0.35]],
	"plant": [[392.0, 0.0, 0.12, 0.4], [523.3, 0.05, 0.14, 0.35]],
	"water": [[0.0, 0.0, 0.28, 0.3], [659.3, 0.04, 0.2, 0.2]],
	"harvest": [[523.3, 0.0, 0.12, 0.4], [659.3, 0.07, 0.12, 0.4], [784.0, 0.14, 0.2, 0.4]],
	"coin": [[1046.5, 0.0, 0.1, 0.35], [1318.5, 0.08, 0.25, 0.35]],
	"work": [[146.8, 0.0, 0.16, 0.5], [0.0, 0.0, 0.1, 0.25]],
	"page": [[0.0, 0.0, 0.16, 0.22], [587.3, 0.06, 0.18, 0.25]],
	"error": [[220.0, 0.0, 0.14, 0.35], [196.0, 0.1, 0.2, 0.35]],
	"fanfare": [[523.3, 0.0, 0.16, 0.4], [659.3, 0.12, 0.16, 0.4], [784.0, 0.24, 0.16, 0.4], [1046.5, 0.36, 0.45, 0.4]],
}

var muted := false
var streams: Dictionary[String, AudioStreamWAV] = {}
var players: Array[AudioStreamPlayer] = []
var next_voice := 0


func _ready() -> void:
	for id: String in SOUNDS:
		streams[id] = _render(SOUNDS[id])
	for index in range(VOICES):
		var player := AudioStreamPlayer.new()
		player.volume_db = -8.0
		add_child(player)
		players.append(player)


func play(id: String) -> void:
	if muted or not streams.has(id):
		return
	var player := players[next_voice]
	next_voice = (next_voice + 1) % VOICES
	player.stream = streams[id]
	player.play()


func _render(notes: Array) -> AudioStreamWAV:
	var length := 0.0
	for note: Array in notes:
		length = maxf(length, float(note[1]) + float(note[2]))
	var count := int(length * RATE)
	var samples := PackedFloat32Array()
	samples.resize(count)
	var noise := RandomNumberGenerator.new()
	noise.seed = 7
	for note: Array in notes:
		var first := int(float(note[1]) * RATE)
		var span := int(float(note[2]) * RATE)
		var smooth := 0.0
		for step in range(span):
			var time := float(step) / RATE
			# Vào nhanh 4 ms rồi tắt dần như dây gảy.
			var envelope := minf(1.0, time / 0.004) * exp(-5.0 * float(step) / span)
			var wave := 0.0
			if float(note[0]) > 0.0:
				wave = sin(TAU * float(note[0]) * time) + 0.25 * sin(TAU * float(note[0]) * 2.0 * time)
			else:
				# Lọc thấp tiếng ồn để ra tiếng nước, lá.
				smooth = lerpf(smooth, noise.randf_range(-1.0, 1.0), 0.35)
				wave = smooth * 2.0
			samples[first + step] += wave * envelope * float(note[3])
	var data := PackedByteArray()
	data.resize(count * 2)
	for index in range(count):
		data.encode_s16(index * 2, int(clampf(samples[index], -1.0, 1.0) * 32000.0))
	var stream := AudioStreamWAV.new()
	stream.format = AudioStreamWAV.FORMAT_16_BITS
	stream.mix_rate = RATE
	stream.data = data
	return stream
