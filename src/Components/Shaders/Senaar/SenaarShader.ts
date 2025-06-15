/**
 * Dithering shader implementation
 * Applies a dithering effect to the rendered scene
 * 
 * Credits:
 * Original dithering pattern: https://www.shadertoy.com/view/ltSSzW
 */

const SenaarShader = /*glsl*/`
uniform vec2 resolution;
uniform vec3 colorGradiant;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 fragCoord = uv * resolution;
  vec3 baseColor = texture2D(inputBuffer, fragCoord).rgb;
  
  // Output final color preserving alpha
  
  //outputColor = vec4(baseColor, inputColor.a);
  //outputColor = vec4(inputColor.r, inputColor.g, inputColor.b, inputColor.a);


    vec3 top = vec3(0.,0.,0.);
    vec3 bottom = colorGradiant;
    
    outputColor = vec4(mix(bottom, top, uv.y) + inputColor.rgb, inputColor.a);
}`;

export default SenaarShader; 