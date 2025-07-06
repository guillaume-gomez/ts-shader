
import { useEffect, useState, useRef } from "react";

interface TiltShiftControllerCanvasProps {
  width: number;
  height: number;
}

interface Points {
  x: number;
  y: number;
}

function TiltShiftControllerCanvas({width, height} : TiltShiftControllerCanvasProps) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef();
  const mouseRef = useRef({x: 0, y: 0});
  const canvasRefPosition = useRef({x: -1, y: -1});
  const [clicked, setClicked ] = useState<boolean>(false);
  const toto = useRef<boolean>(false);
  const points = useState<Points[]>([{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}])

  function getCanvasPositionFromPage(canvas) {
    
    var rect = canvas.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top
    };
  } 

  function animate() {
    if(!canvasRef.current) {
      requestAnimationFrame(animate);
      return;
    } else if (!contextRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
    }

    if(canvasRefPosition.current.x === -1 && canvasRefPosition.current.y === -1) {
      canvasRefPosition.current = getCanvasPositionFromPage(canvasRef.current);
    }

    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
 

    const { x, y } = mouseRef.current;
    contextRef.current.beginPath();
    contextRef.current.arc(x, y, 15, 0, 2 * Math.PI, true);
    contextRef.current.fillStyle = toto.current ? "#FF6A6A" : "#00FFDD";
    contextRef.current.fill();

    requestAnimationFrame(animate);

  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once

  return (
    <canvas
      className="absolute"
      ref={canvasRef}
      width={width}
      height={height}
      style={{background: "#FF000055", zIndex: 100}}
      onMouseMove={(event) => {
        mouseRef.current.x = event.clientX - canvasRefPosition.current.x;
        mouseRef.current.y = window.scrollY + event.clientY - canvasRefPosition.current.y;
      }}
      onMouseDown={() => {
        setClicked(false);
        toto.current = false;
      }}
      onMouseUp={() => {
        setClicked(true);
        toto.current = true;
      }}
    />
  )
}

export default TiltShiftControllerCanvas;