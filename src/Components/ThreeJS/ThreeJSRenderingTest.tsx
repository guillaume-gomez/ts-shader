import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3, Box3, Color } from "three";
import { Stage, CameraControls,  GizmoHelper, GizmoViewport, Box  } from '@react-three/drei';
import FallBackLoader from "./FallBackLoader";
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import DitheringEffect from "../Shaders/Dithering/DitheringEffect";
import SenaarEffect from "../Shaders/Senaar/SenaarEffect";
import TiltShiftEffect from "../Shaders/TiltShift/TiltShiftEffect";
import ShapeTest from "../Shape";



interface ThreeJSRenderingProps {
    enableEffect: boolean;
    debug: boolean;
    maxPos: number;
    saturation: number;
    blur: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}



function ThreeJSRendering({
 enableEffect,
  saturation,
  maxPos,
  blur,
  top,
  bottom,
  left,
  right
} : ThreeJSRenderingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleFullscreen } = useFullscreen({ target: canvasRef });

  console.log(top)

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
            {
              Array.from({ length: 25 }).map(i => {
                return (
                  <Box
                    position={[Math.random() * 25.0, 0, Math.random() * 10]}
                    args={[0.5, 1, 1]} // Width, height, depth. Default is [1, 1, 1]
                  >
                    <meshPhongMaterial color={0xFFFFFF * Math.random()} wireframe={false} />
                  </Box>
                );
              })
            }
            <ShapeTest />

          </Stage>
         
         {/*<EffectComposer>
            <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <DitheringEffect param={{gridSize: 10}} />
          </EffectComposer>*/}
        <EffectComposer>
         {/*<SenaarEffect param={{color: new Color(0x909000), enableStripe: true, stripeDirection: -4.0, gradiantCurve: 0.5 }} />*/}
          <TiltShiftEffect
            param={{
              time: 0,
              top,
              bottom,
              right,
              left,
              saturation,
              blur,
              enable: enableEffect,
              rotation: 0.0,
            }}
          />
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