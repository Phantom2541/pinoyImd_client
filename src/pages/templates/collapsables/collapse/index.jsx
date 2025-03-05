import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Services } from "../../../../services/fakeDb";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";

// import { UPDATE } from "../../../../../../services/redux/slices/assets/persons/personnels";

export default function Body() {
  /**
   * check who will open
   */
  const [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1);
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

  console.log(activeId);

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {Services.collections.map((service, index) => {
        const { decSS, frequency } = service;

        const textColor =
          activeId !== index
            ? didHoverId === index
              ? "text-primary"
              : "text-black"
            : "text-white";
        const bgBorder =
          activeId === index
            ? " bg-info transition"
            : didHoverId === index
            ? "rounded border border-info bg-transparent ease-out"
            : "bg-transparent ease-out";

        return (
          <MDBCard
            key={`staffs-${index}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={bgBorder}
              onMouseLeave={() => setDidHoverId(-1)}
              onMouseEnter={() => setDidHoverId(index)}
              style={{ borderRadius: "50%" }}
            >
              <CollapsableHeader
                service={service}
                isOpen={activeId === index}
                textColor={textColor}
                setActiveId={setActiveId}
                index={index}
              />
            </MDBCollapseHeader>

            <MDBCollapse
              id={`collapse-${index}`}
              className="mb-2 border border-black"
              isOpen={index === activeId}
            >
              <MDBCardBody className="pt-2">
                <CollapsableBody decSS={decSS} frequency={frequency} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
