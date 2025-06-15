import { Effect } from "postprocessing";
import * as THREE from "three";
import React, { forwardRef, useMemo } from 'react'
import { Uniform } from 'three'
import senaarShader from './SenaarShader';


/**
 * Interface for dithering effect options
 */
export interface SenaarEffectOptions {
  time?: number;
  resolution?: THREE.Vector2;
  gridSize?: number;
}

/**
 * Implementation of the dithering effect
 * Applies a dithering pattern to the rendered scene
 */
class SenaarEffect extends Effect {
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
    color = new THREE.Color(0xFF0055),
  }: DitheringEffectOptions = {}) {
    console.log(color)
    // Initialize uniforms with default values
    const uniforms = new Map<string, THREE.Uniform<number | THREE.Vector2>>([
      ["time", new THREE.Uniform(time)],
      ["resolution", new THREE.Uniform(resolution)],
      ["colorGradiant", new THREE.Uniform(color)],
    ]);

    super("DitheringEffect", senaarShader, {
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

  /**
   * Sets the grid size for the dithering pattern
   * @param size - The grid size value
   */
  setColorGradiant(color: THREE.Color): void {
    const colorGradiant = this.uniforms.get("colorGradiant");
    if (colorGradiant !== undefined) {
      colorGradiant.value = size;
    }
  }
}

// Effect component
const SenaarEffectWrapper = forwardRef(({ param }, ref) => {
  const effect = useMemo(() => new SenaarEffect(param), [param])
  return <primitive ref={ref} object={effect} dispose={null} />
});

export default SenaarEffectWrapper;