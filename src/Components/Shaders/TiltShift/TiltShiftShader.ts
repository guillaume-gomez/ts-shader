/**
 * Dithering shader implementation
 * Applies a dithering effect to the rendered scene
 * 
 * Credits:
 * Original dithering pattern: https://www.shadertoy.com/view/ltSSzW
 */

const TiltShiftShader = /*glsl*/`
    uniform vec2 resolution;
    uniform bool enable;
    uniform float saturation;
    uniform float blur;
    uniform float top;
    uniform float bottom;
    uniform float left;
    uniform float right;
    uniform float maxPos;


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

    float map(float min1, float max1, float min2, float max2, float value)
    {
        return mix(min2, max2, normalizea(min1, max1, value));
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
      vec2 fragCoord = uv * resolution;
      if(!enable) {
        outputColor = inputColor;
        return;
      }
    

      //vec3 textureRGBSaturated = saturateFn(blurred_texture.rgb, saturation);
      //outputColor = vec4(textureRGBSaturated, inputColor.a);

      vec4 baseColor = texture2D(inputBuffer, uv);
      float biais = map(0.0, 0.2, 0.5, 0.0, uv.y);
      outputColor = mix(baseColor, inputColor, biais);
   }
`;

export default TiltShiftShader; 