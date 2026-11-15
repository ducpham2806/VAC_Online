extends SceneTree
## LT-14 bước 3. Kiểm vật nuôi, chọn giống, Bếp Củi, Kho và đơn HTX trên cảnh thật.
## Chạy theo tools/qa/godot-p1-9-flow.sh, cần máy chủ thử ở bộ dựng sẵn p1-9.

var probe: Node
var failures := 0
var checks := 0


func _initialize() -> void:
	_run()


func check(ok: bool, label: String) -> void:
	checks += 1
	if not ok:
		failures += 1
	print(("PASS " if ok else "FAIL ") + label)


func until(condition: Callable, seconds := 20.0) -> bool:
	var deadline := Time.get_ticks_msec() + int(seconds * 1000)
	while Time.get_ticks_msec() < deadline:
		if condition.call():
			return true
		await process_frame
	return condition.call()


func idle() -> bool:
	return not probe.busy and probe.pending_task.is_empty()


func act(id: String) -> void:
	await until(idle)
	probe.selected_plot = id
	probe._on_action()
	await process_frame
	await until(idle, 30.0)


func press(id: String) -> bool:
	# Bảng đơn có thể tự xin đơn mới ngay sau khi mở.
	await process_frame
	await process_frame
	await until(func() -> bool: return not probe.busy)
	await process_frame
	var button := probe.sheet.rows_box.find_child(id, true, false) as Button
	if button == null or button.disabled:
		return false
	button.pressed.emit()
	await process_frame
	await until(func() -> bool: return not probe.busy)
	await process_frame
	return true


func tap_target(id: String) -> void:
	await until(idle)
	for target: Dictionary in probe.features.targets:
		if target.rule.get("id") == id:
			probe._queue_task({"target": target}, probe.features.world_area(target))
	await process_frame
	await until(idle, 30.0)


func ripe(id: String) -> bool:
	return probe.farm.stage(probe.farm.tile(id)) == 3


func item(id: String) -> Variant:
	return probe.farm.tile(id).get("itemId")


