import React from "react";
import {
  MDBContainer,
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBIcon,
} from "mdbreact";
import { dateFormat, sourceColor } from "../../../../../../services/utilities";
import Table from "./table";
import { useHistory, useLocation } from "react-router";

export default function TasksCollapse({
  task,
  number,
  setActiveCollapse,
  isActive,
}) {
  const { _id, createdAt, category } = task,
    date = new Date(createdAt).toDateString(),
    week = date.slice(0, 3),
    complete = date.slice(4),
    history = useHistory();
  console.log("task", task);

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid className="md-accordion">
      <MDBCard>
        <MDBCollapseHeader
          onClick={() => setActiveCollapse(_id)}
          className="d-flex align-items-center justify-content-between"
        >
          <span>
            {number}.{dateFormat(task?.createdAt)}
          </span>

          <span>
            <MDBBadge color={sourceColor(category)} className="mx-2">
              {category}
            </MDBBadge>
            <MDBBadge
              onClick={() =>
                history.push(
                  `/transactions/reports?patient=${task.customerId?._id}`
                )
              }
              color="info"
              className="px-2 cursor-pointer"
            >
              <MDBIcon icon="eye" />
            </MDBBadge>
            {task.source && (
              <MDBBadge color="warning">{task.source?.name}</MDBBadge>
            )}
            <i
              style={{ transform: `rotate(${isActive ? 0 : 90}deg)` }}
              className="fa fa-angle-down transition-all ml-2"
            />
          </span>
        </MDBCollapseHeader>
        <MDBCollapse id={`collapse-${_id}`} isOpen={isActive}>
          <MDBCardBody className="pt-0">
            <Table menu={task} />
          </MDBCardBody>
        </MDBCollapse>
      </MDBCard>
    </MDBContainer>
  );
}
