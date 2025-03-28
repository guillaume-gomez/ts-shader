import { shaderMaterial } from "@react-three/drei";

const TiltShiftMaterial = shaderMaterial(
  { uTexture: null, uSaturation: 0.1, uEnable: false, uBlur: 0.0, uTopY: 0.0, uBottomY: 0.0, uIntensity: 0.5, uDebug: false },
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

    vec3 saturateFn(vec4 textureColor, float saturationRatio)
    {
      vec3 textureRGB = textureColor.rgb;
      vec3 textureHSV = rgb2hsv(textureRGB).xyz;
      textureHSV.y += saturationRatio;

      return hsv2rgb(textureHSV);
    }


    const int gaussRadius = 11;
    const float gaussFilter[gaussRadius] = float[gaussRadius](
      0.0402,0.0623,0.0877,0.1120,0.1297,0.1362,0.1297,0.1120,0.0877,0.0623,0.0402
    );

    vec3 blurFn(sampler2D tex, vec2 uv, float blurRatio) {
      vec2 uShift = vec2(blurRatio/1000.0, 0.0);
      vec2 texCoord = uv - float(int(gaussRadius/2)) * uShift;
      vec3 color = vec3(0.0, 0.0, 0.0); 
      for (int i=0; i<gaussRadius; ++i) { 
        color += gaussFilter[i] * texture2D(tex, texCoord).rgb;
        texCoord += uShift;
      }

      return color;
    }

    float reMap(float value, float start1,float stop1,float start2,float stop2) {
      return (value - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    }


    float smoothFn(float min, float max, float value) {
      float remappedValue = reMap(value, min, max, 0.60, 1.0);
      return remappedValue;
    }

    uniform sampler2D uTexture;
    varying vec2 vUv;
    uniform bool uEnable;
    uniform float uSaturation;
    uniform float uBlur;
    uniform float uTopY;
    uniform float uBottomY;
    uniform float uIntensity;
    uniform bool uDebug;

  
    void main() {
      vec4 textureColor = texture2D(uTexture, vUv);
      vec3 textureRGB = textureColor.rgb;

      if(uEnable) {
        vec3 blurred_pixel = vec3(0.0);

        // if the pixel is within topBlurBorder or bottomBlurBorder
        if ( ((1.0-vUv.y) <= uTopY) ||  vUv.y <= uBottomY ){
          
          float normalisedY = ((1.0-vUv.y) <uTopY) ? 
            reMap((1.0 - vUv.y), 0.0, uTopY, 0.0, 1.0) :
            reMap(vUv.y, 0.0, uBottomY, 0.0, 1.0);


          vec3 color = !uDebug ? 
            blurFn(uTexture, vUv, (1.0 - normalisedY) * uBlur) :
            vec3((1.0 - normalisedY) * uBlur);


          blurred_pixel = color;
        } else {
          blurred_pixel = textureRGB;
        }

        vec3 textureRGBSaturated = saturateFn(vec4(blurred_pixel, 0.0), uSaturation);
        //vec3 textureRGBSaturated = blurred_pixel;
        gl_FragColor = vec4(textureRGBSaturated, 1.0);

      } else {
        gl_FragColor = vec4(textureRGB, 1.0);
      }
    }
  `
)

export default TiltShiftMaterial;