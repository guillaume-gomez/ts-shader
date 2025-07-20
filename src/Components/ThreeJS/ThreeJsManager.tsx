import { useRef } from "react";
import ThreeJSRendering from "./ThreeJSRendering";
import TiltShiftControllerCanvas from "./TiltShiftControllerCanvas";
import SaveImageButton from "../SaveImageButton";


interface ThreeJsManagerProps {
    imageBase64: string;
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


function ThreeJsManager({
  imageBase64,
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
} : ThreeJsManagerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  return (
    <div style={{width, height }} className="flex flex-col gap-5 w-full h-screen">
       <TiltShiftControllerCanvas
        width={width}
        height={height}
        onChange={ ({ left, right, top, bottom }) => {
            setLeft(left);
            setRight(right);
            setTop(top);
            setBottom(bottom);
          }
        }
      />
      <ThreeJSRendering
        base64Texture={imageBase64}
        width={width}
        height={height}
        enableEffect={enableEffect}
        debug={debug}
        saturation={saturation}
        threshold={threshold}
        blur={blur}
        top={top}
        bottom={bottom}
        right={right}
        left={left}
        ref={canvasRef}
      />

      <SaveImageButton
        label="Download"
        canvasRef={canvasRef}
        filename="tilt-shift"
      />
    
    </div>
  )
}



export default ThreeJsManager;