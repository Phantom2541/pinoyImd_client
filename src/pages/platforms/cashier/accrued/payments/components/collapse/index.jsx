import React, { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCollapseHeader,
  MDBCollapse,
  MDBCardBody,
} from "mdbreact";
import { useSelector } from "react-redux";
import { collapse } from "../../../../../../../services/utilities";

import Body from "./body";
import Header from "./header";
import TableLoading from "../../../../../../../components/tableLoading";

export default function Index() {
  const { filtered, isLoading } = useSelector(({ payments }) => payments);
  const [activeId, setActiveId] = useState(0);
  const [didHoverId, setDidHoverId] = useState(-1);

  return (
    <>
      {!isLoading ? (
        <MDBContainer
          style={{
            minHeight: "300px",
          }}
          fluid
        >
          {filtered
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // DESC order
            .map((payment, index) => {
              const { deals, date, sum } = payment;
              const actualIndex = index;
              const { color } = collapse.getStyle(
                actualIndex,
                activeId,
                didHoverId
              );

              return (
                <MDBCard
                  key={`staffs-${index}`}
                  style={{
                    boxShadow: "none",
                    backgroundColor: "white",
                  }}
                >
                  <MDBCollapseHeader
                    className={`${
                      index === activeId
                        ? "bg-info text-white transition"
                        : "bg-white"
                    } ${activeId === index ? "custom-header" : ""}`}
                    style={{
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setActiveId((prev) => (prev === index ? -1 : index))
                    }
                    onMouseLeave={() => setDidHoverId(-1)}
                    onMouseEnter={() => setDidHoverId(actualIndex)}
                  >
                    <Header
                      key={date}
                      title={date}
                      count={deals?.length}
                      sum={sum}
                      textColor={color}
                      activeId={activeId}
                      index={index}
                    />
                  </MDBCollapseHeader>
                  <MDBCollapse
                    id={`collapse-${index}`}
                    className="mb-2"
                    isOpen={index === activeId}
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,.125)",
                      borderRight: "1px solid rgba(0,0,0,.125)",
                      borderLeft: "1px solid rgba(0,0,0,.125)",
                    }}
                  >
                    <MDBCardBody className="pt-2">
                      <Body deals={deals} />
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
