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
import { Services } from "../../../../services/fakeDb";

// import { UPDATE } from "../../../../../../services/redux/slices/assets/persons/personnels";

export default function MenuCollapse() {
  /**
   * check who will open
   */
  const [activeId, setActiveId] = useState(-1);
  const { maxPage, token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  // const onSubmit = (data) => {
  //   dispatch(
  //     UPDATE({
  //       data: {
  //         _id: data._id,
  //       },
  //       token,
  //     })
  //   );
  // };

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {Services.collections.map((service, index) => {
        const { name, abbreviation, decSS, frequency, template } = service;

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
              onClick={() =>
                setActiveId((prev) => (prev === index ? -1 : index))
              }
            >
              <label className="d-flex justify-content-between">
                {index + 1}. {name} {abbreviation}
                <small>
                  {template}
                  <i
                    style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
                    className="fa fa-angle-down transition-all ml-2"
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
              <MDBCardBody className="pt-2">
                <CollapseTable decSS={decSS} frequency={frequency} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
