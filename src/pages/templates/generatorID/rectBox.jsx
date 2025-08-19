import React, { useState, useEffect } from "react";

export default function RectBox({ id, x, y, width, height, onUpdate }) {
  const [rect, setRect] = useState({ x, y, width, height });
  const [selected, setSelected] = useState(false);
  const [action, setAction] = useState(null);
  const [startMouse, setStartMouse] = useState({ x: 0, y: 0 });
  const [startRect, setStartRect] = useState(rect);

  useEffect(() => {
    setRect({ x, y, width, height });
  }, [x, y, width, height]);

  const handleMouseDown = (e, act) => {
    e.stopPropagation();
    setSelected(true);
    setAction(act);
    setStartMouse({ x: e.clientX, y: e.clientY });
    setStartRect(rect);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!action) return;
      const dx = e.clientX - startMouse.x;
      const dy = e.clientY - startMouse.y;

      let newRect = { ...rect };

      if (action === "drag") {
        newRect = {
          ...rect,
          x: startRect.x + dx,
          y: startRect.y + dy,
        };
      } else {
        newRect = { ...startRect };
        if (action.includes("right"))
          newRect.width = Math.max(1, startRect.width + dx);
        if (action.includes("bottom"))
          newRect.height = Math.max(1, startRect.height + dy);
        if (action.includes("left")) {
          newRect.x = startRect.x + dx;
          newRect.width = Math.max(1, startRect.width - dx);
        }
        if (action.includes("top")) {
          newRect.y = startRect.y + dy;
          newRect.height = Math.max(1, startRect.height - dy);
        }
      }

      setRect(newRect);
      onUpdate && onUpdate(newRect);
    };

    const handleMouseUp = () => setAction(null);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [action, startMouse, startRect, rect, onUpdate]);

  const endpointSize = 8;

  // Handles centered exactly on the rectangle corners
  const cornerHandles = [
    {
      pos: "top-left",
      cursor: "nwse-resize",
      action: "top-left",
      top: "0%",
      left: "0%",
    },
    {
      pos: "top-right",
      cursor: "nesw-resize",
      action: "top-right",
      top: "0%",
      left: "100%",
    },
    {
      pos: "bottom-left",
      cursor: "nesw-resize",
      action: "bottom-left",
      top: "100%",
      left: "0%",
    },
    {
      pos: "bottom-right",
      cursor: "nwse-resize",
      action: "bottom-right",
      top: "100%",
      left: "100%",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: rect.y,
        left: rect.x,
        width: rect.width,
        height: rect.height,
        backgroundColor: selected ? "rgba(74,144,226,0.1)" : "rgba(0,0,0,0.05)",
        border: selected ? "2px solid #4A90E2" : "1px solid #999",
        cursor: "move",
        boxSizing: "border-box", // important
      }}
      onMouseDown={(e) => handleMouseDown(e, "drag")}
    >
      {selected &&
        cornerHandles.map((h) => (
          <div
            key={h.pos}
            onMouseDown={(e) => handleMouseDown(e, h.action)}
            style={{
              position: "absolute",
              width: endpointSize,
              height: endpointSize,
              backgroundColor: "#fff",
              border: "1px solid #4A90E2",
              cursor: h.cursor,
              boxSizing: "border-box",
              top: h.top,
              left: h.left,
              transform: "translate(-50%, -50%)", // centers the handle exactly
            }}
          />
        ))}
    </div>
  );
}
