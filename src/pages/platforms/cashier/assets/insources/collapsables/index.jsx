import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import CollapseTable from "./table";
import { SearchPhysicians as Search } from "../../../../../../components/searchables";
// import { TagPHYSICIAN } from "../../../../../../services/redux/slices/assets/branches";

export default function MenuCollapse() {
  /**
   * check who will open
   */
  const [activeId, setActiveId] = useState(-1),
    { collections } = useSelector(({ providers }) => providers);
  const { maxPage, token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  // console.log("collections: ", collections);

  const handleTag = (physician) => {
    console.log("physician", physician);

    // dispatch(
    //   TagPHYSICIAN({
    //     data: {
    //       physicianId,
    //       BranchId,
    //     },
    //     token,
    //   })
    // );
  };

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {collections?.map(({ clients, name, subName }, index) => {
        const affiliated = clients?.affiliated || [];

        return (
          <MDBCard
            key={`staffs-${index}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={`${
                index === activeId
                  ? "bg-info text-white transition"
                  : "bg-white"
              } ${activeId === index ? "custom-header" : ""}`}
              style={{ borderRadius: "50%" }}
            >
              <label className="d-flex justify-content-between">
                <span>
                  {index + 1}. {name} {subName}
                </span>
                <small
                  className="d-flex justify-content-between"
                  onClick={() =>
                    setActiveId((prev) => (prev === index ? -1 : index))
                  }
                >
                  <i
                    style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
                    className="fa fa-angle-down transition-all mr-2"
                  />
                </small>
              </label>
            </MDBCollapseHeader>
            <MDBCollapse
              id={`collapse-${index}`}
              className="mb-2"
              isOpen={index === activeId}
              style={{
                borderBottom: "1px solid black",
                borderRight: "1px solid black",
                borderLeft: "1px solid black",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <span>Tag Physician</span>
                <Search setPhysician={handleTag} />
              </div>
              <MDBCardBody className="pt-2">
                <CollapseTable
                  affiliated={affiliated}
                  BranchId={clients?._id}
                />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
