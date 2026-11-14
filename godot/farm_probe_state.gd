extends RefCounted

const PLOT_ID := "P5_7"
const RICE_ID := "CROP_01"
const Calendar := preload("res://generated/season_calendar.gd")

var snapshot: Dictionary = {}
var land_tiles: Dictionary[String, Dictionary] = {}
var server_now := 0.0
var clock_rate := 0.0
var growth_cuts: Array = []
var synced_at := 0


func receive(reply: Dictionary) -> void:
	snapshot = reply.state
	land_tiles.clear()
	for candidate: Dictionary in snapshot.get("tiles", []):
		if candidate.get("zoneType") == "LAND":
			land_tiles[candidate.id] = candidate
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


func tile(plot_id := PLOT_ID) -> Dictionary:
	return land_tiles.get(plot_id, {})


func stock(item_id := RICE_ID) -> int:
	var inventory: Dictionary = snapshot.get("inventory", {})
	return int(inventory.get(item_id, 0))


func stage(plot: Dictionary) -> int:
	if not plot.get("itemId") is String:
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


func plot_command(plot_id := PLOT_ID) -> Dictionary:
	var plot := tile(plot_id)
	if plot.is_empty():
		return {}
	var crop_stage := stage(plot)
	if crop_stage == -1:
		if rice_out_of_season():
			return {}
		return {"type": "PLANT", "tileId": plot_id, "itemId": RICE_ID}
	if clock_rate == 0.0:
		return {}
	match crop_stage:
		3: return {"type": "HARVEST", "tileId": plot_id}
		_:
			if not plot.get("watered", false):
				return {"type": "WATER", "tileId": plot_id}
	return {}


func seconds_to_mature(plot: Dictionary) -> int:
	var mature_at := float(plot.get("matureAt", 0))
	return maxi(0, ceili((mature_at - now()) / (1000.0 * maxf(1.0, clock_rate))))


func cache_payload() -> Dictionary:
	return {"state": snapshot, "serverNow": now(), "growthCuts": growth_cuts}
