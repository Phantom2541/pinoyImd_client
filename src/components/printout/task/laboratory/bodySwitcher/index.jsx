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
  "pheripheral blood smear": Pbs,
  seminogram: Seminogram,
};

export default function BodySwitcher({ task }) {
  const contentRef = useRef(null);
  const Component = componentMap[task?.form?.toLowerCase()] || Blank;
  return (
    <div>
      <div ref={contentRef}>
        <Component task={task} fontSize={"1rem"} />
      </div>
    </div>
  );
}
