extends Control
## Insets are converted from browser/window pixels to stretched Godot UI units.
## Attach to a full-rect content container; keep the modal backdrop full-screen.

var _base := Vector4.ZERO
var _elapsed := 0.0


func _ready() -> void:
	_base = Vector4(offset_left, offset_top, offset_right, offset_bottom)
	get_viewport().size_changed.connect(_apply_safe_area)
	_apply_safe_area()


func _process(delta: float) -> void:
	_elapsed += delta
	if _elapsed >= 0.5:
		_elapsed = 0.0
		_apply_safe_area()


func _apply_safe_area() -> void:
	var insets := Vector4.ZERO
	var pixels := Vector2(DisplayServer.window_get_size())
	if OS.has_feature("web"):
		var raw = JavaScriptBridge.eval("""(function () {
			let probe = document.getElementById('vac-safe-area-probe');
			if (!probe) {
				probe = document.createElement('div');
				probe.id = 'vac-safe-area-probe';
				probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)';
				document.body.appendChild(probe);
			}
			const s = getComputedStyle(probe);
			const c = document.getElementById('canvas').getBoundingClientRect();
			return JSON.stringify([parseFloat(s.paddingLeft), parseFloat(s.paddingTop), parseFloat(s.paddingRight), parseFloat(s.paddingBottom), c.width, c.height]);
		})()""")
		var values = JSON.parse_string(str(raw))
		if values is Array and values.size() == 6:
			insets = Vector4(values[0], values[1], values[2], values[3])
			pixels = Vector2(values[4], values[5])
	elif OS.get_name() in ["Android", "iOS"]:
		var safe := Rect2(DisplayServer.get_display_safe_area())
		var window := Rect2(Vector2(DisplayServer.window_get_position()), pixels)
		var inner := safe.intersection(window)
		if inner.has_area():
			insets = Vector4(inner.position.x - window.position.x, inner.position.y - window.position.y,
				window.end.x - inner.end.x, window.end.y - inner.end.y)
	if pixels.x <= 0 or pixels.y <= 0:
		return
	var scale := get_viewport_rect().size / pixels
	offset_left = _base.x + insets.x * scale.x
	offset_top = _base.y + insets.y * scale.y
	offset_right = _base.z - insets.z * scale.x
	offset_bottom = _base.w - insets.w * scale.y
