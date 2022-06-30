precision mediump float;
varying vec3 fragColor;
varying vec2 fragTextcoord;
varying vec3 fragNormal;
uniform sampler2D sampler;
void main()
{
    vec4 pixel;
    if (fragTextcoord.x == 2.0 && fragTextcoord.y == 2.0) {
        pixel = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        pixel = texture2D(sampler, fragTextcoord);
    }
    //fragColor = ((normalize(gl_Position.xyz) + 1) / 2);
    gl_FragColor = vec4(fragColor, 1.0) * pixel;
}
