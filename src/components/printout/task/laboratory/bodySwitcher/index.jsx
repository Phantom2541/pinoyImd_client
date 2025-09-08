import React, { useRef } from "react";
import Hematology from "./hematology";
import Urinalysis from "./urinalysis";
import Chemistry from "./chemistry";
import Parasitology from "./parasitology";
import Coagulation from "./coagulation";
import Miscellaneous from "./miscellaneous";
import Analysis from "./analysis";
import Bacteriology from "./bacteriology";
import Compatibility from "./compatibility";
import Pbs from "./pbs";
import Seminogram from "./seminogram";

const Blank = ({ task }) => <div>{task?.form} is not working</div>;

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
  seminogram: Seminogram,
};

export default function BodySwitcher({ task }) {
  const contentRef = useRef(null);
  // const [fontSize, setFontSize] = useState();
  // Function to adjust font size based on content height
  // const adjustFontSize = ({ form }) => {
  //   const contentHeight = contentRef.current.clientHeight;
  //   const maxHeight = 400; // Maximum height of the container

  //   if (contentHeight > maxHeight) {
  //     // TODO
  //     // adjust responsive logic
  //     // Reduce the font size to fit the content within the container
  //     var newFontSize = 0;
  //     if (form?.toLowerCase() === "chemistry") {
  //       newFontSize = (maxHeight / contentHeight) * 50; // 15
  //     } else if (form?.toLowerCase() === "miscellaneous") {
  //       newFontSize = (maxHeight / contentHeight) * 30;
  //     } else {
  //       newFontSize = (maxHeight / contentHeight) * 30;
  //     }
  //     setFontSize(newFontSize);
  //   }
  // };

  // useEffect(() => {
  // Call adjustFontSize when the component mounts and whenever the content changes
  // adjustFontSize(task.form);
  // Attach a resize listener to adjust font size on window resize
  // window.addEventListener("resize", adjustFontSize);
  // Cleanup the resize listener when the component unmounts
  // return () => {
  //   window.removeEventListener("resize", adjustFontSize);
  // };
  // }, [task]);

  const Component = componentMap[task?.form?.toLowerCase()] || Blank;
  return (
    <div>
      <div ref={contentRef}>
        <Component task={task} fontSize={"1rem"} />
      </div>
    </div>
  );
}
