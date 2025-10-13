import { useEffect, useState, useRef } from "react";
import { partition } from "lodash";

interface TiltShiftControllerCanvasProps {
  width: number;
  height: number;
  widthCanvas: number;
  heightCanvas: number;
  onChange: (coords: Coords) => void;
}

interface Coords {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface Points {
  x: number;
  y: number;
}

const RADIUS = 15;

function TiltShiftControllerCanvas({
  width,
  height,
  widthCanvas,
  heightCanvas,
  onChange,
  left,
  right,
  top,
  bottom
} : TiltShiftControllerCanvasProps) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const canvasRef = useRef<HTMLCanvasElement>();
  const contextRef = useRef();
  const mouseRef = useRef({x: 0, y: 0});
  const canvasRefPosition = useRef({x: -1, y: -1});
  const clicked = useRef<boolean>(false);
  const clickedIndex = useRef<number>(-1);
  const points = useRef<Points[]>(
    [
      { x: width/2 , y: top * height },
      { x: left * width, y: height/2 },
      { x: right * width, y: height/2 },
      { x: width/2, y: (1-bottom) * height }
    ]
  );

  useEffect(()  => {
    const [leftPts, others] = leftPoints();

    const leftPointsUpdated = leftPts.map(point => {
      return ({x: left*(width/2), y: point.y})
    });

    points.current = [
      ...leftPointsUpdated,
      ...others
    ]
  }, [left]);


  useEffect(()  => {
    const [rightPts, others] = rightPoints();

    const rightPointUpdated = rightPts.map(point => {
      return ({x: (width - (right * width/2)), y: point.y})
    });

    points.current = [
      ...rightPointUpdated,
      ...others
    ]
  }, [right]);

  useEffect(()  => {
    const [topPts, others] = topPoints();

    const topPointUpdated = topPts.map(point => {
      return ({x: point.x, y: top*(height/2)})
    });

    points.current = [
      ...topPointUpdated,
      ...others
    ]
  }, [top]);


  useEffect(()  => {
    const [bottomPts, others] = bottomPoints();

    const bottomPointUpdated = bottomPts.map(point => {
      return ({x: point.x, y: (height - (bottom * height/2))})
    });

    points.current = [
      ...bottomPointUpdated,
      ...others
    ]
  }, [bottom]);


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

  function hasClicked(points: Point[], mouseX: number, mouseY: number) : boolean {
    points.forEach((point, index) => {
      if(isIn(point, mouseX, mouseY)) {
        clickedIndex.current = index;
        return true;
      }
    })
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

    drawRectVisible(contextRef.current);

    points.current.map( (point, index) => {
      const { x, y } = point;
      contextRef.current.beginPath();
      contextRef.current.arc(x, y, RADIUS, 0, 2 * Math.PI, true);

      if(clickedIndex.current === index) {
        contextRef.current.fillStyle = "#FF01F1";
      } else {
        contextRef.current.fillStyle = isIn(point, mouseRef.current.x, mouseRef.current.y) ? "#0000FF" : "#00FF00";
      }
      contextRef.current.fill();
    })


    requestAnimationFrame(animate);
  }

  function computePositionSize() {
    const pointsX = points.current.map(point => point.x);
    const pointsY = points.current.map(point => point.y);

    const minX = Math.min(...pointsX);
    const maxX = Math.max(...pointsX);
    const minY = Math.min(...pointsY);
    const maxY = Math.max(...pointsY);


    return {left: minX, right: maxX, top: minY, bottom: maxY };
  }

  function leftPoints() {
    const pointsX = points.current.map(point => point.x);
    const minX = Math.min(...pointsX);

    return partition(points.current, { x: minX });
  }

  function rightPoints() {
    const pointsX = points.current.map(point => point.x);
    const maxX = Math.max(...pointsX);

    return partition(points.current, { x: maxX });
  }

  function topPoints() {
    const pointsY = points.current.map(point => point.y);
    const minY = Math.min(...pointsY);

    return partition(points.current, { y: minY });
  }

  function bottomPoints() {
    const pointsY = points.current.map(point => point.y);
    const maxY = Math.max(...pointsY);

    return partition(points.current, { y: maxY });
  }

  function sendChange() {
    const {left, right, top, bottom} = computePositionSize();

    onChange({
      left: Math.min(1, (left/(width/2)).toFixed(2) ),
      right: Math.max(0, ((right - width/2)/(width/2)).toFixed(2) ),
      top: Math.min(1, (top/(height/2)).toFixed(2) ),
      bottom: Math.max(0, ((bottom - height/2)/(height/2)).toFixed(2) )
    });
  }

  function drawRectVisible(context) {
    const {left, right, top, bottom} = computePositionSize();
    context.beginPath();
    context.fillStyle = "#FFFFFF99";

    // top
    context.rect(0, 0, width, top);
    //height
    context.rect(0, bottom, width, height);
    // left
    context.rect(0, 0, left, height);
    // right
    context.rect(right, 0, width, height);

    context.fill()
    context.closePath();
  }

  /*
  function computePositionSize() {
    const orderedPoints = points.current.slice();
    orderedPoints.sort((a, b) => {
      return (a.x - b.x) + (width * (a.y - b.y));
    });

    /*
        1 ---------- 2
        |            |
        |            |
        |            |
        3 ---------- 4

        orderedPoints are in that direction
    */
  /*
    onChange(orderedPoints);
  }*/

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
      style={{background: "#FF000055", zIndex: 100, width: widthCanvas, height: heightCanvas }}
      onMouseMove={(event) => {
        mouseRef.current.x = window.scrollX + (event.clientX - canvasRefPosition.current.x) *  width/widthCanvas;
        mouseRef.current.y = window.scrollY + (event.clientY - canvasRefPosition.current.y)  * height/heightCanvas;

        if(clickedIndex.current !== -1) {
          points.current[clickedIndex.current].x = mouseRef.current.x;
          points.current[clickedIndex.current].y = mouseRef.current.y;
        }
      }}
      onMouseDown={(event) => {
        const x = window.scrollX + (event.clientX - canvasRefPosition.current.x) *  width/widthCanvas;
        const y = window.scrollY + (event.clientY - canvasRefPosition.current.y)  * height/heightCanvas;

        hasClicked(points.current, x, y);
        clicked.current = true;
      }}
      onMouseUp={(event) => {
        const x = window.scrollX + (event.clientX - canvasRefPosition.current.x) *  width/widthCanvas;
        const y = window.scrollY + (event.clientY - canvasRefPosition.current.y)  * height/heightCanvas;

        clickedIndex.current = - 1;
        clicked.current = false;

        sendChange();

      }}
    />
  )
}

export default TiltShiftControllerCanvas;