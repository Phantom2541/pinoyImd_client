import React from "react";
import { MDBContainer, MDBCard, MDBCollapse } from "mdbreact";
import TaskHeader from "./header";
import TaskBody from "./body";
import TaskFooter from "./footer";

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
  const hasRenderedItems = task.rendered && task.rendered.length !== 0;

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
      {hasRenderedItems && (
        <MDBCollapse id={`collapse-${_id}`} isOpen={isActive}>
          <TaskBody task={task} />
          <TaskFooter task={task} />
        </MDBCollapse>
      )}
    </MDBCard>
  );
}
