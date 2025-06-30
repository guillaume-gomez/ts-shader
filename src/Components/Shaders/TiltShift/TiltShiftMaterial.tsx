import { Vector2 } from "three";
import { shaderMaterial } from "@react-three/drei";

const TiltShiftMaterial = shaderMaterial(
  { 
    uTexture: null,
    uSaturation: 0.1,
    uEnable: false,
    uDebug: false,
    uThreshold: 0.5,
    uBlur: 0.0,
    uTop: 0.75,
    uLeft: 0.25,
    uRight: 0.75,
    uBottom: 0.25,
    uMaxPos: 0.5
     },
    // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
      vUv = uv;
      vec3 texture = texture2D(uTexture, uv).rgb;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  /*glsl*/`

    vec3 rgb2hsv(vec3 c)
    {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c)
    {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 saturateFn(vec3 textureColor, float saturationRatio)
    {
      vec3 textureRGB = textureColor.rgb;
      vec3 textureHSV = rgb2hsv(textureRGB).xyz;
      textureHSV.y += saturationRatio;

      return hsv2rgb(textureHSV);
    }

    float normalizea(float min1, float max1, float value)
    {
        return (value - min1) / (max1 - min1);
    }

    uniform float uThreshold;
    float computeFonction(float min1, float max1, float value)
    {
        return smoothstep(uThreshold, 1.0, normalizea(min1, max1, value));
    }

    uniform sampler2D uTexture;
    varying vec2 vUv;
    uniform bool uEnable;
    uniform bool uDebug;
    uniform float uSaturation;
    uniform float uBlur;
    uniform float uTop;
    uniform float uBottom;
    uniform float uLeft;
    uniform float uRight;


    void main() {
     vec2 uv = vUv;
     
     if(!uEnable) {
        gl_FragColor =  texture2D(uTexture, uv, 0.0);
        return;
      }
      
      float position = 0.0;    
      // TOP / BOTTOM
      if(uv.y <= uBottom) {
          position += computeFonction(uBottom, 0.0, uv.y);
      } 

     if(uv.y >= uTop) {
          position += computeFonction(uTop, 1.0, uv.y);
      }

      // LEFT / RIGHT
      if(uv.x <= uLeft) {
          position += computeFonction(uLeft, 0.0, uv.x);
      }
      if(uv.x >= uRight) {
          position += computeFonction(uRight, 1.0, uv.x);
      }

      float bias = position * uBlur;
      if(uDebug) {
        gl_FragColor = vec4( min(bias, 1.0) , 0.0, 0.0, 1.0 );
        return;
      }

      vec4 blurred_texture = texture2D(uTexture, uv, bias);      
      vec3 textureRGBSaturated = saturateFn(blurred_texture.rgb, uSaturation);
      gl_FragColor = vec4(textureRGBSaturated, 1.0);
      
    }
  `
)

export default TiltShiftMaterial;