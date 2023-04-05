uniform vec2 u_resolution;
uniform float u_time;
uniform float u_blueness;

float circle(vec2 xy, float r) {
  return length(xy) - r;
}

void main() {
    vec2 st = (gl_FragCoord.xy * 2.0)/u_resolution.xy-1.0;
    st.x *= u_resolution.xy.x / u_resolution.xy.y;

    float d = step(circle(st, .5), 0.0) * (sin(u_time * 10.0) / 2.0 + 0.5);
    float b = fract(u_blueness / 256.0);
    gl_FragColor=vec4(1.0, d, b, 1.0);
}
