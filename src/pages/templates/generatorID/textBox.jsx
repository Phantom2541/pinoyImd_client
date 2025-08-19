// TextBox.jsx
import React, { useState, useRef, useEffect } from "react";

export default function TextBox({
  id,
  x,
  y,
  width,
  height,
  rotation,
  content,
  onUpdate,
}) {
  const [isSelected, setIsSelected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [isResizing, setIsResizing] = useState(null);
  const boxRef = useRef();

  // unselect kapag nag-click sa labas
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setIsSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handle drag start
  const handleMouseDown = (e) => {
    if (
      e.target.classList.contains("resize-handle") ||
      e.target.classList.contains("rotate-handle")
    ) {
      return;
    }
    e.stopPropagation();
    setIsSelected(true);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY, startX: x, startY: y });
  };

  // handle resize start
  const handleResizeDown = (e, dir) => {
    e.stopPropagation();
    setIsSelected(true);
    setIsResizing({
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startW: width,
      startH: height,
      startXPos: x,
      startYPos: y,
    });
  };

  // handle rotate start
  const handleRotateDown = (e) => {
    e.stopPropagation();
    setIsSelected(true);
    const rect = boxRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
    setIsResizing({
      dir: "rotate",
      centerX: cx,
      centerY: cy,
      startAngle: angle,
      startRot: rotation,
    });
  };

  // global mouse move
  const handleMouseMove = (e) => {
    if (isDragging && dragStart) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      onUpdate({
        x: dragStart.startX + dx,
        y: dragStart.startY + dy,
      });
    }

    if (isResizing && isResizing.dir !== "rotate") {
      const dx = e.clientX - isResizing.startX;
      const dy = e.clientY - isResizing.startY;
      let newW = isResizing.startW;
      let newH = isResizing.startH;
      let newX = isResizing.startXPos;
      let newY = isResizing.startYPos;

      switch (isResizing.dir) {
        case "e":
          newW = isResizing.startW + dx;
          break;
        case "s":
          newH = isResizing.startH + dy;
          break;
        case "se":
          newW = isResizing.startW + dx;
          newH = isResizing.startH + dy;
          break;
        case "w":
          newW = isResizing.startW - dx;
          newX = isResizing.startXPos + dx;
          break;
        case "n":
          newH = isResizing.startH - dy;
          newY = isResizing.startYPos + dy;
          break;
        case "nw":
          newW = isResizing.startW - dx;
          newX = isResizing.startXPos + dx;
          newH = isResizing.startH - dy;
          newY = isResizing.startYPos + dy;
          break;
        case "ne":
          newW = isResizing.startW + dx;
          newH = isResizing.startH - dy;
          newY = isResizing.startYPos + dy;
          break;
        case "sw":
          newW = isResizing.startW - dx;
          newX = isResizing.startXPos + dx;
          newH = isResizing.startH + dy;
          break;
        default:
          break;
      }

      if (newW > 20 && newH > 20) {
        onUpdate({ x: newX, y: newY, width: newW, height: newH });
      }
    }

    if (isResizing && isResizing.dir === "rotate") {
      const angle = Math.atan2(
        e.clientY - isResizing.centerY,
        e.clientX - isResizing.centerX
      );
      const delta = angle - isResizing.startAngle;
      const deg = (isResizing.startRot + delta * 180) / Math.PI;
      onUpdate({ rotation: deg });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
    setDragStart(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart]);

  return (
    <div
      ref={boxRef}
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        border: isSelected && !isDragging ? "1px solid #4A90E2" : "none",
        background: "transparent",
        cursor: isDragging ? "grabbing" : "move",
        userSelect: "none",
      }}
    >
      <div
        contentEditable
        suppressContentEditableWarning
        style={{
          width: "100%",
          height: "100%",
          outline: "none",
          textAlign: "center",
        }}
      >
        {content}
      </div>

      {/* ipakita lang kung selected at HINDI nagda-drag */}
      {isSelected && !isDragging && (
        <>
          {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((dir) => (
            <div
              key={dir}
              className={`resize-handle ${dir}`}
              style={handleStyle(dir)}
              onMouseDown={(e) => handleResizeDown(e, dir)}
            />
          ))}
          <div
            className="rotate-handle"
            style={{
              position: "absolute",
              top: "-25px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#4A90E2",
              cursor: "grab",
            }}
            onMouseDown={handleRotateDown}
          />
        </>
      )}
    </div>
  );
}

function handleStyle(dir) {
  const base = {
    position: "absolute",
    width: "8px",
    height: "8px",
    background: "#fff",
    border: "1px solid #4A90E2",
    zIndex: 10,
  };

  switch (dir) {
    case "nw":
      return { ...base, top: "-4px", left: "-4px", cursor: "nwse-resize" };
    case "n":
      return {
        ...base,
        top: "-4px",
        left: "50%",
        transform: "translateX(-50%)",
        cursor: "ns-resize",
      };
    case "ne":
      return { ...base, top: "-4px", right: "-4px", cursor: "nesw-resize" };
    case "e":
      return {
        ...base,
        top: "50%",
        right: "-4px",
        transform: "translateY(-50%)",
        cursor: "ew-resize",
      };
    case "se":
      return { ...base, bottom: "-4px", right: "-4px", cursor: "nwse-resize" };
    case "s":
      return {
        ...base,
        bottom: "-4px",
        left: "50%",
        transform: "translateX(-50%)",
        cursor: "ns-resize",
      };
    case "sw":
      return { ...base, bottom: "-4px", left: "-4px", cursor: "nesw-resize" };
    case "w":
      return {
        ...base,
        top: "50%",
        left: "-4px",
        transform: "translateY(-50%)",
        cursor: "ew-resize",
      };
    default:
      return base;
  }
}
