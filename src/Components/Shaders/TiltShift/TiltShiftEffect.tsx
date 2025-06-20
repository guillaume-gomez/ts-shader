import { Effect } from "postprocessing";
import * as THREE from "three";
import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import tiltShiftShader from './TiltShiftShader';


/**
 * Interface for dithering effect options
 */
export interface TiltShiftEffectOptions {
  time?: number;
  resolution?: THREE.Vector2;
  enable: boolean;
  top: number;
  bottom: number;
  right: number;
  left: number;
}

/**
 * Implementation of the dithering effect
 * Applies a dithering pattern to the rendered scene
 */
class TiltShiftEffect extends Effect {
  /**
   * Map of uniforms used by the shader
   */
  uniforms: Map<string, THREE.Uniform<number | THREE.Vector2>>;

  /**
   * Creates a new dithering effect instance
   * @param options - Configuration options for the effect
   */
  constructor({
    time = 0,
    resolution = new THREE.Vector2(1, 1),
    top = 0.2,
    bottom = 0.2,
    right = 0.2,
    left = 0.2,
    blur =10.0,
    enable = true,
    saturation = 0.5,
    maxPos = 0.5

  }: TiltShiftEffectOptions) {
    console.log(time)
    // Initialize uniforms with default values
    const uniforms = new Map<string, THREE.Uniform<number | THREE.Vector2 | THREE.Color >>([
      ["time", new THREE.Uniform(time)],
      ["resolution", new THREE.Uniform(resolution)],
      ["top", new THREE.Uniform(top)],
      ["bottom", new THREE.Uniform(bottom)],
      ["left", new THREE.Uniform(left)],
      ["right", new THREE.Uniform(right)],
      ["blur", new THREE.Uniform(blur)],
      ["saturation", new THREE.Uniform(saturation)],
      ["maxPos", new THREE.Uniform(maxPos)],
      ["enable", new THREE.Uniform(enable ? 1 : 0)],
    ]);

    super("TiltShiftEffect", tiltShiftShader, {
      // blendFunction: BlendFunction.SCREEN,
      uniforms
    });

    this.uniforms = uniforms;
  }

  /**
   * Updates the effect parameters on each frame
   * @param renderer - The WebGL renderer
   * @param inputBuffer - The input render target
   * @param deltaTime - Time elapsed since the last frame
   */
  update(
    renderer: THREE.WebGLRenderer,
    inputBuffer: THREE.WebGLRenderTarget,
    deltaTime: number
  ): void {
    // Update time uniform
    const timeUniform = this.uniforms.get("time");
    if (timeUniform !== undefined && typeof timeUniform.value === 'number') {
      timeUniform.value += deltaTime;
    }

    // Update resolution uniform to match current render target
    const resolutionUniform = this.uniforms.get("resolution");
    if (resolutionUniform !== undefined && resolutionUniform.value instanceof THREE.Vector2) {
      resolutionUniform.value.set(
        inputBuffer.width,
        inputBuffer.height
      );
    }
  }

  /**
   * Performs initialization tasks
   * @param renderer - The WebGL renderer
   * @param alpha - Whether the renderer uses the alpha channel
   * @param frameBufferType - The type of the main frame buffers
   */
  initialize(
    renderer: THREE.WebGLRenderer,
    alpha: boolean,
    frameBufferType: number
  ): void {
    // No special initialization required for this effect
  }

  setTop(value: number): void {
    const top = this.uniforms.get("top");
    if (top !== undefined) {
      top.value = size;
    }
  }

  setEnableStripe(value: boolean): void {
    const enableStripe = this.uniforms.get("enableStripe");
    if (enableStripe !== undefined) {
      enableStripe.value = value;
    }
  }
  
  setStripeDiection(direction: float): void {
    const stripeDirection = this.uniforms.get("stripeDirection");
    if (stripeDirection !== undefined) {
      stripeDirection.value = direction;
    }
  }

  setGradiantCurve(value: float): void {
    const gradiantCurve = this.uniforms.get("gradiantCurve");
    if (gradiantCurve !== undefined) {
      gradiantCurve.value = value;
    }
  }

}


// Effect component
const TiltShiftEffectWrapper = forwardRef(({ param } : TiltShiftEffectOptions, ref) => {
  console.log(param)
  const effect = useMemo(() => new TiltShiftEffect(param), [param])
  return <primitive ref={ref} object={effect} dispose={null} />
});

export default TiltShiftEffectWrapper;