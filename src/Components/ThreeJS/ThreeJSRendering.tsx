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
    saturation: number;
    blur: number;
    topY: number;
    bottomY: number;
}


function ThreeJSRendering({
  base64Texture,
  width,
  height,
  enableEffect,
  saturation,
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
        camera={{ position: [0, 0.0, 0.7], fov: 50, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
      >
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={<FallBackLoader/>}>
          <Plane
            width={1}
            height={height/width}
            base64Texture={base64Texture}
            enableEffect={enableEffect}
            saturation={saturation}
            blur={blur}
            topY={topY}
            bottomY={bottomY}
          />
          
        </Suspense >
      </Canvas>
    </div>
  );
}

export default ThreeJSRendering;