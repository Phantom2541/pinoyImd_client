import React from "react";
import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
} from "mdbreact";
import { sourceColor } from "../../../../../../services/utilities";
import Table from "./table";

export default function TasksCollapse({
  task,
  number,
  setActiveCollapse,
  isActive,
}) {
  //console.log("task", task);

  const { _id, createdAt, category } = task,
    date = new Date(createdAt).toDateString(),
    week = date.slice(0, 3),
    complete = date.slice(4);

  return (
    <MDBCard>
      <MDBCollapseHeader>
        <div className="d-flex justify-content-between">
          <label>
            {number}.&nbsp;
            <span className={`${week === "Sun" && "text-danger"}`}>{week}</span>
            , {complete}
            <MDBBadge color={sourceColor(category)} className="mx-2">
              {category}
            </MDBBadge>
          </label>
          <MDBBtnGroup>
            <MDBBtn
              color="primary"
              onClick={() => alert("modal")}
              size="sm"
              rounded
            >
              <MDBIcon icon="pencil-alt" className="mr-2" />
            </MDBBtn>

            <MDBBtn
              color="info"
              onClick={() =>
                setActiveCollapse((prev) => (prev === _id ? "" : _id))
              }
              size="sm"
              rounded
            >
              <i
                style={{ rotate: `${isActive ? 0 : 90}deg` }}
                className="fa fa-angle-down transition-all"
              />
            </MDBBtn>
          </MDBBtnGroup>
        </div>
      </MDBCollapseHeader>
      <MDBCollapse id={`collapse-${_id}`} isOpen={isActive}>
        <MDBCardBody className="pt-0">
          <Table menu={task} />
        </MDBCardBody>
      </MDBCollapse>
    </MDBCard>
  );
}
