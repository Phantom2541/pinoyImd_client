import { MDBIcon } from "mdbreact";
import React from "react";

export default function DraggableButtons({
  fakeEMP,
  filteredKeys,
  placedValues,
  handleDragStart,
  handleClickValue,
  frontImage,
  backImage,
  showAllValues,
  setShowAllValues,
  setPlacedValues,
  selectedSide,
  editMode,
}) {
  return (
    <div className={`id-calibrator-details ${editMode ? "show" : "hide"}`}>
      <span className="id-calibrator-details-title">{selectedSide} :</span>
      {filteredKeys
        .filter((key) =>
          showAllValues
            ? true
            : !placedValues.some((p) => p.value === fakeEMP[key])
        )
        .map((key) => {
          const value = fakeEMP[key];
          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(value);
          const isPlaced = placedValues.some((p) => p.value === value);

          return (
            <div
              key={key}
              className={`id-calibrator-detail-value ${isImage ? "img" : ""} ${
                frontImage && backImage ? "" : "disabled"
              } ${isPlaced && showAllValues ? "crossed" : ""}`}
              title={key.toUpperCase()}
              draggable
              onDragStart={(e) => handleDragStart(e, value)}
              onClick={() => {
                if (isPlaced && showAllValues) {
                  // 🔹 Kapag naka-crossed tapos na-click → tanggalin sa placedValues
                  setPlacedValues((prev) =>
                    prev.filter((p) => p.value !== value)
                  );
                } else {
                  handleClickValue(value);
                }
              }}
            >
              {isImage ? <img src={value} alt={key} /> : <span>{value}</span>}
            </div>
          );
        })}

      <span
        className="id-calibrator-value-eye"
        onClick={() => setShowAllValues((prev) => !prev)}
      >
        <MDBIcon far icon={showAllValues ? "eye-slash" : "eye"} />
      </span>
    </div>
  );
}
