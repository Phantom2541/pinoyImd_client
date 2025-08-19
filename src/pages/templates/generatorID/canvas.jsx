import React, { useState } from "react";
import TextBox from "./textBox";
import LineBox from "./lineBox";
import RectBox from "./rectBox";

export default function Canvas({ selectedSize, mode, setMode }) {
  const [flipped, setFlipped] = useState(false);
  const [frontElements, setFrontElements] = useState([]);
  const [backElements, setBackElements] = useState([]);
  const [drawingElement, setDrawingElement] = useState(null);

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "line") {
      setDrawingElement({
        id: Date.now(),
        type: "line",
        x1: x,
        y1: y,
        x2: x,
        y2: y,
      });
    } else if (mode === "rect") {
      setDrawingElement({
        id: Date.now(),
        type: "rect",
        x,
        y,
        width: 0,
        height: 0,
      });
    } else if (mode === "text") {
      const newText = {
        id: Date.now(),
        type: "text",
        x,
        y,
        width: 100,
        height: 30,
        rotation: 0,
        content: "New Text", // gamit ang 'content', hindi 'text'
      };

      if (!flipped) setFrontElements([...frontElements, newText]);
      else setBackElements([...backElements, newText]);

      // Reset mode kung gusto mong single click insertion
      setMode(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!drawingElement) return;

    const rectBounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rectBounds.left;
    const y = e.clientY - rectBounds.top;

    if (drawingElement.type === "line") {
      setDrawingElement({ ...drawingElement, x2: x, y2: y });
    } else if (drawingElement.type === "rect") {
      setDrawingElement({
        ...drawingElement,
        width: x - drawingElement.x,
        height: y - drawingElement.y,
      });
    }
  };

  const handleMouseUp = () => {
    if (!drawingElement) return;

    if (!flipped) setFrontElements([...frontElements, drawingElement]);
    else setBackElements([...backElements, drawingElement]);

    setDrawingElement(null);
    setMode(null);
  };

  const updateElement = (id, updates, side) => {
    const setElements = side === "front" ? setFrontElements : setBackElements;
    setElements((els) =>
      els.map((el) => (el.id === id ? { ...el, ...updates } : el))
    );
  };

  const renderElement = (el, side) => {
    if (el.type === "text") {
      return (
        <TextBox
          key={el.id}
          {...el} // x, y, width, height, rotation, content
          onUpdate={(updates) => updateElement(el.id, updates, side)}
        />
      );
    } else if (el.type === "line") {
      return (
        <LineBox
          key={el.id}
          {...el}
          onUpdate={(updates) => updateElement(el.id, updates, side)}
        />
      );
    } else if (el.type === "rect") {
      return (
        <RectBox
          key={el.id}
          {...el}
          onUpdate={(updates) => updateElement(el.id, updates, side)}
        />
      );
    }
  };

  return (
    <div className="generatorID-canvas">
      <button onClick={() => setFlipped(!flipped)}>
        Flip to {flipped ? "Front" : "Back"}
      </button>

      <div
        className="flipcard-container"
        style={{
          width: selectedSize ? `${selectedSize.width}mm` : "300px",
          height: selectedSize ? `${selectedSize.height}mm` : "200px",
          position: "relative",
          overflow: "hidden",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className={`flipcard ${flipped ? "flipped" : ""}`}>
          {/* FRONT */}
          <div className="flipcard-front">
            FRONT
            {frontElements.map((el) => renderElement(el, "front"))}
            {drawingElement &&
              !flipped &&
              renderElement(drawingElement, "front")}
          </div>

          {/* BACK */}
          <div className="flipcard-back">
            BACK
            {backElements.map((el) => renderElement(el, "back"))}
            {drawingElement && flipped && renderElement(drawingElement, "back")}
          </div>
        </div>
      </div>
    </div>
  );
}
