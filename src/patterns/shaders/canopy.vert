#define PI 3.14159265359

varying vec2 v_uv;

void main() {
    gl_PointSize = 4.0;

    // Pass the uv coordinates to the fragment shader.
    // uv.x, uv.y are in the range [0, 1]
    // x represents the angle around the center of the canopy
    // y represents the distance from the apex of the canopy
    v_uv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
