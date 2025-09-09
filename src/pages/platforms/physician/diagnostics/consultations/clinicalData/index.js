import React, { useRef } from "react";
import Laboratory from "./laboratory";
import Radiology from "./radiology";
import Vital from "./vital";

const Blank = ({ task }) => <div>{task} is not working</div>;

const toolsMap = {
  laboratory: Laboratory,
  radiology: Radiology,
  vital: Vital,
};

export default function ToolsSwitcher({ task }) {
  const contentRef = useRef(null);

  console.log("ToolsSwitcher task: ", task);

  const Component = toolsMap[task?.toLowerCase()] || Blank;
  return (
    <div>
      <div ref={contentRef}>
        <Component task={task} fontSize={"1rem"} />
      </div>
    </div>
  );
}
