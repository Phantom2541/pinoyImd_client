import React, { useRef, useState, useEffect } from "react";
import "./style.css";

export default function ImgMagnifier({ src }) {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [dragStart, setDragStart] = useState(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Mouse wheel zoom
  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (e) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const percentX = `${(offsetX / rect.width) * 100}%`;
      const percentY = `${(offsetY / rect.height) * 100}%`;

      setZoom((prevZoom) => {
        let nextZoom = e.deltaY < 0 ? prevZoom + 0.2 : prevZoom - 0.2;
        nextZoom = Math.min(Math.max(nextZoom, 1), 5);

        // ✅ Reset position when fully zoomed out
        if (nextZoom <= 1.01) {
          setTranslate({ x: 0, y: 0 });
          nextZoom = 1;
        }

        return nextZoom;
      });
    };

    container.addEventListener("wheel", handleWheel);
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // ✅ Clamp translate on zoom change (prevent overshoot)
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    if (zoom <= 1) {
      setTranslate({ x: 0, y: 0 }); // Clean reset
      return;
    }

    const imgWidth = rect.width * zoom;
    const imgHeight = rect.height * zoom;

    const maxOffsetX = (imgWidth - rect.width) / 2;
    const maxOffsetY = (imgHeight - rect.height) / 2;

    setTranslate((prev) => {
      let x = Math.max(-maxOffsetX, Math.min(prev.x, maxOffsetX));
      let y = Math.max(-maxOffsetY, Math.min(prev.y, maxOffsetY));

      // ✨ Proportional correction (pulling back to center as we zoom out)
      const factor = (zoom - 1) / 4; // Adjust denominator for smoother pull
      x = x * factor;
      y = y * factor;

      return { x, y };
    });
  }, [zoom]);

  // ✅ Mouse drag start
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  // ✅ Mouse drag move (with clamping)
  const handleMouseMove = (e) => {
    if (!dragStart || zoom <= 1) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const imgWidth = rect.width * zoom;
    const imgHeight = rect.height * zoom;

    const maxOffsetX = (imgWidth - rect.width) / 2;
    const maxOffsetY = (imgHeight - rect.height) / 2;

    setTranslate((prev) => {
      let nextX = prev.x + dx;
      let nextY = prev.y + dy;

      nextX = Math.max(-maxOffsetX, Math.min(nextX, maxOffsetX));
      nextY = Math.max(-maxOffsetY, Math.min(nextY, maxOffsetY));

      return { x: nextX, y: nextY };
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragStart(null);
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const getCursor = () => {
    if (zoom <= 1) return "zoom-in";
    return isDragging ? "grabbing" : "zoom-out";
  };

  return (
    <div
      className="zoom-img-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{ cursor: getCursor() }}
    >
      <img
        src={src}
        alt="Zoomable"
        style={{
          transform: `scale(${zoom}) translate(${translate.x / zoom}px, ${
            translate.y / zoom
          }px)`,
          transformOrigin: `center center`,
          transition: isDragging ? "none" : "transform 0.2s ease-out",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
