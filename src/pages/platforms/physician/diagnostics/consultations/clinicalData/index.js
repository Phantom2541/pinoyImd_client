import { useEffect, useState } from "react";
import Laboratory from "./laboratory";
import Radiology from "./radiology";
import Vital from "./vital";

const Blank = ({ task }) => <div>{task} is not working</div>;

const toolsMap = {
  laboratory: Laboratory,
  radiology: Radiology,
  vital: Vital,
};

const order = ["laboratory", "radiology", "vital"];

export default function ToolsSwitcher({ task, ...props }) {
  const [current, setCurrent] = useState(task);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("left");

  const vitalSigns = {
    temperature: "36.6°C",
    pulse: "80 bpm",
    bloodPressure: "120/80 mmHg",
    respiration: "18 breaths/min",
    weight: 70,
    height: 1.75,
  };

  useEffect(() => {
    if (!task || task === current) return;

    const curIndex = order.indexOf(current?.toLowerCase());
    const nextIndex = order.indexOf(task?.toLowerCase());
    setDirection(nextIndex > curIndex ? "left" : "right");

    setAnimating(true);
    const t = setTimeout(() => {
      setCurrent(task);
      setAnimating(false);
    }, 300);

    return () => clearTimeout(t);
  }, [task]);

  const Component = toolsMap[current?.toLowerCase()] || Blank;

  return (
    <div className="tools-switcher-container">
      <div
        key={current}
        className={`tools-switcher-panel ${
          animating ? `exit-${direction}` : `enter-${direction}`
        }`}
      >
        <Component task={current} vitalSigns={vitalSigns} />
      </div>
    </div>
  );
}
