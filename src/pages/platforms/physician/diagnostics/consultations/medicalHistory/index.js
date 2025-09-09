import { useRef } from "react";
import PMHx from "./pmhx";
import FMHx from "./fmhx";
import PSHx from "./pshx";
import OBGyneHx from "./obGyneHx";

const Blank = ({ task }) => <div>{task} is not working</div>;

const historyMap = {
  pmhx: PMHx,
  fmhx: FMHx,
  pshx: PSHx,
  obgynehx: OBGyneHx,
};

export default function HistorySwitcher({ task }) {
  const contentRef = useRef(null);

  // sanitize task: remove spaces & lowercase
  const sanitizedTask = task?.toLowerCase().replace(/\s+/g, "");
  const Component = historyMap[sanitizedTask] || Blank;

  return (
    <div>
      <div ref={contentRef}>
        <Component task={task} fontSize={"1rem"} />
      </div>
    </div>
  );
}
