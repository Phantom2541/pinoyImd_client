import {  MDBTypography } from "mdbreact";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Collapse from "./collapselol";
import TableLoading from "../../../../../components/tableLoading";

export default function Body({ patient }) {
  const [activeCollapse, setActiveCollapse] = useState(""),
    [didHoverID, setDidHoverID] = useState(-1),
    { collections, isLoading } = useSelector(({ deals }) => deals);

  if (!patient?._id)
    return (
      <MDBTypography note noteColor="info" className="">
        Look for a patient first.
      </MDBTypography>
    );

  if (isLoading) return <TableLoading />;

  if (!collections.length)
    return (
      <MDBTypography note noteColor="warning" className="">
        This patient has no records.
      </MDBTypography>
    );

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
