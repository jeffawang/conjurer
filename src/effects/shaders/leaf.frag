// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265358979323846

// #define u_coordinate_offset 0.0
// #define u_tiling 4.0
// #define u_time_factor 1.0
// #define u_time_offset 0.0

uniform float u_coordinate_offset;
uniform float u_tiling;
uniform float u_time_factor;
uniform float u_time_offset;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;

vec2 rotate2D(vec2 _st, float _angle) {
    _st -= 0.5;
    _st = mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float _zoom) {
    _st *= _zoom;
    return fract(_st);
}

vec2 rotateTilePattern(vec2 _st) {

    //  Scale the coordinate system by 2x2
    _st *= 2.0;

    //  Give each cell an index number
    //  according to its position
    float index = 0.0;
    index += step(1., mod(_st.x, 2.0));
    index += step(1., mod(_st.y, 2.0)) * 2.0;

    //      |
    //  2   |   3
    //      |
    //--------------
    //      |
    //  0   |   1
    //      |

    // Make each cell between 0.0 - 1.0
    _st = fract(_st);

    // Rotate each cell according to the index
    if (index == 1.0) {
        //  Rotate cell 1 by 90 degrees
        _st = rotate2D(_st, PI * 0.5);
    } else if (index == 2.0) {
        //  Rotate cell 2 by -90 degrees
        _st = rotate2D(_st, PI * - 0.5);
    } else if (index == 3.0) {
        //  Rotate cell 3 by 180 degrees
        _st = rotate2D(_st, PI);
    }

    return _st;
}

float circle(vec2 _st, float _radius, float _smoothEdges) {
    vec2 dist = _st - vec2(0.5);
    return 1.0 - smoothstep(_radius, _radius + _smoothEdges, dot(dist, dist) * 4.0);
}

void main(void) {
    // vec2 st = gl_FragCoord.xy / u_resolution.xy;
    vec2 st = v_uv;

    // Cartesian projection
    float theta = st.x * 2.0 * 3.1415926;
    float r = st.y * 0.88888888 + 0.111111111;
    st.x = r * cos(theta) * 0.5;
    st.y = r * sin(theta) * 0.5;

    st -= u_coordinate_offset;
    st = tile(st, u_tiling);
    // st = rotateTilePattern(st);

    // Make more interesting combinations
    // st = tile(st, 1.0);
    // st = rotate2D(st, - PI * u_time * 0.15);
    // st = rotateTilePattern(st * 2.);
    // st = rotate2D(st, PI * u_time * 0.25);

    float time = u_time * u_time_factor + u_time_offset;
    // time = 0.0;

    // Draw weed leaf
    vec2 pos = vec2(0.5) - st;
    r = length(pos) * 2.5;
    float a = atan(pos.y - 0.19, pos.x);
    float f = abs(mod(a * 0.5 / PI * 16., 2.0) - 1.) + 0.15;
    // f *= abs(sin(a * 3.)) * .5;
    f -= abs(cos(a * 2. * time + 0.5 * PI)) * .3;
    f += .3 * sin(time * .5);
    float color = (1. - smoothstep(f, f + 0.0, r));

    vec4 sampled = texture2D(u_texture, v_uv);
    vec3 masked = sampled.xyz * color;

    gl_FragColor = vec4(masked, 1.0);
}
