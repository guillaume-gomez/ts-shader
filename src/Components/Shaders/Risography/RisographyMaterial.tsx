import { Color, Vector3 } from "three";
import { shaderMaterial } from "@react-three/drei";

const RisographyMaterial = shaderMaterial(
  { 
    uTexture: null,
    uEnable: false,
    uColor: { value: new Color(0x51b1f5) },
    uLightPos: {
      value: new Vector3(0, 5, 3) // position of spotlight
    },
    uLightColor: {
      value: new Color(0xffffff) // default light color
    },
    uLightIntensity: {
      value: 0.7 // light intensity
    },
    uNoiseScale: {
      value: 0.8
    },
    uNoiseCoef: {
      value: 3.5,
    }
  },
  // vertex shader
  /*glsl*/`


    varying vec2 vUv;
    uniform sampler2D uTexture;

    uniform vec3 uLightPos;
    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;

    void main() {
       vNormal = normalize(normalMatrix * normal);

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      // General calculations needed for diffuse lighting
      // Calculate a vector from the fragment location to the light source
      vec3 surfaceToLightDirection = vec3( modelViewMatrix * vec4(position, 1.0));
      vec3 worldLightPos = vec3( viewMatrix * vec4(uLightPos, 1.0));
      vSurfaceToLight = normalize(worldLightPos - surfaceToLightDirection);
    }
  `,
  // fragment shader
  /*glsl*/`
    // 2D Random
    float random (in vec2 st) {
      return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))
        * 43758.5453123);
    }


    float noise2 (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    uniform vec3 uLightColor;
    uniform vec3 uColor;
    uniform float uLightIntensity;
    uniform float uNoiseScale;
    uniform float uNoiseCoef;

    varying vec3 vNormal;
    varying vec3 vSurfaceToLight;
    uniform sampler2D uTexture;
    

    vec3 light_reflection(vec3 lightColor) {
      // AMBIENT is just the light's color
      vec3 ambient = lightColor;

      //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // DIFFUSE  calculations
      // Calculate the cosine of the angle between the vertex's normal
      // vector and the vector going to the light.
      vec3 diffuse = lightColor * dot(vSurfaceToLight, vNormal);

      // Combine 
      return (ambient + diffuse);
    }

    void main() {
      vec3 light_value = light_reflection(uLightColor);
      light_value *= uLightIntensity;

      vec4 textureColor = texture2D(uTexture, gl_FragCoord.xy);
      

      // grain
      vec2 uv = gl_FragCoord.xy;
      uv /= uNoiseScale;

      

      vec3 colorNoise = vec3(noise2(uv) * 0.5 + 0.5);
      colorNoise *= pow(light_value.r, uNoiseCoef);

      gl_FragColor.r = max(colorNoise.r, uColor.r);
      gl_FragColor.g = max(colorNoise.g, uColor.g);
      gl_FragColor.b = max(colorNoise.b, uColor.b);
      gl_FragColor.a = 1.0;

      // test
      //gl_FragColor = textureColor;
    }
  `
)

export default RisographyMaterial;