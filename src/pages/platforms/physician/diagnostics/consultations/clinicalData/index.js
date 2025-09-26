import { useEffect, useState } from "react";
import Diagnostics from "./diagnostics";
import Vital from "./vital";
import { useSelector } from "react-redux";

const Blank = ({ task }) => <div>{task} is not working</div>;

const toolsMap = {
  laboratory: Diagnostics,
  radiology: Diagnostics,
  vital: Vital,
};

const order = ["laboratory", "radiology", "vital"];

export default function ToolsSwitcher({ task }) {
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const [current, setCurrent] = useState(task);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("left");
  const { consultation = {} } = appointment || {};

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
        <Component task={current} vitalSigns={consultation?.vitals || {}} />
      </div>
    </div>
  );
}
