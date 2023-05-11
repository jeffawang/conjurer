#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

uniform sampler2D u_texture;
uniform vec4 u_color;
uniform float u_intensity;

varying vec2 v_uv;

void main() {
    vec4 sampled = texture2D(u_texture, v_uv);
    vec4 mixed = mix(sampled, u_color, u_intensity);

    // any sampled pixels that are black, leave them black
    mixed.xyz = step(0.000001, sampled.x * sampled.y * sampled.z) * mixed.xyz;
    gl_FragColor = mixed;
}
