uniform float u_time;

uniform sampler2D u_texture;
uniform vec4 u_color;
uniform float u_intensity;

varying vec2 v_uv;

void main() {
    vec4 sampled = texture2D(u_texture, v_uv);

    gl_FragColor = mix(sampled, u_color, u_intensity);
}
