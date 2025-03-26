import { shaderMaterial } from "@react-three/drei";

const TiltShiftMaterial = shaderMaterial(
  { uTexture: null, frequencies: [0, 0.25, 0.75, 0.33, 1.0], uAmplitude: 1.0, uFilter: 50.0, uInvertColor: false },
  // vertex shader
  /*glsl*/`
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float frequencies[128];
    uniform float uAmplitude;
    uniform float uFilter;
    /* display lighter color first or vice-versa */
    uniform bool uInvertColor;

    void main() {
      vUv = uv;
      vec3 texture = texture2D(uTexture, uv).rgb;

      float gray = (texture.r * 0.3 + texture.g * 0.59 + texture.b * 0.11);
      float numberOfFrequencies = 128.0;


      int frequencyIndex = uInvertColor ?
        int(numberOfFrequencies) - int( floor( numberOfFrequencies * gray ) ) :
        int( floor( numberOfFrequencies * gray ) )
      ;

      float frequency = frequencies[frequencyIndex];

      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      float normalisedFrequency = frequency > uFilter ? (frequency / 255.0) : 0.0;
      modelPosition.z += normalisedFrequency * uAmplitude;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;
    }
  `,
  // fragment shader
  /*glsl*/`
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec3 texture = texture2D(uTexture, vUv).rgb;
      gl_FragColor = vec4(texture, 1.0);
    }
  `
)

export default TiltShiftMaterial;