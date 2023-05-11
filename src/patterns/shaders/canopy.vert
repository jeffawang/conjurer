#define PI 3.14159265359

uniform vec3 u_view_vector;
varying vec2 v_uv;
varying float v_intensity;

void main() {
    gl_PointSize = 4.0;

    // Pass the intensity to the fragment shader.
    // TODO: not quite working yet. We want to vary the intensity such that when the pixel is viewed
    // head on, it is at its brightest.
    vec3 vNormal = normalize(modelViewMatrix * vec4(normal, 1.0)).xyz;
    vec3 vNormel = normalize(normalMatrix * u_view_vector);
    v_intensity = 1. - dot(vNormal, vNormel);

    // Pass uv coordinates to the fragment shader.
    // uv.x, uv.y are in the range [0, 1]
    // x represents the angle around the center of the canopy
    // y represents the distance from the apex of the canopy
    v_uv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
