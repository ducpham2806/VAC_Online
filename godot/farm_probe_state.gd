extends RefCounted

const PLOT_ID := "P5_7"
const RICE_ID := "CROP_01"
const Calendar := preload("res://generated/season_calendar.gd")

var snapshot: Dictionary = {}
var server_now := 0.0
var clock_rate := 0.0
var growth_cuts: Array = []
var synced_at := 0


func receive(reply: Dictionary) -> void:
	snapshot = reply.state
	server_now = float(reply.get("serverNow", 0))
	clock_rate = maxf(0.0, float(reply.get("clockRate", 0)))
	growth_cuts = reply.get("growthCuts", [])
	synced_at = Time.get_ticks_msec()


func freeze() -> void:
	server_now = now()
	clock_rate = 0.0


func now() -> float:
	return server_now + (Time.get_ticks_msec() - synced_at) * clock_rate


func season_id() -> String:
	if server_now <= 0.0:
		return ""
	var period := floori((now() - Calendar.EPOCH_MS) / Calendar.DURATION_MS)
	return Calendar.ORDER[posmod(period, Calendar.ORDER.size())]


func season_day() -> int:
	var elapsed := fposmod(now() - Calendar.EPOCH_MS, Calendar.DURATION_MS)
	return floori(elapsed * Calendar.DAYS / Calendar.DURATION_MS) + 1


func rice_out_of_season() -> bool:
	var current := season_id()
	return not current.is_empty() and not Calendar.RICE_SOWING_SEASONS.has(current)


func tile() -> Dictionary:
	for candidate: Dictionary in snapshot.get("tiles", []):
		if candidate.get("id") == PLOT_ID:
			return candidate
	return {}


func stock() -> int:
	var inventory: Dictionary = snapshot.get("inventory", {})
	return int(inventory.get(RICE_ID, 0))


func stage(plot: Dictionary) -> int:
	if plot.get("itemId") != RICE_ID:
		return -1
	var mature_at: float = plot.get("matureAt", 0)
	if now() >= mature_at:
		return 3
	if growth_cuts.size() == 2:
		var planted_at: float = plot.get("plantedAt", mature_at)
		var progress := inverse_lerp(planted_at, mature_at, now()) if mature_at > planted_at else 0.0
		if progress >= float(growth_cuts[1]):
			return 2
		if progress >= float(growth_cuts[0]):
			return 1
		return 0
	return 1 if plot.get("watered", false) else 0


func plot_command() -> Dictionary:
	var plot := tile()
	if plot.is_empty():
		return {}
	var crop_stage := stage(plot)
	if crop_stage == -1:
		if rice_out_of_season():
			return {}
		return {"type": "PLANT", "tileId": PLOT_ID, "itemId": RICE_ID}
	if clock_rate == 0.0:
		return {}
	match crop_stage:
		3: return {"type": "HARVEST", "tileId": PLOT_ID}
		_:
			if not plot.get("watered", false):
				return {"type": "WATER", "tileId": PLOT_ID}
	return {}


func seconds_to_mature(plot: Dictionary) -> int:
	var mature_at := float(plot.get("matureAt", 0))
	return maxi(0, ceili((mature_at - now()) / (1000.0 * maxf(1.0, clock_rate))))


func cache_payload() -> Dictionary:
	return {"state": snapshot, "serverNow": now(), "growthCuts": growth_cuts}
