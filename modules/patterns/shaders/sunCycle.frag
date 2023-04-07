#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.027, 0.638, 1.000);
vec3 colorB = vec3(1.000, 0.411, 0.058);

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = vec3(0.0);

    vec3 pct = vec3(st.x);

    color = mix(colorA, colorB, pct);
    color = mix(color, vec3(0.0), sin(u_time));

    gl_FragColor = vec4(color, 1.0);
}
