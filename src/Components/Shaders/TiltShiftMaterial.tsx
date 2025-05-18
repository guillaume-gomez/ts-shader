import { Vector2 } from "three";
import { shaderMaterial } from "@react-three/drei";

const TiltShiftMaterial = shaderMaterial(
  { 
    uTexture: null,
    uSaturation: 0.1,
    uEnable: false,
    uBlur: 0.0,
    uTopY: 0.0,
    uBottomY: 0.0,
    uIntensity: 0.5,
    uDebug: false,
    uResolution: new Vector2(),
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

    float reMap(float value, float start1,float stop1,float start2,float stop2) {
      return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    }

    uniform sampler2D uTexture;
    varying vec2 vUv;
    uniform vec2 uResolution;
    uniform bool uEnable;
    uniform float uSaturation;
    uniform float uBlur;
    uniform float uTopY;
    uniform float uBottomY;
    uniform float uIntensity;
    uniform bool uDebug;



    const float pi=4.*atan(1.);
    const float ang=(3.-sqrt(5.))*pi;
    float gamma=1.8;

    const float SAMPLES=150.;
    vec3 bokeh(sampler2D samp,vec2 uv,vec2 radius,float lod){
      vec3 col = vec3(0);
        for(float i=0.;i<SAMPLES;i++){
            float d=i/SAMPLES;
          vec2 p=vec2(sin(ang*i),cos(ang*i))*sqrt(d)*radius;
            col+=pow(texture(samp,uv+p,lod).rgb,vec3(gamma));
        }
        return pow(col/SAMPLES,vec3(1./gamma));
    }


    void main() {
      vec4 textureColor = texture2D(uTexture, vUv);
      vec3 textureRGB = textureColor.rgb;

      if(uEnable) {
        vec3 changed_pixel = vec3(0.0);

        if ( ((1.0-vUv.y) <= uTopY) ||  vUv.y <= uBottomY ){
          vec2 pix=1./uResolution.xy;

          float r= uIntensity;
          float lod=log2(r/SAMPLES*pi*5.);
          
          float normalisedRadius = ((1.0-vUv.y) <= uTopY) ? 
            reMap((1.0 - vUv.y), 0.0, uTopY, 0.0, 1.0) :
            reMap(vUv.y, 0.0, uBottomY, 0.0, 1.0);

          
          vec3 blurred_pixel = !uDebug ? 
            bokeh(uTexture, vUv, (1.0 - normalisedRadius) * r * pix, lod) :
            vec3((1.0 - normalisedRadius));


          changed_pixel = blurred_pixel;
        } else {
          changed_pixel = textureRGB;
        }
        
        vec3 textureRGBSaturated = saturateFn(changed_pixel, uSaturation);

        gl_FragColor = vec4(textureRGBSaturated, 1.0);

      } else {
        gl_FragColor = vec4(textureRGB, 1.0);
      }
    }
  `
)

export default TiltShiftMaterial;