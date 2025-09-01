import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowAllValues } from "../../../../../services/redux/slices/idCard/calibrator";
import { MDBIcon } from "mdbreact";

export default function DraggableButtons({
  fakeEMP,
  filteredKeys,
  placedValues,
  handleDragStart,
  handleClickValue,

  setPlacedValues,
}) {
  const { frontImage, backImage, selectedSide, showAllValues, editMode } =
      useSelector(({ idCalibrator }) => idCalibrator),
    dispatch = useDispatch();
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
        onClick={() => dispatch(setShowAllValues(!showAllValues))}
      >
        <MDBIcon far icon={showAllValues ? "eye-slash" : "eye"} />
      </span>
    </div>
  );
}
