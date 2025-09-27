import { useEffect, useState } from "react";
import ToolsSwitcher from "../clinicalData";
import HistorySwitcher from "../medicalHistory";
import HumanBody from "./humanBody";
import { useSelector } from "react-redux";

export default function Body() {
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const [slide, setSlide] = useState("");

  const getTranslate = () => {
    if (!slide) return "-33.3333%"; // default center
    if (["FMHx", "PMHx", "PSHx", "SHx", "OB Gyne Hx"].includes(slide)) {
      return "0"; // medicalHistory → right panel
    }
    if (["Laboratory", "Radiology", "Vital"].includes(slide)) {
      return "-50%"; // ancillary → left panel
    }
    return "-33.3333%"; // fallback center
  };

  useEffect(() => {
    console.log("appointment changed:", appointment?._id);
  }, [appointment]);

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
        {/* Medical History Panel */}
        <div
          className="checkup-data-body-slide-medicalHistory"
          style={{
            marginRight: "auto",
            width: slide ? "calc(100% - 600px)" : "100%",
          }}
        >
          <HistorySwitcher task={slide} />
        </div>

        {/* Human Body / Image Panel */}
        <div
          className="checkup-data-body-slide-image"
          style={{
            width: slide ? "600px" : "100%",
            transition: `width 0.5s ease ${slide ? "0.2s" : "0s"}`,
          }}
        >
          <HumanBody setSlide={setSlide} slide={slide} />
        </div>

        {/* Clinical Tools / Ancillary Panel */}
        <div
          className="checkup-data-body-slide-clinicalData"
          style={{
            marginRight: "auto",
            width: slide ? "calc(100% - 600px)" : "100%",
          }}
        >
          <ToolsSwitcher task={slide} />
        </div>
      </div>
    </div>
  );
}
