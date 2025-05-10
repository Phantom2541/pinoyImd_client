import React from "react";
import { MDBCard, MDBCollapse } from "mdbreact";
import TaskHeader from "./header";
import TaskBody from "./body";

export default function TasksCollapse({
  task,
  number,
  setActiveCollapse,
  activeCollapse,
  isActive,
  didHoverID,
  setDidHoverID,
}) {
  const { _id } = task;
  return (
    <MDBCard style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}>
      <TaskHeader
        task={task}
        number={number}
        activeCollapse={activeCollapse}
        didHoverID={didHoverID}
        setDidHoverID={setDidHoverID}
        setActiveCollapse={setActiveCollapse}
        isActive={isActive}
      />
      <MDBCollapse id={`collapse-${_id}`} isOpen={isActive}>
        <TaskBody task={task} />
      </MDBCollapse>
    </MDBCard>
  );
}
