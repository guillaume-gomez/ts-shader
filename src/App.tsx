import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ThreeJSRendering from "./Components/ThreeJS/ThreeJSRendering";
import InputFileWithPreview from "./Components/InputFileWithPreview";
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [imageBase64, setImageBase64] = useState<string|null>(null);

  function onChange(imageBase64: string) {
    setImageBase64(imageBase64);
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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <InputFileWithPreview
            onChange={onChange}
            imageBase64={imageBase64}
        />
        <div style={{width: 500, height: 600}}>
{/*          {!imageBase64 ?
            <div className="flex flex-col gap-5 items-center">
              <span className="loading loading-bars w-16 text-primary"></span>
              <span>render explanation</span>
            </div> :
            <ThreeJSRendering
              imageTexture={imageBase64}
            />
          }*/}
          <ThreeJSRendering
              imageTexture={imageBase64}
            />
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
