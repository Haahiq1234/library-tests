precision mediump float;
struct LightPoint {
    vec3 direction;
    vec3 color;
};
varying vec3 fragColor;
varying vec2 fragTextcoord;
varying vec3 fragNormal;

uniform sampler2D sampler;
uniform vec3 ambientLight;
uniform LightPoint light;

void main()
{
    vec4 texel;
    if (fragTextcoord.x == 2.0 && fragTextcoord.y == 2.0) {
        texel = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        texel = texture2D(sampler, fragTextcoord);
    }
    gl_FragColor = vec4(fragColor, 1.0) * texel;
    
    //}
}
