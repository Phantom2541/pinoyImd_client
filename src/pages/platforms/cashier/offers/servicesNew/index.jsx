import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBCollapse, MDBCollapseHeader } from "mdbreact";
import TopHeader from "../../../../../components/topHeader";
import { Templates } from "../../../../../services/fakeDb";
import CollapseTable from "./collapseTable";

const Services = () => {
  const [activeId, setActiveId] = useState(-1),
    [didHoverId, setDidHoverId] = useState(-1);

  return (
    <MDBCard narrow>
      <TopHeader title="Service List" />
      <MDBCardBody>
        {Templates.collections.length > 0 ? (
          Templates.collections.map((template, index) => {
            const { department } = template;
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
              <div
                key={index}
                className="mt-2"
                onMouseLeave={() => setDidHoverId(-1)}
                onMouseEnter={() => setDidHoverId(index)}
              >
                <MDBCollapseHeader
                  className={bgBorder}
                  onClick={() => {
                    setActiveId((prev) => (prev === index ? -1 : index));
                  }}
                >
                  <div className="d-flex justify-content-between">
                    <label className={textColor}>{`${index + 1}. ${
                      template.department
                    }`}</label>
                    <div className="d-flex align-items-center">
                      <i
                        style={{
                          rotate: `${activeId === index ? 0 : 90}deg`,
                        }}
                        className={`fa fa-angle-down transition-all ${textColor}`}
                      />
                    </div>
                  </div>
                </MDBCollapseHeader>
                <MDBCollapse
                  id={`collapse-${index}`}
                  isOpen={index === activeId}
                  className="border border-black"
                >
                  <CollapseTable department={department} />
                </MDBCollapse>
              </div>
            );
          })
        ) : (
          <h6 className="text-center">No Records.</h6>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default Services;
