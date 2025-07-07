
import { useEffect, useState, useRef } from "react";

interface TiltShiftControllerCanvasProps {
  width: number;
  height: number;
}

interface Points {
  x: number;
  y: number;
}

const RADIUS = 15;

function TiltShiftControllerCanvas({width, height} : TiltShiftControllerCanvasProps) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef();
  const mouseRef = useRef({x: 0, y: 0});
  const canvasRefPosition = useRef({x: -1, y: -1});
  const clicked = useRef<boolean>(false);
  const [points, setPoints] = useState<Points[]>([
    { x: 0.25 * width, y: 0.25 * height },
    { x: 0.75 * width, y: 0.25 * height },
    { x: 0.25 * width, y: 0.75 * height },
    { x: 0.75 * width, y: 0.75 * height }
  ])

  function getCanvasPositionFromPage(canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top
    };
  }

  function isIn(point: Point, mouseX: number, mouseY: number) {
    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    const distX = mouseX - point.x;
    const distY = mouseY - point.y;
    const distance = Math.sqrt( (distX*distX) + (distY*distY) );

    // if the distance is less than the circle's
    // radius the point is inside!
    if (distance <= RADIUS) {
      return true;
    }
    return false;
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
    contextRef.current.arc(x, y, RADIUS, 0, 2 * Math.PI, true);
    contextRef.current.fillStyle = clicked.current ? "#FF6A6A" : "#00FFDD";
    contextRef.current.fill();
    
    points.map( point => {
      const { x, y } = point;
      contextRef.current.beginPath();
      contextRef.current.arc(x, y, RADIUS, 0, 2 * Math.PI, true);
      contextRef.current.fillStyle = isIn(point, mouseRef.current.x, mouseRef.current.y) ? "#0000FF" : "#00FF00";
      contextRef.current.fill();
    })

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
        mouseRef.current.x = window.scrollX + event.clientX - canvasRefPosition.current.x;
        mouseRef.current.y = window.scrollY + event.clientY - canvasRefPosition.current.y;
      }}
      onMouseDown={() => {
        clicked.current = false;
      }}
      onMouseUp={() => {
        clicked.current = true;
      }}
    />
  )
}

export default TiltShiftControllerCanvas;