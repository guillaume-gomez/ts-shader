import { useState } from 'react'
//import ThreeJSRendering2 from "./Components/ThreeJS/ThreeJSRenderingTest";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import TiltShiftControllerCanvas from "./Components/TiltShiftControllerCanvas";
import ThreeJsManager from "./Components/ThreeJS/ThreeJsManager";
import Toggle from "./Components/Toggle";
import Range from "./Components/Range";
import Card from "./Components/Card";


function App() {
  const [count, setCount] = useState(0)
  const [imageBase64, setImageBase64] = useState<string|null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [enable, setEnable] = useState<boolean>(true);
  const [debug, setDebug] = useState<boolean>(true);
  const [saturation, setSaturation] = useState<number>(0);
  const [blur, setBlur] = useState<number>(1);
  const [threshold, setThreshold] = useState<number>(0.5);
  const [top, setTop] = useState<number>(0.25);
  const [right, setRight] = useState<number>(0.25);
  const [left, setLeft] = useState<number>(0.25);
  const [bottom, setBottom] = useState<number>(0.25);


  function onChange(imageBase64: string, width: number, height: number) {
    setImageBase64(imageBase64);
    setWidth(width)
    setHeight(height)
  }

  return (
    <div className="bg-base-100 flex flex-col gap-4">
      <h1 className="text-6xl font-title">Tilt shift shader</h1>
      <div className="flex flex-row gap-2">
        {/*<ThreeJSRendering2
          enableEffect={enable}
          saturation={saturation}
          blur={blur}
          top={top}
          bottom={bottom}
          maxPos={maxPos}
          right={right}
          left={left}
        />*/}
        <Card title={"Settings"}>
          <InputFileWithPreview
              onChange={onChange}
              imageBase64={imageBase64}
          />
          <Toggle
            label="enable effect"
            onToggle={(value) => setEnable(value)}
            value={enable}
          />
          <Toggle
            label="Debug"
            onToggle={(value) => setDebug(value)}
            value={debug}
          />
          <Range 
            label="Saturation"
            value={saturation}
            onChange={(newValue) => setSaturation(newValue)}
            min={0}
            max={2}
            step={0.01}
            float={true}
          />
          <Range 
            label="Blur"
            value={blur}
            onChange={(newValue) => setBlur(newValue)}
            min={0}
            max={20}
            step={0.01}
            float={true}
          />
          <Range 
            label="Threshold"
            value={threshold}
            onChange={(newValue) => setThreshold(newValue)}
            min={0.5}
            max={1}
            step={0.01}
            float={true}
          />
          <Range 
            label="Right"
            value={right}
            onChange={(newValue) => setRight(newValue)}
            min={0}
            max={1}
            step={0.01}
            float={true}
          />
          <Range 
            label="Left"
            value={left}
            onChange={(newValue) => setLeft(newValue)}
            min={0}
            max={1}
            step={0.01}
            float={true}
          />
          <Range 
            label="top"
            value={top}
            onChange={(newValue) => setTop(newValue)}
            min={0}
            max={1}
            step={0.001}
            float={true}
          />
          <Range 
            label="bottom"
            value={bottom}
            onChange={(newValue) => setBottom(newValue)}
            min={0}
            max={1}
            step={0.001}
            float={true}
          />
        </Card>
        
        <Card title="Result" className="grow flex w-full h-full">
          {!imageBase64 ?
            <div className="flex flex-col gap-5 items-center">
              <span className="loading loading-bars w-16 text-primary"></span>
              <span>render explanation</span>
            </div> :
            <>
              <ThreeJsManager
                imageBase64={imageBase64}
                width={width}
                height={height}
                enableEffect={enable}
                debug={debug}
                saturation={saturation}
                threshold={threshold}
                blur={blur}
                top={top}
                bottom={bottom}
                right={right}
                left={left}
                onChangeParams={ ({ left, right, top, bottom }) => {
                    setLeft(left);
                    setRight(1-right);
                    setTop(top);
                    setBottom(1-bottom);
                  }
                }
              />
            </>
          }
        </Card>

      </div>
    </div>
  )
}

export default App
