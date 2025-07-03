import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3, Box3 } from "three";
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
    threshold: number;
}


function ThreeJSRendering({
  base64Texture,
  width,
  height,
  enableEffect,
  saturation,
  blur,
  debug,
  top,
  bottom,
  threshold,
  left,
  right
} : ThreeJSRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const backgroundColor = "transparent";

  return (
    <div style={{width, height }} className="flex flex-col gap-5 w-full h-screen">
      <Canvas
        camera={{ position: [0, 0.0, 0.5], fov: 50, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
        width={500}
        height={500 * (height/width)}
       // style={{width: 500, height: (500 * (height/width))}}
        onCreated={(state) => {
          let camera = state.camera;
          const fov = camera.fov * ( Math.PI / 180 );
          const fovh = 2*Math.atan(Math.tan(fov/2) * camera.aspect);
          
          const size = new Vector3(1, height/width, 0.001);

          let dx = size.z / 2 + Math.abs( size.x / 2 / Math.tan( fovh / 2 ) );
          let dy = size.z / 2 + Math.abs( size.y / 2 / Math.tan( fov / 2 ) );
          let cameraZ = Math.max(dx, dy);

          camera.position.set( 0, 0, cameraZ );
          }
        }
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
      <SaveImageButton
        label="Download"
        canvasRef={canvasRef}
        filename="tilt-shift"
      />
    </div>
  );
}

export default ThreeJSRendering;