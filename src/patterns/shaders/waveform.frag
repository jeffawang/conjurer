
uniform sampler2D samples;

uniform vec4 bgColor;
uniform vec4 activeColor;

uniform float outWidth;
uniform float outHeight;
uniform float sampleStart;
uniform float sampleEnd;
uniform float sampleWidth;
uniform float sampleHeight;
uniform float numSamples;

varying vec2 v_uv;

float GetSample(float offset) {
    float y = (offset/4.0) / sampleWidth;
    float x = mod(offset/4.0, sampleWidth);
    return abs(texture2D(samples, vec2(x,y)/vec2(sampleWidth,sampleHeight)))[int(mod(offset, 4.0))];
}

void main() {
    float samplesPerPixel = ((sampleEnd - sampleStart) / outWidth) + 1.0;
    float start = sampleStart + (samplesPerPixel * gl_FragCoord.x);
    float sum = 0.0;
    for (float i = start; i < start + samplesPerPixel; i++) {
        sum += GetSample(i);
    }
    float avg = sum / samplesPerPixel;
    // float avg = 0.1;
    float yOffset = gl_FragCoord.y - (outHeight / 2.0);
    float barHeight = (avg * float(outHeight));
    gl_FragColor = abs(yOffset) < barHeight ? activeColor : bgColor;
    // gl_FragColor = vec4(outHeight,outHeight,outHeight,1);
}