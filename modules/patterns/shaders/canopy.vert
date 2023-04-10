#define PI 3.14159265359

uniform vec2 u_resolution;
// varying vec2 v_uv;

void main() {
    float apexRadius = 10.0;
    float radius = (apexRadius + position.y) / (apexRadius + u_resolution.y);
    float theta = position.x / u_resolution.x * 2.0 * PI;

    float x = radius * cos(theta);
    float y = radius * sin(theta);

    // v_uv = vec2(x, y);

    gl_Position = vec4(x, y, 0.0, 1.0);
}
