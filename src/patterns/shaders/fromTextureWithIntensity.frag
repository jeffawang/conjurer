#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;

varying vec2 v_uv;
varying float v_intensity;

void main() {
    vec4 sampled = texture2D(u_texture, v_uv);
    vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
    gl_FragColor = mix(black, sampled, v_intensity);
}
