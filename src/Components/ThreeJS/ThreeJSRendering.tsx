import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3 } from "three";
import { Stage, CameraControls,  GizmoHelper, GizmoViewport, Bounds } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import Block from "./Block";
import Plane from "./Plane";
import SaveImageButton from "../SaveImageButton";


interface ThreeJSRenderingProps {
    base64Texture: string;
    width: number;
    height: number;
    enableEffect: boolean;
    debug: boolean;
    saturation: number;
    blur: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}


function ThreeJSRendering({
  base64Texture,
  width,
  height,
  enableEffect,
  saturation,
  blur,
  top,
  bottom,
  left,
  right
} : ThreeJSRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const backgroundColor = "transparent";

  return (
    <div style={{width, height }} className="flex flex-col gap-5 w-full h-screen">
      <Canvas
        camera={{ position: [0, 0.0, 1], fov: 50, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        width={500}
        height={500 * height/width}
        gl={{ preserveDrawingBuffer: true }}
      >
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={<FallBackLoader/>}>
          <Bounds fit observe center margin={1}  >
            <Plane
              width={1}
              height={height/width}
              base64Texture={base64Texture}
              enableEffect={enableEffect}
              saturation={saturation}
              blur={blur}
              top={top}
              bottom={bottom}
              left={left}
              right={right}
            />
          </Bounds>
        </Suspense >
      </Canvas>
      <SaveImageButton
        label="Download"
        canvasRef={canvasRef}
        filename="tilt-shift"
      />
    </div>
  );
}

export default ThreeJSRendering;