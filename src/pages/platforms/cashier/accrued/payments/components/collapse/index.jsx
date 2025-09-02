import { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCollapseHeader,
  MDBCollapse,
} from "mdbreact";
import { useSelector } from "react-redux";
import { collapse } from "../../../../../../../services/utilities";

import Body from "./body";
import Header from "./header";
import TableLoading from "../../../../../../../components/tableLoading";
import Months from "../../../../../../../services/fakeDb/calendar/months";

export default function Index() {
  const { filtered, isLoading, month, year } = useSelector(
    ({ payments }) => payments
  );
  const [activeId, setActiveId] = useState(0);
  const [didHoverId, setDidHoverId] = useState(-1);

  return (
    <>
      {!isLoading ? (
        <MDBContainer fluid>
          {filtered.length > 0 ? (
            filtered
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
                      isOpen={index === activeId}
                    >
                      <Body deals={deals} />
                    </MDBCollapse>
                  </MDBCard>
                );
              })
          ) : (
            <div className="text-center py-5">
              <p className="fs-5 text-muted mb-1">
                💳 No payment records found
              </p>
              <p className="text-secondary small">
                for{" "}
                <strong>
                  {Months[month - 1]} {year}
                </strong>
              </p>
            </div>
          )}
        </MDBContainer>
      ) : (
        <TableLoading />
      )}
    </>
  );
}
