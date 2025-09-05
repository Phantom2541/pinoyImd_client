import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Collapse from "./collapse";

export default function Body() {
  const { collections } = useSelector(({ validator }) => validator),
    [activeCollapse, setActiveCollapse] = useState(""),
    [patients, setPatients] = useState([]),
    [didHoverID, setDidHoverID] = useState(-1);

  useEffect(() => {
    setPatients([...collections]);
  }, [collections]);

  return (
    <>
      {patients.map((task, index) => (
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
