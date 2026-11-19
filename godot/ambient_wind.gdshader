shader_type canvas_item;
// Displace the canopy, preserving the trunk/soil at the base and source colours.
uniform float strength : hint_range(0.0, 3.0) = 1.0;
uniform float phase = 0.0;
uniform float rooted_from : hint_range(0.0, 1.0) = 0.68;
varying vec4 sprite_tint;
void vertex() { sprite_tint = COLOR; }
void fragment() {
	float canopy = 1.0 - smoothstep(0.08, rooted_from, UV.y);
	float gust = sin(TIME * 1.25 + phase) + 0.28 * sin(TIME * 2.1 + phase * 1.7);
	vec2 sample_uv = UV + vec2(gust * strength * TEXTURE_PIXEL_SIZE.x * canopy, 0.0);
	vec4 art = texture(TEXTURE, sample_uv);
	if (sample_uv.x < 0.0 || sample_uv.x > 1.0) { art.a = 0.0; }
	COLOR = sprite_tint * art;
}
