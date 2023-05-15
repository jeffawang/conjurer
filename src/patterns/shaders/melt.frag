// Based on the work of:
// Author: tomorrowevening (https://www.shadertoy.com/user/tomorrowevening)
// License: Creative Commons Attribution-NonCommercial-ShareAlike
// License URL: http://creativecommons.org/licenses/by-nc-sa/3.0/
// Source: https://www.shadertoy.com/view/XsX3zl

/** SHADERDATA
{
	"title": "70s Melt",
	"description": "Variation of Sine Puke",
	"model": "car"
}
*/

#ifdef GL_ES
precision mediump float;
#endif
#define RADIANS 0.017453292519943295

uniform float u_time_factor;
uniform float u_time_offset;

// #define u_time_factor 1.0
// #define u_time_offset 0.0

uniform vec2 u_resolution;
uniform float u_time;
varying vec2 v_uv;

const int zoom = 40;
const float brightness = 1.;
float fScale = 1.25;

float cosRange(float degrees, float range, float minimum) {
    return (((1.0 + cos(degrees * RADIANS)) * 0.5) * range) + minimum;
}

void main() {
    // vec2 st = v_uv;
    // vec2 st = (2.0 * gl_FragCoord.xy - u_resolution.xy) / max(u_resolution.x, u_resolution.y);
    // vec2 st = gl_FragCoord.xy / u_resolution.xy;

    // Convert from canopy space to cartesian
    float theta = v_uv.x * 2.0 * 3.1415926;
    float r = v_uv.y * 0.88888888 + 0.111111111;
    float x = r * cos(theta) * 0.5 + 0.5;
    float y = r * sin(theta) * 0.5 + 0.5;
    vec2 uv = vec2(x, y) * 2.0 - 1.0;

    float time = u_time * 7. * u_time_factor + u_time_offset;
    float ct = cosRange(time * 5.0, 3.0, 1.1);
    float xBoost = cosRange(time * 0.2, 5.0, 5.0);
    float yBoost = cosRange(time * 0.1, 10.0, 5.0);

    fScale = cosRange(15.5, 1.25, 0.5);

    for (int i = 1; i < zoom; i ++) {
        float _i = float(i);
        vec2 newp = uv;
        newp.x += 0.25 / _i * sin(_i * uv.y + time * cos(ct) * 0.5 / 20.0 + 0.005 * _i) * fScale + xBoost;
        newp.y += 0.25 / _i * sin(_i * uv.x + time * ct * 0.3 / 40.0 + 0.03 * float(i + 15)) * fScale + yBoost;
        uv = newp;
    }

    vec3 col = vec3(0.5 * sin(3.0 * uv.x) + 0.5, 0.5 * sin(3.0 * uv.y) + 0.5, sin(uv.x + uv.y));
    col *= brightness;

    float extrusion = (col.x + col.y + col.z) / 4.0;
    extrusion *= 1.5;

    gl_FragColor = vec4(col, extrusion);
}
