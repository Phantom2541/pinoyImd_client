import React, { useState, useEffect } from "react";

export default function LineBox({ id, x1, y1, x2, y2, onUpdate }) {
  const [points, setPoints] = useState({
    x1: x1 ?? 50,
    y1: y1 ?? 50,
    x2: x2 ?? 200,
    y2: y2 ?? 100,
  });
  const [selected, setSelected] = useState(false);
  const [action, setAction] = useState(null);
  const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
  const [startPoints, setStartPoints] = useState(points);
  const [hovered, setHovered] = useState(false);

  const endpointSize = 9;

  // Sync prop changes (for drawing)
  useEffect(() => {
    if (
      x1 !== undefined &&
      y1 !== undefined &&
      x2 !== undefined &&
      y2 !== undefined
    ) {
      setPoints({ x1, y1, x2, y2 });
    }
  }, [x1, y1, x2, y2]);

  const handleMouseDown = (e, act) => {
    e.stopPropagation();
    setSelected(true);
    setAction(act);
    setStartMouse({ x: e.clientX, y: e.clientY });
    setStartPoints(points);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!action) return;
      const dx = e.clientX - startMouse.x;
      const dy = e.clientY - startMouse.y;

      let newPoints = { ...points };

      if (action === "drag") {
        newPoints = {
          x1: startPoints.x1 + dx,
          y1: startPoints.y1 + dy,
          x2: startPoints.x2 + dx,
          y2: startPoints.y2 + dy,
        };
      } else if (action === "end1") {
        newPoints = {
          ...points,
          x1: startPoints.x1 + dx,
          y1: startPoints.y1 + dy,
        };
      } else if (action === "end2") {
        newPoints = {
          ...points,
          x2: startPoints.x2 + dx,
          y2: startPoints.y2 + dy,
        };
      }

      setPoints(newPoints);
      onUpdate && onUpdate(newPoints);
    };

    const handleMouseUp = () => setAction(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [action, startMouse, startPoints, points, onUpdate]);

  const lineLength = Math.hypot(points.x2 - points.x1, points.y2 - points.y1);
  const angle =
    Math.atan2(points.y2 - points.y1, points.x2 - points.x1) * (180 / Math.PI);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <div
        onMouseDown={(e) => handleMouseDown(e, "drag")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "absolute",
          top: points.y1,
          left: points.x1,
          width: lineLength,
          height: 1,
          backgroundColor: hovered ? "#4A90E2" : "black",
          transformOrigin: "0 0",
          transform: `rotate(${angle}deg)`,
          cursor: "move",
          transition: "background-color 0.2s",
        }}
      />
      {selected && (
        <>
          <div
            onMouseDown={(e) => handleMouseDown(e, "end1")}
            style={{
              position: "absolute",
              width: endpointSize,
              height: endpointSize,
              backgroundColor: hovered ? "#E6F0FF" : "white",
              border: `1px solid #4A90E2`,
              top: points.y1 - endpointSize / 2,
              left: points.x1 - endpointSize / 2,
              cursor: "grab",
            }}
          />
          <div
            onMouseDown={(e) => handleMouseDown(e, "end2")}
            style={{
              position: "absolute",
              width: endpointSize,
              height: endpointSize,
              backgroundColor: hovered ? "#E6F0FF" : "white",
              border: `1px solid #4A90E2`,
              top: points.y2 - endpointSize / 2,
              left: points.x2 - endpointSize / 2,
              cursor: "grab",
            }}
          />
        </>
      )}
    </div>
  );
}
