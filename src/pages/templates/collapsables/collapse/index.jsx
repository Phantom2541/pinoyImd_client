import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";
import { Services } from "../../../../services/fakeDb";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse } from "../../../../services/utilities";

// import { UPDATE } from "../../../../../../services/redux/slices/assets/persons/personnels";

export default function Body() {
  /**
   * check who will open
   */
  const [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1);

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {Services.collections.map((service, index) => {
        const { decSS, frequency } = service;
        const { color, border } = collapse.getStyle(
          index,
          activeId,
          didHoverId
        );

        return (
          <MDBCard
            key={`staffs-${index}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={border}
              onMouseLeave={() => setDidHoverId(-1)}
              onMouseEnter={() => setDidHoverId(index)}
              style={{ borderRadius: "50%" }}
            >
              <CollapsableHeader
                service={service}
                isOpen={activeId === index}
                textColor={color}
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
