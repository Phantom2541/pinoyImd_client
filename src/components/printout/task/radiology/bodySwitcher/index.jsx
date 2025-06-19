import React, { useState, useEffect, useRef } from "react";
import Xray from "./xray";
import Ecg from "./ecg";
import Ultrasound from "./ultrasound";

const Blank = ({ task }) => <div>{task?.form} is not working</div>;

const componentMap = {
  xray: Xray,
  ecg: Ecg,
  ultrasound: Ultrasound,
};

export default function BodySwitcher({ task }) {
  const [fontSize, setFontSize] = useState(),
    contentRef = useRef(null);
  // Function to adjust font size based on content height
  const adjustFontSize = ({ form }) => {
    const contentHeight = contentRef.current.clientHeight;
    const maxHeight = 400; // Maximum height of the container

    if (contentHeight > maxHeight) {
      // TODO
      // adjust responsive logic
      // Reduce the font size to fit the content within the container
      var newFontSize = 0;
      if (form?.toLowerCase() === "chemistry") {
        newFontSize = (maxHeight / contentHeight) * 50; // 15
      } else if (form?.toLowerCase() === "miscellaneous") {
        newFontSize = (maxHeight / contentHeight) * 30;
      } else {
        newFontSize = (maxHeight / contentHeight) * 30;
      }
      setFontSize(newFontSize);
    }
  };

  useEffect(() => {
    // Call adjustFontSize when the component mounts and whenever the content changes
    adjustFontSize(task.form);

    // Attach a resize listener to adjust font size on window resize
    window.addEventListener("resize", adjustFontSize);

    // Cleanup the resize listener when the component unmounts
    return () => {
      window.removeEventListener("resize", adjustFontSize);
    };
  }, [task]);

  const Component = componentMap[task?.form?.toLowerCase()] || Blank;
  return (
    <div>
      <div ref={contentRef}>
        <Component task={task} fontSize={fontSize} />
      </div>
    </div>
  );
}
