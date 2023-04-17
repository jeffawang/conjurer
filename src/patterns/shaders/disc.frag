#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;

uniform float u_radius;

varying vec2 v_uv;

vec3 color = vec3(0.0588, 1.0, 0.9216);

void main() {
    vec2 st = v_uv;

    color = mix(color, vec3(0.0), step(u_radius, st.y));

    gl_FragColor = vec4(color, 1.0);
}
