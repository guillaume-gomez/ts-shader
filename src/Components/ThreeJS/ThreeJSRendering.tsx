import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3 } from "three";
import { Stage, CameraControls,  GizmoHelper, GizmoViewport } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import Block from "./Block";


interface ThreeJSRenderingProps {
    imageTexture: string;
}


function ThreeJSRendering({ imageTexture } : ThreeJSRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });
  const meshRef = useRef<Mesh>(null);
  const maxDistance = useRef<number>(500);
  const cameraControlRef = useRef<CameraControls>(null);
  const backgroundColor = 0xFF0000;

  useEffect(() => {
    if(!meshRef.current) {
      return;
    }
    centerCamera(meshRef.current)
  }, [meshRef, imageTexture])

  async function centerCamera(mesh : Mesh) {
    if(cameraControlRef.current) {
      cameraControlRef.current.maxDistance = 500;
      await cameraControlRef.current.setLookAt(
        0, 0, 1,
        0,0, 0,
        false
      );
      await cameraControlRef.current.fitToBox(mesh, true,
        { paddingLeft: 1, paddingRight: 1, paddingBottom: 2, paddingTop: 2 }
      );
      let distanceCamera = new Vector3();
      cameraControlRef.current.getPosition(distanceCamera, false);
      maxDistance.current = distanceCamera.z + 5.0;
    }
  }

  return (
    <div style={{width: "100%", height: "100%"}} className="flex flex-col gap-5 w-full h-screen">
      <Canvas
        camera={{ position: [0, 0.0, 3], fov: 50, far: 5 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
      >
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={<FallBackLoader/>}>
          <Stage
            intensity={0.5}
            preset="upfront"
            adjustCamera={false}
            >
            <group
              position={[
              0, 0, 0]}
            >
              <Block base64Texture={imageTexture} />
            </group>
            <CameraControls
                /*minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.9}
                minAzimuthAngle={-0.55}
                maxAzimuthAngle={0.55}*/
                makeDefault
                maxDistance={maxDistance.current}
                ref={cameraControlRef}
              />
            <GizmoHelper alignment="bottom-right" margin={[50, 50]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          </Stage>
        </Suspense >
      </Canvas>
    </div>
  );
}

export default ThreeJSRendering;