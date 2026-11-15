extends SceneTree
## LT-14 bước 3. Người chơi mới đi hết Chương 1: cảnh mở đầu, hướng dẫn 8 bước, NPC có tim, nhận thưởng.
## Chạy theo tools/qa/godot-chapter1-flow.sh, cần máy chủ thử ở bộ dựng sẵn fast.

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


func tap(target: Dictionary) -> void:
	await until(idle)
	probe._queue_task({"target": target}, probe.features.world_area(target))
	await process_frame
	await until(idle, 30.0)
	if probe.confirm_overlay.visible:
		probe._approve_estate()
		await process_frame
		await until(idle)


func step() -> String:
	var index: int = probe._tutorial_index()
	return "" if index < 0 else str(probe.features.data.story.tutorial[index].id)


func _run() -> void:
	probe = (load("res://estate_probe.tscn") as PackedScene).instantiate()
	root.add_child(probe)
	check(await until(func() -> bool: return probe.connected, 15.0), "đọc được nông trại mới")
	var farm: RefCounted = probe.farm
	var features: Node2D = probe.features

	# Cảnh mở đầu: không đóng được, phải trả lời Bá Kiến.
	check(probe.sheet.visible and probe.sheet_kind == "INTRO", "người chơi mới thấy cảnh mở đầu")
	check(not probe.sheet.close_button.visible, "cảnh mở đầu không có nút Đóng")
	check(not probe.guide_panel.visible, "chưa hiện hướng dẫn khi chưa trả lời")
	check(probe.sheet.portrait_rect.visible, "cảnh mở đầu có chân dung")
	check(await press("next"), "sang lời Bá Kiến")
	check(probe.sheet.info_label.text.contains("Bá Kiến"), "hiện lời Bá Kiến")
	check(await press("next"), "sang câu hỏi")
	check(await press("path_EMP"), "chọn giữ đất tổ tiên")
	check(probe._story().get("path") == "EMP", "server ghi hướng đã chọn")
	check(not probe.sheet.visible and probe.guide_panel.visible, "đóng cảnh, hiện hướng dẫn Bác Bảy")

	# Tám bước hướng dẫn tự xong theo trạng thái thật.
	check(step() == "MOVE", "bước 1 là đi một vòng")
	probe._walk_to(probe.player.global_position + Vector2(40, 0))
	await until(func() -> bool: return probe.walk_path.is_empty(), 10.0)
	probe._update_view()
	check(step() == "PLANT" and probe.guide_arrow.visible, "đi xong thì sang bước gieo, có mũi tên")
	check(probe.guide_text.text.contains("2/8"), "khung hướng dẫn ghi bước 2/8")
	await act("P6_7")
	check(step() == "WATER", "gieo xong thì sang bước tưới")
	await act("P6_7")
	check(step() == "HARVEST", "tưới xong thì sang bước gặt")
	check(await until(func() -> bool: return farm.stage(farm.tile("P6_7")) == 3, 30.0), "lúa chín")
	await act("P6_7")
	check(step() == "SELL", "gặt xong thì sang bước bán")
	probe._open_sheet("STORE")
	check(await press("sell_CROP_01"), "bán lúa cho HTX")
	probe.sheet.close()
	check(step() == "CLEAR", "bán xong thì sang bước dọn đá")
	await tap(features.first_obstacle("ROCK"))
	check(step() == "WELL" and farm.stock("MAT_DA") == 3, "dọn đá xong thì sang bước sửa giếng")
	var rock: Dictionary = features.first_obstacle("ROCK")
	var area: Rect2 = features.world_area(rock)
	check(absf(probe.guide_arrow.anchor.x - area.get_center().x) < 1.0, "thiếu đá thì mũi tên chỉ tảng đá kế")
	await tap(rock)
	await tap(features.target_by_id("WELL"))
	check(probe._repaired("WELL") and step() == "HOUSE", "sửa giếng xong thì sang bước sửa nhà")
	await tap(features.first_obstacle("TREE"))
	await tap(features.first_obstacle("TREE"))
	check(farm.stock("MAT_GO") >= 6, "chặt hai gốc cây đủ gỗ")
	await tap(features.target_by_id("HOUSE"))
	check(probe._repaired("HOUSE") and step() == "", "sửa nhà xong là hết 8 bước")
	check(probe.guide_text.text.contains("Sổ") and not probe.guide_arrow.visible, "hướng dẫn nhắc mở Sổ, hết mũi tên")

	# NPC có tim.
	await tap(features.target_by_id("BAC_BAY"))
	check(probe.sheet.visible and probe.sheet_kind == "NPC:BAC_BAY", "chạm Bác Bảy mở hộp thoại")
	await until(func() -> bool: return not probe.busy)
	check(int(farm.snapshot.npcs.BAC_BAY.points) == 20, "chào lần đầu trong ngày được cộng tim")
	check(probe.sheet.info_label.text.contains("Bác Trưởng Thôn Bảy"), "hộp thoại hiện lời Bác Bảy")
	check(await press("talk_BAC_BAY"), "nói chuyện lần hai")
	check(int(farm.snapshot.npcs.BAC_BAY.points) == 20, "nói thêm trong ngày không cộng tim")
	var wood: int = farm.stock("MAT_GO")
	check(await press("gift_MAT_GO"), "tặng gỗ")
	check(int(farm.snapshot.npcs.BAC_BAY.points) == 50 and farm.stock("MAT_GO") == wood - 1, "quà thường cộng 30 điểm, trừ một món")
	check(await press("gift_MAT_GO"), "tặng lần hai trong ngày")
	check(int(farm.snapshot.npcs.BAC_BAY.points) == 50, "quà thứ hai trong ngày không có tác dụng")
	probe.sheet.close()
	await tap(features.first_obstacle("ROCK"))
	await tap(features.target_by_id("CO_HUONG"))
	check(probe.sheet_kind == "NPC:CO_HUONG", "chạm Cô Hương mở hộp thoại")
	check(await press("gift_MAT_DA"), "tặng đá cho Cô Hương")
	check(farm.snapshot.npcs.CO_HUONG.knownDislikes.has("MAT_DA"), "phát hiện món Cô Hương không ưng")
	await process_frame
	var row := probe.sheet.rows_box.find_child("gift_MAT_DA", true, false).get_parent().get_child(0) as Label
	check(row.text.contains("không ưng"), "hộp thoại ghi nhớ sở thích đã phát hiện")
	probe.sheet.close()

	# Sổ Gia Phả: nhận thưởng Chương 1.
	var gold := int(farm.snapshot.gold)
	probe.book_button.pressed.emit()
	check(probe.sheet.visible and probe.sheet_kind == "GIAPHA", "nút Sổ mở Sổ Gia Phả")
	check(await press("claim_1"), "nhận thưởng Chương 1")
	check(probe._story().claimed.has(1.0), "server ghi đã nhận Chương 1")
	check(int(farm.snapshot.gold) == gold + int(features.data.story.chapter.gold), "nhận đúng vàng thưởng")
	check(int(probe._story().neighbor) == 3, "hướng Tình nghĩa cộng Nghĩa Xóm")
	await process_frame
	check(probe.sheet.rows_box.find_child("claim_1", true, false) == null, "không nhận thưởng được lần hai")
	check(await press("sound"), "tắt âm thanh")
	check(probe.guide.muted and probe.sfx.muted, "âm thanh đã tắt")
	check(await press("sound"), "bật lại âm thanh")
	probe.sheet.close()
	check(not probe.guide_text.visible and probe.book_button.visible, "xong chương chỉ còn nút Sổ")
	check(FileAccess.file_exists(probe._guide_path()), "cờ hướng dẫn lưu trên máy")

	print("%d/%d bước qua" % [checks - failures, checks])
	quit(1 if failures > 0 else 0)
