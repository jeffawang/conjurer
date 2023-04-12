#define PI 3.14159265359
uniform vec2 u_resolution;
varying vec2 v_uv;

void main() {
    gl_PointSize = 5.0;
    float apexRadius = 1.0; // ft
    float canopyRadius = 8.0; // ft

    float radius = apexRadius + (canopyRadius - apexRadius) * position.y;
    float theta = position.x * 2.0 * PI;

    float x = radius * cos(theta);
    float y = radius * sin(theta);

    // Pass the uv coordinates to the fragment shader.
    // x, y are in the range [0, 1]
    // x represents the angle around the center of the canopy
    // y represents the distance from the apex of the canopy
    v_uv = position.xy;

    // TODO: current hack, z is being piped through directly
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, position.z, 1.0);
}
