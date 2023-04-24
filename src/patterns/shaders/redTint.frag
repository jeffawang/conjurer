uniform float u_time;

uniform sampler2D u_tex;

varying vec2 v_uv;

void main() {
    vec4 sampled = texture2D(u_tex, v_uv);

    float t = 0.3;
    // float t = sin(u_time) / 2.0 + 0.5;
    vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = mix(sampled, red, t);
}
