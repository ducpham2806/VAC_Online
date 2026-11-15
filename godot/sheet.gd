extends ColorRect
## Bảng danh sách dùng chung cho Giống, Kho, Bếp Củi và Đơn HTX. Chỉ hiển thị và báo nút được bấm.

signal chosen(id: String)
signal closed

const INK := Color("#3d2314")
const LINE := Color("#d8c49b")
const ROW_HEIGHT := 44.0

var style_button := Callable()
var style_panel := Callable()
var shown := ""
var title_label := Label.new()
var info_label := Label.new()
var rows_box := VBoxContainer.new()
var close_button := Button.new()
var scroll := ScrollContainer.new()
var portrait_rect := TextureRect.new()
var closable := true


func _ready() -> void:
	color = Color(INK, 0.55)
	set_anchors_preset(Control.PRESET_FULL_RECT)
	hide()
	var margin := MarginContainer.new()
	margin.set_anchors_preset(Control.PRESET_FULL_RECT)
	for side in ["left", "right"]:
		margin.add_theme_constant_override("margin_" + side, 72)
	for side in ["top", "bottom"]:
		margin.add_theme_constant_override("margin_" + side, 12)
	add_child(margin)
	var panel := PanelContainer.new()
	panel.name = "Panel"
	margin.add_child(panel)
	if style_panel.is_valid():
		panel.add_theme_stylebox_override("panel", style_panel.call())
	var content := VBoxContainer.new()
	content.add_theme_constant_override("separation", 4)
	panel.add_child(content)
	var head := HBoxContainer.new()
	head.add_theme_constant_override("separation", 8)
	content.add_child(head)
	portrait_rect.custom_minimum_size = Vector2(44, 44)
	portrait_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	portrait_rect.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	portrait_rect.hide()
	head.add_child(portrait_rect)
	title_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	title_label.add_theme_font_size_override("font_size", 20)
	title_label.add_theme_color_override("font_color", INK)
	head.add_child(title_label)
	close_button.name = "Close"
	close_button.text = "Đóng"
	close_button.custom_minimum_size = Vector2(72, ROW_HEIGHT)
	close_button.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	close_button.pressed.connect(close)
	_style(close_button)
	head.add_child(close_button)
	info_label.add_theme_font_size_override("font_size", 13)
	info_label.add_theme_color_override("font_color", INK)
	info_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	content.add_child(info_label)
	scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	content.add_child(scroll)
	rows_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	rows_box.add_theme_constant_override("separation", 2)
	scroll.add_child(rows_box)


## rows: [{"text": String, "buttons": [{"id": String, "label": String, "disabled": bool}]}]
## `can_close` tắt nút Đóng cho cảnh buộc phải trả lời.
func present(title: String, info: String, rows: Array, portrait: Texture2D = null, can_close := true) -> void:
	var first := not visible
	closable = can_close
	close_button.visible = can_close
	portrait_rect.texture = portrait
	portrait_rect.visible = portrait != null
	title_label.text = title
	info_label.text = info
	info_label.visible = not info.is_empty()
	var signature := JSON.stringify(rows)
	if first or signature != shown:
		shown = signature
		_build(rows)
	if first:
		scroll.scroll_vertical = 0
		show()
		if can_close:
			close_button.grab_focus()


func close() -> void:
	if visible:
		hide()
		closed.emit()


## Ẩn bảng mà không báo `closed`, dùng khi cảnh tự kết thúc.
func dismiss() -> void:
	hide()


func _build(rows: Array) -> void:
	for child in rows_box.get_children():
		rows_box.remove_child(child)
		child.queue_free()
	for row: Dictionary in rows:
		var line := HBoxContainer.new()
		line.custom_minimum_size.y = ROW_HEIGHT
		line.add_theme_constant_override("separation", 6)
		var text := Label.new()
		text.text = row.text
		text.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		text.add_theme_font_size_override("font_size", 13)
		text.add_theme_color_override("font_color", INK)
		line.add_child(text)
		for spec: Dictionary in row.get("buttons", []):
			var button := Button.new()
			button.name = str(spec.id).replace(":", "_")
			button.text = spec.label
			button.disabled = spec.get("disabled", false)
			button.custom_minimum_size = Vector2(72, ROW_HEIGHT)
			button.pressed.connect(chosen.emit.bind(str(spec.id)))
			_style(button)
			line.add_child(button)
		rows_box.add_child(line)
		var rule := ColorRect.new()
		rule.color = LINE
		rule.custom_minimum_size.y = 1
		rows_box.add_child(rule)


func _style(button: Button) -> void:
	if style_button.is_valid():
		style_button.call(button)


func _unhandled_key_input(event: InputEvent) -> void:
	if visible and closable and event.is_action_pressed("ui_cancel"):
		close()
		get_viewport().set_input_as_handled()
