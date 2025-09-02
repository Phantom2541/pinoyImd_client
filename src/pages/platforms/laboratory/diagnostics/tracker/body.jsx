import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MDBTypography } from "mdbreact";
import Collapse from "./collapse";

export default function Body() {
  const { collections, patient } = useSelector(({ validator }) => validator),
    [activeCollapse, setActiveCollapse] = useState(""),
    [patients, setPatients] = useState([]),
    [didHoverID, setDidHoverID] = useState(-1);

  useEffect(() => {
    setPatients([...collections]);
  }, [collections]);

  if (!patient?._id)
    return (
      <MDBTypography note noteColor="info" className="">
        Look for a patient first.
      </MDBTypography>
    );

  if (!collections.length)
    return (
      <MDBTypography note noteColor="warning" className="">
        This patient has no records.
      </MDBTypography>
    );

  return (
    <>
      {patients.map((task, index) => (
        <Collapse
          key={task?._id}
          task={task}
          didHoverID={didHoverID}
          setDidHoverID={setDidHoverID}
          number={index + 1}
          index={index}
          setActiveCollapse={setActiveCollapse}
          activeCollapse={activeCollapse}
          isActive={activeCollapse === task?._id}
        />
      ))}
    </>
  );
}
