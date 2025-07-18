import { useState } from "react";
import { useSelector } from "react-redux";
import Collapse from "./collapse";

export default function Body() {
  const { collections } = useSelector(({ deals }) => deals),
    [activeCollapse, setActiveCollapse] = useState(""),
    [didHoverID, setDidHoverID] = useState(-1);
  return (
    <>
      {collections.map((task, index) => (
        <Collapse
          key={task?._id}
          task={task}
          didHoverID={didHoverID}
          setDidHoverID={setDidHoverID}
          number={index + 1}
          setActiveCollapse={setActiveCollapse}
          activeCollapse={activeCollapse}
          isActive={activeCollapse === task?._id}
        />
      ))}
    </>
  );
}
