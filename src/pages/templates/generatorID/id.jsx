import React, { useState, useEffect, useRef } from "react";

export default function ID({
  frontImage,
  backImage,
  positions,
  student,
  selectedField,
  setSelectedField,
  fieldStyles,
  setPositions,
  frontRef,
  backRef,
}) {
  const [draggingField, setDraggingField] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle arrow keys for moving selected field
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedField) return;

      let delta = 1;
      let newPos = { ...positions[selectedField] };

      switch (e.key) {
        case "ArrowUp":
          newPos.y -= delta;
          break;
        case "ArrowDown":
          newPos.y += delta;
          break;
        case "ArrowLeft":
          newPos.x -= delta;
          break;
        case "ArrowRight":
          newPos.x += delta;
          break;
        default:
          return;
      }

      e.preventDefault();
      setPositions({
        ...positions,
        [selectedField]: newPos,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedField, positions, setPositions]);

  const handleMouseDown = (field, e) => {
    setDraggingField(field);
    const pos = positions[field];
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!draggingField) return;

    const newPos = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    };

    setPositions({
      ...positions,
      [draggingField]: { ...positions[draggingField], ...newPos },
    });
  };

  const handleMouseUp = () => {
    setDraggingField(null);
  };

  // Helper to render fields for a specific side
  const renderFields = (side) =>
    Object.keys(positions)
      .filter((field) => (positions[field].side || "front") === side)
      .map((field) => {
        const pos = positions[field];
        const style = fieldStyles[field] || {};

        // Determine value
        if (field === "profileImage") {
          const imgSrc = student.profileImage;
          return (
            <img
              key={field}
              src={imgSrc}
              alt="Profile"
              style={{
                position: "absolute",
                top: pos.y,
                left: pos.x,
                width: style.width || "50px",
                height: style.height || "50px",
                transform: "translate(-50%, -50%)",
                borderRadius: style.borderRadius || "50%",
                objectFit: "cover",
                cursor: "grab",
                zIndex: 10,
              }}
              onClick={() => setSelectedField(field)}
              onMouseDown={(e) => handleMouseDown(field, e)}
              draggable={false}
            />
          );
        }

        // Existing text fields
        const value =
          field === "fullName"
            ? `${student.fullName?.fname || ""} ${
                student.fullName?.mname || ""
              } ${student.fullName?.lname || ""} ${
                student.fullName?.suffix || ""
              }`
                .replace(/\s+/g, " ")
                .trim()
            : field === "postnominal"
            ? student.fullName?.postnominal || ""
            : student[field] || "";

        return (
          <div
            key={field}
            data-field={field}
            onClick={() => setSelectedField(field)}
            onMouseDown={(e) => handleMouseDown(field, e)}
            style={{
              position: "absolute",
              top: pos.y,
              left: pos.x,
              cursor: "grab",
              color: style.color || "#000",
              fontSize: style.fontSize || "12px",
              fontWeight: style.fontWeight || "normal",
              fontStyle: style.fontStyle || "normal",
              fontFamily: style.fontFamily || "Inter",
              letterSpacing: style.letterSpacing || "0px",
              opacity: style.opacity !== undefined ? style.opacity : 1,
              padding: "2px 5px",
              userSelect: "none",
            }}
          >
            {value}
          </div>
        );
      });

  return (
    <div
      className="IDGenerator-ID-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Front Side */}
      <div
        className="IDGenerator-ID-front"
        style={{ position: "relative" }}
        ref={frontRef}
      >
        {frontImage && (
          <img src={frontImage} alt="Front ID" draggable={false} />
        )}
        {renderFields("front")}
      </div>

      {/* Back Side */}
      <div
        className="IDGenerator-ID-back"
        style={{ position: "relative" }}
        ref={backRef}
      >
        {backImage && <img src={backImage} alt="Back ID" draggable={false} />}
        {renderFields("back")}
      </div>
    </div>
  );
}
