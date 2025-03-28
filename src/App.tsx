import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ThreeJSRendering from "./Components/ThreeJS/ThreeJSRendering";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [imageBase64, setImageBase64] = useState<string|null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [enable, setEnable] = useState<boolean>(false);
  const [saturation, setSaturation] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [topY, setTopY] = useState<number>(0);
  const [bottomY, setBottomY] = useState<number>(1.0);

  function onChange(imageBase64: string, width: number, height: number) {
    setImageBase64(imageBase64);
    setWidth(width)
    setHeight(height)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <InputFileWithPreview
          onChange={onChange}
          imageBase64={imageBase64}
      />
      <div style={{width: 500, height: 600}}>
        {!imageBase64 ?
          <div className="flex flex-col gap-5 items-center">
            <span className="loading loading-bars w-16 text-primary"></span>
            <span>render explanation</span>
          </div> :
          <ThreeJSRendering
            base64Texture={imageBase64}
            width={width}
            height={height}
            enableEffect={enable}
            saturation={saturation}
            blur={blur}
            topY={topY}
            bottomY={bottomY}
          />
        }
      </div>
    </>
  )
}

export default App
