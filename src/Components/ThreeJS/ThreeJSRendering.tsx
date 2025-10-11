import { Suspense, forwardRef, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3, Box3 } from "three";
import { Stage, GizmoHelper, GizmoViewport, Bounds } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import Plane from "./Plane";


interface ThreeJSRenderingProps {
    base64Texture: string;
    width: number;
    height: number;
    widthCanvas: number;
    heightCanvas: number;
    enableEffect: boolean;
    debug: boolean;
    saturation: number;
    blur: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
    threshold: number;
}

const ThreeJSRendering = forwardRef(
  ({
    base64Texture,
    width,
    height,
    widthCanvas,
    heightCanvas,
    enableEffect,
    saturation,
    blur,
    debug,
    top,
    bottom,
    threshold,
    left,
    right
    }: ThreeJSRenderingProps, canvasRef) => {
      const { toggleFullscreen } = useFullscreen({ target: canvasRef });
      const backgroundColor = "blue";

      return (
          <Canvas
            camera={{ position: [0, 0.0, 0.5], fov: 50, far: 5 }}
            dpr={window.devicePixelRatio}
            onDoubleClick={toggleFullscreen}
            ref={canvasRef}
            width={width}
            height={height}
            style={{ width: widthCanvas, height: heightCanvas }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <color attach="background" args={[backgroundColor]} />
            <Suspense fallback={<FallBackLoader/>}>
              
                <Plane
                  width={1}
                  height={height/width}
                  base64Texture={base64Texture}
                  enableEffect={enableEffect}
                  saturation={saturation}
                  threshold={threshold}
                  blur={blur}
                  top={top}
                  bottom={bottom}
                  left={left}
                  right={right}
                  debug={debug}
                />
             
            </Suspense >
          </Canvas>
      ); 
  }
);


export default ThreeJSRendering;