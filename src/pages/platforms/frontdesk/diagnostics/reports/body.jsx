import { MDBContainer, MDBSpinner, MDBTypography } from "mdbreact";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import Collapse from "./collapse";

export default function Body({ patient }) {
  const [activeCollapse, setActiveCollapse] = useState(""),
    { collections, isLoading } = useSelector(({ sales }) => sales);

  if (!patient?._id)
    return (
      <MDBTypography note noteColor="info" className="mt-3">
        Look for a patient first.
      </MDBTypography>
    );

  if (isLoading)
    return (
      <div className="text-center mt-5">
        <MDBSpinner />
      </div>
    );

  if (!collections.length)
    return (
      <MDBTypography note noteColor="warning" className="mt-3">
        This patient has no records.
      </MDBTypography>
    );

  return (
    <MDBContainer className="mt-4 md-accordion px-0" fluid>
      {collections.map((task, index) => (
        <Collapse
          key={task?._id}
          task={task}
          number={index + 1}
          setActiveCollapse={setActiveCollapse}
          isActive={activeCollapse === task?._id}
        />
      ))}
    </MDBContainer>
  );
}