func _run() -> void:
	probe = (load("res://estate_probe.tscn") as PackedScene).instantiate()
	root.add_child(probe)
	check(await until(func() -> bool: return probe.connected, 15.0), "đọc được nông trại p1-9")
	var farm: RefCounted = probe.farm
	check(int(farm.snapshot.get("level", 0)) == 5, "nông trại thử ở cấp 5")

	# Vật nuôi: mỗi chỗ thả đúng loài, không cần tưới.
	check(probe.plots["P20_13"].visible and probe.plots["P24_6"].visible, "hiện chỗ nuôi gà và chỗ nuôi ở ao")
	var gold := int(farm.snapshot.gold)
	await act("P20_13")
	check(item("P20_13") == "ANI_01", "thả gà ở sân chuồng")
	check(int(farm.snapshot.gold) == gold - int(probe.features.data.items.ANI_01.cost), "trừ đúng tiền mua gà")
	await act("P21_13")
	await act("P24_6")
	check(item("P24_6") == "ANI_03", "thả vịt ở mép ao")
	await act("P25_8")
	check(item("P25_8") == "AQUA_01", "thả cá ở ao")
	check(probe._plot_command("P25_8").is_empty(), "chỗ nuôi không có lệnh tưới")

	# Chọn giống rồi gieo.
	probe._open_sheet("SEEDS")
	check(probe.sheet.visible, "mở bảng chọn giống")
	check(await press("seed_CROP_05"), "chọn giống cải")
	check(probe.seed_id == "CROP_05" and not probe.sheet.visible, "đóng bảng sau khi chọn")
	for id: String in ["P5_7", "P6_7", "P7_7"]:
		await act(id)
		await act(id)
	check(item("P5_7") == "CROP_05" and farm.tile("P5_7").get("watered", false), "gieo và tưới cải")
	probe._open_sheet("SEEDS")
	await press("seed_CROP_04")
	await act("P5_8")
	await act("P5_8")
	check(item("P5_8") == "CROP_04", "gieo hành ở ô khác")
	probe._open_sheet("SEEDS")
	await press("seed_CROP_01")
	for id: String in ["P6_8", "P7_8"]:
		await act(id)
		await act(id)

	check(await until(func() -> bool: return ripe("P6_8") and ripe("P7_8"), 30.0), "lúa chín")
	await act("P6_8")
	await act("P7_8")
	check(farm.stock("CROP_01") >= 3, "thu đủ lúa nấu cơm")

	# Bếp Củi mở khi chạm bếp đã sửa.
	await tap_target("KITCHEN")
	check(probe.sheet.visible and probe.sheet_kind == "KITCHEN", "chạm Bếp Củi mở bảng bếp")
	check(await press("cook_PROD_01"), "nấu Cơm Trắng")
	var machine: Dictionary = farm.snapshot.machines.MAC_02
	check(machine.craftItemId == "PROD_01", "bếp đang nấu cơm")
	check(await until(func() -> bool: return farm.now() >= float(farm.snapshot.machines.MAC_02.readyAt), 30.0), "cơm chín")
	await until(func() -> bool: return probe.sheet.rows_box.find_child("collect", true, false) != null, 3.0)
	check(await press("collect"), "lấy món")
	check(farm.stock("PROD_01") == 1, "cơm vào kho")
	probe.sheet.close()

	check(await until(func() -> bool: return ripe("P25_8") and ripe("P5_7") and ripe("P6_7") and ripe("P7_7") and ripe("P5_8"), 40.0), "cá, cải, hành tới lứa")
	for id: String in ["P25_8", "P5_7", "P6_7", "P7_7", "P5_8"]:
		await act(id)
	check(farm.stock("AQUA_01") >= 1 and farm.stock("CROP_05") >= 2 and farm.stock("CROP_04") >= 1, "thu cá, cải, hành")
	check(item("P25_8") == "AQUA_01", "cá còn lứa sau khi thu")

	# Nồi Đất tìm món mới.
	await tap_target("KITCHEN")
	for id: String in ["pot_AQUA_01", "pot_CROP_05", "pot_CROP_05", "pot_CROP_04"]:
		await press(id)
	check(probe.pot.size() == 4, "bỏ 4 nguyên liệu vào Nồi Đất")
	check(await press("discover"), "thử nấu")
	check(farm.snapshot.get("discoveredRecipes", []).has("PROD_03"), "tìm ra Canh Cải Cá Rô Đồng")
	check(probe.sheet.rows_box.find_child("cook_PROD_03", true, false) != null, "món mới có nút Nấu")
	probe.sheet.close()

	# Kho: ăn cơm hồi năng lượng, bán hành.
	# Dọn đá để tốn năng lượng rồi ăn cơm hồi lại.
	var stones: int = farm.stock("MAT_DA")
	await tap_target("R_19_10")
	check(farm.stock("MAT_DA") > stones, "dọn đá nhận đá")
	var stamina: int = int(farm.snapshot.stamina)
	probe._open_sheet("STORE")
	check(await press("eat_PROD_01"), "ăn cơm")
	check(farm.stock("PROD_01") == 0 and int(farm.snapshot.stamina) > stamina, "ăn cơm hồi năng lượng")
	gold = int(farm.snapshot.gold)
	var onions: int = farm.stock("CROP_04")
	check(await press("sell_CROP_04"), "bán hành")
	check(int(farm.snapshot.gold) == gold + onions * int(probe.features.data.items.CROP_04.sell), "bán hành nhận đúng vàng")
	probe.sheet.close()

	# Đơn HTX: mở bảng thì đơn về, bỏ một đơn, giao một đơn khi đủ hàng.
	probe._open_sheet("ORDERS")
	check(await until(func() -> bool: return farm.snapshot.get("orders") is Dictionary and farm.snapshot.orders.slots[0] is Dictionary, 10.0), "mở bảng thì HTX gửi đơn")
	await process_frame
	check(await press("skip_2"), "bỏ đơn thứ ba")
	check(farm.snapshot.orders.slots[2] == null and float(farm.snapshot.orders.readyAt[2]) > farm.now(), "đơn bỏ phải chờ mới có đơn mới")
	var order: Dictionary = farm.snapshot.orders.slots[0]
	var short := func() -> bool:
		for line: Dictionary in order.lines:
			if farm.stock(line.itemId) < int(line.qty):
				return true
		return false
	if short.call():
		var deliver := probe.sheet.rows_box.find_child("deliver_0", true, false) as Button
		check(deliver != null and deliver.disabled, "thiếu hàng thì nút Giao khóa")
	probe.sheet.close()
	var deadline := Time.get_ticks_msec() + 120_000
	while short.call() and Time.get_ticks_msec() < deadline:
		for id: String in ["P20_13", "P21_13", "P24_6", "P25_8", "P5_7", "P6_7", "P7_7"]:
			if ripe(id):
				await act(id)
		if item("P5_7") == null:
			probe.seed_id = "CROP_05"
			for id: String in ["P5_7", "P6_7", "P7_7"]:
				await act(id)
				await act(id)
		await process_frame
	check(not short.call(), "gom đủ hàng cho đơn đầu: %s" % JSON.stringify(order.lines))
	gold = int(farm.snapshot.gold)
	probe._open_sheet("ORDERS")
	check(await press("deliver_0"), "giao đơn")
	check(int(farm.snapshot.gold) == gold + int(order.gold), "giao đơn nhận đúng thưởng")
	probe.sheet.close()
	check(not probe.sheet.visible and probe.sheet_kind.is_empty(), "đóng bảng trả lại điều khiển")

	print("%d/%d bước qua" % [checks - failures, checks])
	quit(1 if failures > 0 else 0)
