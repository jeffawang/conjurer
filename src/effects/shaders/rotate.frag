#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform sampler2D u_texture;

uniform float u_speed;

varying vec2 v_uv;

void main() {
    vec2 uv = v_uv;
    uv.x = fract(v_uv.x + u_speed * u_time * 0.01);
    gl_FragColor = texture2D(u_texture, uv);
}
