import React from "react";
import { MDBIcon } from "mdbreact";

export default function Description({ card, onBack }) {
  console.log(card.extraImages);
  return (
    <div className="description-container">
      <button onClick={onBack} className="description-back">
        <MDBIcon fas icon="angle-left" />
        &nbsp; Back
      </button>

      <div className="description-image-wrapper">
        <img src={card.image} className="description-image" alt={card.title} />

        <div className="description-images">
          {card.extraImages.map((img, index) => (
            <img key={index} src={img} alt={`${card.title} ${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
