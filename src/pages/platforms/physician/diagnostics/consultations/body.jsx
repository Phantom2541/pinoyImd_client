import { useState } from "react";
import Laboratory from "./clinicalData/laboratory";
import HumanBody from "./humanBody";
import PMH from "./medicalHistory/pmh";

export default function Body() {
  const [slide, setSlide] = useState("");

  const getTranslate = () => {
    if (!slide) return "-33.3333%"; // default center
    if (["PMHx", "FMHx", "PSHx", "OB Gyne Hx"].includes(slide)) {
      return "0"; // medicalHistory → right panel
    }
    if (["Laboratory", "Radiology", "Vital"].includes(slide)) {
      return "-50%"; // ancillary → left panel
    }
    return "-33.3333%"; // fallback center
  };

  return (
    <div className="checkup-data-body">
      <div
        className="checkup-data-body-slide"
        style={{
          transform: `translateX(${getTranslate()})`,
          width: slide ? "200%" : "300%",
          transition: "transform 0.5s ease-in-out, width 0.5s ease-in-out",
        }}
      >
        <div
          className="checkup-data-body-slide-medicalHistory"
          style={{
            marginRight: "auto",
            width: slide ? "calc(100% - 600px)" : "100%",
          }}
        >
          <PMH />
        </div>

        <div
          className="checkup-data-body-slide-image"
          style={{
            width: slide ? "600px" : "100%",
            transition: `width 0.5s ease ${slide ? "0.2s" : "0s"}`,
          }}
        >
          <HumanBody setSlide={setSlide} slide={slide} />
        </div>

        <div
          className="checkup-data-body-slide-clinicalData"
          style={{
            marginRight: "auto",
            width: slide ? "calc(100% - 600px)" : "100%",
          }}
        >
          <Laboratory />
        </div>
      </div>
    </div>
  );
}
