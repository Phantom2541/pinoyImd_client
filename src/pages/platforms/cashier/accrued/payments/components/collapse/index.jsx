import React, { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCollapseHeader,
  MDBCollapse,
  MDBCardBody,
} from "mdbreact";
import { useSelector } from "react-redux";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import TableLoading from "../../../../../../../components/tableLoading";

export default function Body() {
  const { filtered, isLoading } = useSelector(({ payments }) => payments),
    [activeId, setActiveId] = useState(-1);
  return (
    <>
      {!isLoading ? (
        <MDBContainer
          style={{
            minHeight: "300px",
          }}
          fluid
        >
          {filtered.map((payment, index) => {
            // console.log(payment);
            const { breakdown } = payment;
            return (
              <MDBCard
                key={`staffs-${index}`}
                style={{
                  boxShadow: "0px 0px 0px 0px",
                  backgroundColor: "white",
                }}
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
                  <CollapsableHeader payment={payment} index={index} />
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
                    {/* <CollapsableBody breakdown={breakdown} /> */}
                  </MDBCardBody>
                </MDBCollapse>
              </MDBCard>
            );
          })}
        </MDBContainer>
      ) : (
        <TableLoading />
      )}
    </>
  );
}
