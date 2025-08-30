import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
  MDBIcon,
} from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import {
  collapse,
  handlePagination,
} from "../../../../../../services/utilities";
import Months from "../../../../../../services/fakeDb/calendar/months";

export default function Body() {
  const { filtered, activePage, month } = useSelector(({ deals }) => deals),
    { maxPage } = useSelector(({ auth }) => auth),
    [cluster, setCluster] = useState([]);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const handleSelect = (deal) => {
    const _cluster = [...cluster];
    const index = _cluster.findIndex((item) => item._id === deal._id);
    index > -1 ? _cluster.splice(index, 1) : _cluster.push(deal);
    setCluster(_cluster);
  };

  return (
    <MDBCardBody>
      <MDBContainer fluid>
        {filtered.length > 0 ? (
          handlePagination(filtered, activePage, maxPage)?.map(
            (voucher, index) => {
              const { deals = [], date } = voucher;
              const actualIndex = index; // Directly use the index in the paginated data
              const { color, border } = collapse.getStyle(
                actualIndex,
                activeId,
                didHoverId
              );

              return (
                <MDBCard
                  key={`service-${date}-${index}`}
                  style={{
                    boxShadow: "0px 0px 0px 0px",
                    backgroundColor: "white",
                  }}
                >
                  <MDBCollapseHeader
                    className={border}
                    onMouseLeave={() => setDidHoverId(-1)}
                    onMouseEnter={() => setDidHoverId(actualIndex)}
                    style={{ borderRadius: "50%" }}
                  >
                    <CollapsableHeader
                      key={date}
                      title={date}
                      count={deals?.length}
                      sum={deals?.reduce((acc, item) => acc + item.amount, 0)}
                      isOpen={activeId === actualIndex}
                      textColor={color}
                      setActiveId={setActiveId}
                      index={actualIndex}
                    />
                  </MDBCollapseHeader>

                  <MDBCollapse
                    id={`collapse-${actualIndex}`}
                    isOpen={actualIndex === activeId} // Only open if the current ID matches activeId
                  >
                    <MDBCardBody className=" m-0 p-0">
                      <CollapsableBody
                        deals={deals}
                        handleSelect={handleSelect}
                      />
                    </MDBCardBody>
                  </MDBCollapse>
                </MDBCard>
              );
            }
          )
        ) : (
          <div
            className="text-center p-5 my-4"
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
            }}
          >
            <MDBIcon far icon="frown" size="4x" className="text-muted mb-3" />
            <h4 className="text-muted font-weight-bold">
              No Rebates Record Found
            </h4>
            <p className="text-muted">
              For <b>{Months[month - 1]}</b>, you don’t have any rebates history
              yet. Records will appear here once available.
            </p>
          </div>
        )}
      </MDBContainer>
    </MDBCardBody>
  );
}
