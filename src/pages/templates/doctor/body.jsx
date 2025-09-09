import { useState } from "react";
import Laboratory from "./clinicalData/laboratory";
import HumanBody from "./humanBody";
import PMH from "./medicalHistory/pmh";

export default function Body() {
  const [slide, setSlide] = useState("");
  console.log(slide);

  return (
    <div className="checkup-data-body">
      <div
        className="checkup-data-body-slide"
        style={{ transform: `translateX(-49.666%)` }}
      >
        <div className="checkup-data-body-slide-medicalHistory">
          <PMH />
        </div>
        <div
          className="checkup-data-body-slide-image"
          style={{ width: "600px" }}
        >
          <HumanBody setSlide={setSlide} slide={slide} />
        </div>
        <div className="checkup-data-body-slide-clinicalData">
          <Laboratory />
        </div>
      </div>
    </div>
  );
}
