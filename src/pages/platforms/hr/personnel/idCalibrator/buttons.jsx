import React from "react";
import { MDBBtn } from "mdbreact";

export default function DraggableButtons({
  fakeEMP,
  filteredKeys,
  placedValues,
  handleDragStart,
  handleClickValue,
}) {
  return (
    <div className="id-calibrator-details">
      {filteredKeys
        .filter((key) => !placedValues.some((p) => p.value === fakeEMP[key]))
        .map((key) => (
          <div className="id-calibrator-detail-item" key={key}>
            <MDBBtn
              color="primary"
              size="md"
              title={key.toUpperCase()}
              className="id-calibrator-detail-value"
              draggable
              onDragStart={(e) => handleDragStart(e, fakeEMP[key])}
              onClick={() => handleClickValue(fakeEMP[key])}
            >
              {fakeEMP[key]}
            </MDBBtn>
          </div>
        ))}
    </div>
  );
}
