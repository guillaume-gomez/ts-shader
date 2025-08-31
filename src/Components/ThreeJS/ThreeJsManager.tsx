import { useRef, useState, useEffect } from "react";
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
    onChangeParams: (params) => void;
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
  right,
  onChangeParams
} : ThreeJsManagerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [widthCanvas, setWidthCanvas] = useState<number>(300);
  const [heightCanvas, setHeightCanvas] = useState<number>(400);

  useEffect(() => {
    if(!canvasContainerRef.current) {
      return;
    }

    console.log("width/height ", canvasContainerRef.current.offsetWidth, " ", canvasContainerRef.current.offsetHeight );

    if(width >= height && canvasContainerRef.current.offsetWidth < width) {
        const aspectRatio = height/width;
        const border = 50;

        const newWidth = canvasContainerRef.current.offsetWidth - border;
        console.log("newWidth:  ", newWidth)
        setWidthCanvas(newWidth)
        setHeightCanvas(newWidth * aspectRatio);
    } else if( height >= width && canvasContainerRef.current.offsetHeight < height)  {
        const aspectRatio = width/height;
        const border = 50;

        const newHeight = canvasContainerRef.current.offsetHeight - border;
        console.log("newHeight:  ", newHeight)
        setWidthCanvas(newHeight * aspectRatio)
        setHeightCanvas(newHeight);
    } else {
      setWidthCanvas(width)
      setHeightCanvas(height)
    }
  
  }, [imageBase64, width, height]) 


  console.log(widthCanvas, ", ", heightCanvas, "alors que ", width, ",, ", height) 

  return (
    <div ref={canvasContainerRef} className="flex flex-col gap-5 w-full h-screen">
      
      <div> 
         { debug &&
          <TiltShiftControllerCanvas
            width={width}
            height={height}
            widthCanvas={widthCanvas}
            heightCanvas={heightCanvas}
            onChange={onChangeParams}
          />
        }
        <ThreeJSRendering
          base64Texture={imageBase64}
          width={width}
          height={height}
          widthCanvas={widthCanvas}
          heightCanvas={heightCanvas}
          enableEffect={enableEffect}
          debug={false} // do not need debug anymore
          saturation={saturation}
          threshold={threshold}
          blur={blur}
          top={top}
          bottom={bottom}
          right={right}
          left={left}
          ref={canvasRef}
        />
      </div>

      <SaveImageButton
        label="Download"
        canvasRef={canvasRef}
        filename="tilt-shift"
      />
    
    </div>
  )
}



export default ThreeJsManager;