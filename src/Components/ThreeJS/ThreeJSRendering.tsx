import { Suspense, forwardRef, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFullscreen } from "rooks";
import { Mesh, Vector3, Box3 } from "three";
import { OrthographicCamera } from '@react-three/drei';
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
      const ref = useRef<OrthographicCamera>(null);

      return (
          <Canvas
            dpr={window.devicePixelRatio}
            onDoubleClick={toggleFullscreen}
            ref={canvasRef}
            width={width}
            height={height}
            style={{ width: widthCanvas, height: heightCanvas }}
            gl={{ preserveDrawingBuffer: true }}
          >
            <color attach="background" args={[backgroundColor]} />
            <ambientLight intensity={0.25} />
            <pointLight intensity={0.75} position={[500, 500, 1000]} />

            <Suspense fallback={<FallBackLoader/>}>
              <Plane
                width={width}
                height={height}
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
              <mesh
                position={[0,0,-1000]}
              >
                <boxGeometry args={[width - 10, height-10, 1]} />
                <meshStandardMaterial attach="material" color={"orange"} />
              </mesh>

              <OrthographicCamera
                makeDefault
                zoom={1}
                top={height/2}
                bottom={-height/2}
                left={width/2}
                right={-width/2}
                near={1}
                far={2000}
                position={[0, 0, 200]}
              />
            </Suspense >
          </Canvas>
      );
  }
);


export default ThreeJSRendering;