precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
attribute vec2 textureCoord;
attribute vec3 normal;

uniform mat4 mWorld;
uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 transform;

varying vec3 fragColor;
varying vec2 fragTextcoord;
varying vec3 fragNormal;

void main()
{
    vec4 position = mProj * mView * mWorld * transform * vec4(vertPosition, 1.0);
    fragColor = vertColor;
    fragTextcoord = textureCoord;
    fragNormal = (mWorld * vec4(normal, 0.0)).xyz;
    gl_Position = position;
}
            