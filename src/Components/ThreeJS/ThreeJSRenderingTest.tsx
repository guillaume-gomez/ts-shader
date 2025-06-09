import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3, Box3 } from "three";
import { Stage, CameraControls,  GizmoHelper, GizmoViewport, Box  } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import DitheringEffect from "../Shaders/Dithering/DitheringEffect";


interface ThreeJSRenderingProps {
   
}


function ThreeJSRendering({
 
} : ThreeJSRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });

  return (
    <div className="flex flex-col gap-5 w-full h-screen">
      <Canvas
        camera={{ position: [0, 0.0, 10], fov: 50, far: 200 }}
        dpr={window.devicePixelRatio}
        onDoubleClick={toggleFullscreen}
        ref={canvasRef}
      >
        <color attach="background" args={[0x451231]} />
        <Suspense fallback={<FallBackLoader/>}>
          <Stage
            adjustCamera={false}
            intensity={1}
            shadows="contact"
            environment="city"
          >   
            <Box
              args={[1, 1, 1]} // Width, height, depth. Default is [1, 1, 1]
            >
              <meshPhongMaterial color="#f3f3f3" wireframe={false} />
            </Box>
          </Stage>
         
         <EffectComposer>
            <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <DitheringEffect param={{gridSize: 10}} />
          </EffectComposer>
        </Suspense >
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>
        <CameraControls makeDefault />
      </Canvas>
    </div>
  );
}

export default ThreeJSRendering;