#define PI 3.14159265359

uniform float u_time;
uniform float u_global_time;

uniform float u_radius;
uniform float u_fuzziness;
uniform vec4 u_color;

varying vec2 v_uv;

void main() {
    vec2 st = v_uv;

    gl_FragColor = mix(u_color, vec4(0.0, 0.0, 0.0, 1.0), smoothstep(u_radius - u_fuzziness, u_radius + u_fuzziness, st.y));
}
