import React from "react";
import {
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBAnimation,
  MDBCardHeader,
  MDBListGroup,
  MDBListGroupItem,
} from "mdbreact";

import { SearchUser } from "../../../components/searchables";
const List = ({
  collections,
  handleDrop,
  addID,
  handleDragStart,
  removeID,
  tableName = "",
  removeBy = "",
  title = "Selected Roles",
}) => {
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDragEnd = (event) => {
    event.preventDefault();
  };
  return (
    <MDBCol
      onDrop={(event) => handleDrop(event, tableName)}
      onDragOver={handleDragOver}
    >
      <MDBCard className="dragDrop" style={{ height: "20rem" }}>
        <MDBCardHeader className="bg-light dragDrop d-flex justify-content-between align-items-center transition-all">
          <span style={{ fontWeight: 500 }}> {title}</span>
          {collections.length > 4 && <SearchUser />}
        </MDBCardHeader>
        <MDBCardBody
          className="m-0 p-0 dragDrop"
          onDrop={(event) => handleDrop(event, tableName)}
          onDragOver={handleDragOver}
        >
          <MDBListGroup>
            {collections.length > 0 ? (
              collections.map((role, index) => (
                <MDBAnimation
                  key={`${role._id}-${index}`}
                  type={
                    index === removeID && title === removeBy
                      ? "zoomOut"
                      : addID === role._id
                      ? "zoomIn"
                      : ""
                  }
                >
                  <MDBListGroupItem
                    draggable
                    onDragEnd={handleDragEnd}
                    onDragStart={(event) => {
                      handleDragStart(event, role, index, tableName);
                    }}
                    hover
                    className="cursor-pointer"
                  >
                    {role.name}
                  </MDBListGroupItem>
                </MDBAnimation>
              ))
            ) : (
              <MDBListGroupItem className="text-center">
                No Record
              </MDBListGroupItem>
            )}
          </MDBListGroup>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  );
};

export default List;
