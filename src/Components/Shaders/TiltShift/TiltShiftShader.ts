/**
 * Dithering shader implementation
 * Applies a dithering effect to the rendered scene
 * 
 * Credits:
 * Original dithering pattern: https://www.shadertoy.com/view/ltSSzW
 */

const TiltShiftShader = /*glsl*/`

    float ITER=3.0;
    float MAX=0.9;

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

    float computeFonction(float min1, float max1, float value)
    {
        return smoothstep(0.5, 1.0, normalizea(min1, max1, value));
    }


    float rand( const in vec2 uv )
    {
        const float a = 12.9898, b = 78.233, c = 43758.5453;
        float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
        return fract(sin(sn) * c);
    }

    vec4 triangleBlur(sampler2D text, const in vec2 uv, float blurX, float blurY)
    {
        vec2 delta = vec2(blurX, blurY);
        vec4 sum = vec4(0.0);
        float total = 0.0;
        float offset = rand(uv);
        for ( float t = -ITER; t <= ITER; t++) {

            float percent = (t + offset - 0.5) / ITER;
            float weight = 1.0 - abs(percent);
            sum += texture2D(text, uv + delta * percent) * weight;
            total += weight;
      
        }
        return sum / total;
    }


    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

        // Normalized pixel coordinates (from 0 to 1)
        float left = 0.1;
        float right = 0.8;
        float top = 0.6;
        float bottom = 0.2;

        //outputColor = texture2D(inputBuffer, uv);
        
        
        if(uv.x >= left && uv.x <= right && uv.y <= top && uv.y >= bottom) {
          outputColor =  inputColor;
          return;
        }
       
    
        float blurX = 0.;
        float blurY = 0.;
        
        if(uv.x < left) {
            blurX = MAX * computeFonction(left, 0.0, uv.x);
        }
        else if(uv.x > right) {
            blurX = MAX * computeFonction(right, 1.0, uv.x);
        }
        
        
        if(uv.y > top) {
            blurY = MAX * computeFonction(top, 1.0, uv.y);
        }
        else if(uv.y < bottom) {
            blurY = MAX * computeFonction(left, 0.0, uv.y);
        }
        
        
        // debug
        outputColor = vec4(blurY, blurX,0.0,1.0);

      // Output to screen
      // vec4 blurred_texture = triangleBlur(inputBuffer, uv, blurX, blurY);
      //vec3 textureRGBSaturated = saturateFn(blurred_texture.rgb, saturation);
      //outputColor = vec4(textureRGBSaturated, inputColor.a);
   }

`;

export default TiltShiftShader; 