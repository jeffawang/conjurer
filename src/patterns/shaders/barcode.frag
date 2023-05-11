// Author @patriciogv - 2015
// Title: Truchet - 10 print

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

uniform float u_segments;
uniform float u_stutter_frequency;
uniform float u_go_nuts;

// #define u_segments 4.5
// #define u_stutter_frequency .8
// #define u_go_nuts 0.0

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 v_uv;

float random(in float x) {
    return fract(sin(x) * 43758.5453123);
}

float random(in vec2 _st) {
    return fract(sin(dot(_st.xy, vec2(12.98, 78.233))) *
        43758.5453123);
}

void main() {
    vec2 st = v_uv;
    // vec2 st = gl_FragCoord.xy / u_resolution.xy;

    st.x *= 100.;
    st.y *= u_segments;

    float timeCell = 1. + floor(u_time * u_stutter_frequency);
    float translate = sin(u_time * 4. * random(timeCell)) * 10.;

    if (mod(floor(st.y), 2.0) == 1.0) {
        st.x += translate;
    } else {
        st.x -= translate;
    }

    if (u_go_nuts >= 1.0) {
        st = (st - vec2(5.0)) * (abs(sin(u_time * 0.2)) * 5.);
        st.x += u_time * 3.0;
    }

    vec2 ipos = floor(st);  // integer
    vec2 fpos = fract(st);  // fraction

    float color = step(0.5, random(ipos + timeCell));

    gl_FragColor = vec4(vec3(color), 1.0);
}
