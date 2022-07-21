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
    //lightDirection = vec3();
    //vec3 lightIntensity = light.color * max(dot(fragNormal, normalize(light.direction)), 0.0) + ambientLight;


    //vec4 col = vec4((normalize(fragNormal) + 1.0) / 2.0, 1.0);
    gl_FragColor = vec4(fragColor, 1.0) * texel;// * vec4(lightIntensity, 1.0);
}
