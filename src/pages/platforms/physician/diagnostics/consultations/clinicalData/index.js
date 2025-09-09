import { useRef } from "react";
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
  const vitalSigns = {
    temperature: "36.6°C",
    pulse: "80 bpm",
    bloodPressure: "120/80 mmHg",
    respiration: "18 breaths/min",
    weight: 70, // kg
    height: 1.75, // meters
  };

  const Component = toolsMap[task?.toLowerCase()] || Blank;
  return (
    <div>
      <div ref={contentRef}>
        <Component task={task} vitalSigns={vitalSigns} fontSize={"1rem"} />
      </div>
    </div>
  );
}
