import { useEffect, useState, useRef, useMemo } from "react";
import ToolsSwitcher from "../clinicalData";
import HistorySwitcher from "../medicalHistory";
import HumanBody from "./humanBody";
import { useSelector } from "react-redux";

export default function Body() {
  const { patient: appointment } = useSelector(({ appointments }) => appointments);

  const [slide, setSlide] = useState("");
  const scrollTimeout = useRef(null);
  const bodyRef = useRef(null);
  const humanRef = useRef(null); // 👈 Reference to HumanBody container

  // 🧬 Gender-based sections
  const gender = appointment?.patient?.gender?.toLowerCase?.() || "male";

  const sections = useMemo(() => {
    const base = ["FMHx", "PMHx", "PSHx", "SHx"];
    const withOB = [...base, "OB Gyne Hx", "Laboratory", "Radiology", "Vital", "Medications"];
    const withoutOB = [...base, "Laboratory", "Radiology", "Vital", "Medications"];
    return gender === "female" ? withOB : withoutOB;
  }, [gender]);

  const getTranslate = () => {
    if (!slide) return "-33.3333%"; // default center
    if (["FMHx", "PMHx", "PSHx", "SHx", "OB Gyne Hx"].includes(slide)) {
      return "0"; // medicalHistory → right panel
    }
    if (["Laboratory", "Radiology", "Vital", "Medications"].includes(slide)) {
      return "-50%"; // ancillary → left panel
    }
    return "-33.3333%"; // fallback center
  };

  // 🖱️ Scroll logic only active when inside HumanBody
  useEffect(() => {
    const handleScroll = (e) => {
      if (!humanRef.current || !bodyRef.current) return;

      // check if mouse is over HumanBody area
      const rect = humanRef.current.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!inside) return; // ❌ only scroll-switch when inside HumanBody

      e.preventDefault();

      if (scrollTimeout.current) return;
      scrollTimeout.current = setTimeout(() => {
        scrollTimeout.current = null;
      }, 500);

      const delta = e.deltaY;
      const currentIndex = sections.indexOf(slide);
      let nextIndex = currentIndex;

      if (delta > 0) {
        nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
      } else if (delta < 0) {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
      }

      setSlide(sections[nextIndex]);
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, [slide, sections]);

  return (
    <div className="checkup-data-body" ref={bodyRef}>
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
            overflowY: "auto",
          }}
        >
          <HistorySwitcher task={slide} />
        </div>

        {/* Human Body / Image Panel */}
        <div
          className="checkup-data-body-slide-image"
          ref={humanRef} // 👈 Attach ref here
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
            overflowY: "auto",
          }}
        >
          <ToolsSwitcher task={slide} />
        </div>
      </div>
    </div>
  );
}
