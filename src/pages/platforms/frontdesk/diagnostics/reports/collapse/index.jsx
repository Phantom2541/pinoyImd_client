import React from "react";
import { MDBContainer, MDBCard, MDBCollapse } from "mdbreact";
import TaskHeader from "./header";
import TaskBody from "./body";
import TaskFooter from "./footer";

export default function TasksCollapse({ task, number, setActiveCollapse, isActive }) {
  const { _id } = task;
  const hasRenderedItems = task.rendered && task.rendered.length !== 0;

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      <MDBCard>
        <TaskHeader task={task} number={number} setActiveCollapse={setActiveCollapse} isActive={isActive} />
        {hasRenderedItems && (
          <MDBCollapse id={`collapse-${_id}`} isOpen={isActive}>
            <TaskBody task={task} />
            <TaskFooter task={task} />
          </MDBCollapse>
        )}
      </MDBCard>
    </MDBContainer>
  );
}
