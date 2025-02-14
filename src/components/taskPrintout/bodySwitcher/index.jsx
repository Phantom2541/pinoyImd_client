import React, { useState, useEffect, useRef } from "react";
import Hematology from "./laboratory/hematology";
import Urinalysis from "./laboratory/urinalysis";
import Chemistry from "./laboratory/chemistry";
import Parasitology from "./laboratory/parasitology";
import Coagulation from "./laboratory/coagulation";
import Miscellaneous from "./laboratory/miscellaneous";
import Analysis from "./laboratory/analysis";
import Bacteriology from "./laboratory/bacteriology";
import Compatibility from "./laboratory/compatibility";
import Pbs from "./laboratory/pbs";
import Electrolyte from "./laboratory/electrolyte";

const Blank = ({ task }) => {
  return <div>{task.form} is not working</div>;
};

const componentMap = {
  hematology: Hematology,
  urinalysis: Urinalysis,
  chemistry: Chemistry,
  parasitology: Parasitology,
  coagulation: Coagulation,
  serology: Chemistry,
  miscellaneous: Miscellaneous,
  analysis: Analysis,
  bacteriology: Bacteriology,
  compatibility: Compatibility,
  pbs: Pbs,
  electrolyte: Electrolyte,
};

export default function BodySwitcher({ task }) {
  const [fontSize, setFontSize] = useState(),
    contentRef = useRef(null);

  useEffect(() => {
    // Function to adjust font size based on content height
    const adjustFontSize = () => {
      const contentHeight = contentRef.current.clientHeight;
      const maxHeight = 400; // Maximum height of the container

      if (contentHeight > maxHeight) {
        // TODO
        // adjust responsive logic
        // Reduce the font size to fit the content within the container
        var newFontSize = 0;
        if (task.form?.toLowerCase() === "chemistry") {
          newFontSize = (maxHeight / contentHeight) * 50; // 15
        } else if (task.form?.toLowerCase() === "miscellaneous") {
          newFontSize = (maxHeight / contentHeight) * 30;
        } else {
          newFontSize = (maxHeight / contentHeight) * 30;
        }

        setFontSize(newFontSize);
      }
    };

    // Call adjustFontSize when the component mounts and whenever the content changes
    adjustFontSize();

    // Attach a resize listener to adjust font size on window resize
    window.addEventListener("resize", adjustFontSize);

    // Cleanup the resize listener when the component unmounts
    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [task]);

  const Component = componentMap[task.form?.toLowerCase()] || Blank;
  return (
    <div style={{ maxHeight: "500px", minHeight: "400px", overflow: "hidden" }}>
      <div ref={contentRef}>
        <Component task={task} fontSize={fontSize} />
      </div>
    </div>
  );
}
