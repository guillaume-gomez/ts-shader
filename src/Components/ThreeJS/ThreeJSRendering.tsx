import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3 } from "three";
import { Stage, CameraControls,  GizmoHelper, GizmoViewport, Bounds } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import Block from "./Block";
import Plane from "./Plane";


interface ThreeJSRenderingProps {
    base64Texture: string;
    width: number;
    height: number;
    enableEffect: boolean;
    debug: boolean;
    saturation: number;
    intensity: number;
    blur: number;
    topY: number;
    bottomY: number;
}


function ThreeJSRendering({
  base64Texture,
  width,
  height,
  enableEffect,
  debug,
  saturation,
  intensity,
  blur,
  topY,
  bottomY
} : ThreeJSRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const backgroundColor = 0xFF0000;

  return (
    <div style={{width, height }} className="flex flex-col gap-5 w-full h-screen">
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 50, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
      >
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={<FallBackLoader/>}>
          <Bounds fit observe center margin={0.6}  >
            <Plane
              width={1}
              height={height/width}
              base64Texture={base64Texture}
              enableEffect={enableEffect}
              debug={debug}
              saturation={saturation}
              intensity={intensity}
              blur={blur}
              topY={topY}
              bottomY={bottomY}
            />
          </Bounds>
          
        </Suspense >
      </Canvas>
    </div>
  );
}

export default ThreeJSRendering;