#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
// varying vec2 v_uv;

vec3 colorA = vec3(1.000, 0.411, 0.058);
vec3 colorB = vec3(0.027, 0.638, 1.000);

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.y);

    color = mix(colorA, colorB, pct);
    color = mix(color, vec3(0.0), cos(u_time));

    gl_FragColor = vec4(color, 1.0);
}
