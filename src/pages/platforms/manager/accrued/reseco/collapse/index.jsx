import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  MDBCard,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBContainer,
} from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse } from "../../../../../../services/utilities";

export default function Body() {
  const { filtered } = useSelector(({ deals }) => deals),
    [cluster, setCluster] = useState([]);

  /**
   * Active states for collapsible items
   */
  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const handleSelect = (deal) => {
    const _cluster = [...cluster];
    const index = _cluster.findIndex((item) => item._id === deal._id);
    index > -1 ? _cluster.splice(index, 1) : _cluster.push(deal);
    setCluster(_cluster);
  };

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid>
      {filtered?.map((voucher, index) => {
        const { deals, date } = voucher;
        const actualIndex = index; // Directly use the index in the paginated data
        const { color, border } = collapse.getStyle(
          actualIndex,
          activeId,
          didHoverId
        );

        return (
          <MDBCard
            key={`service-${date}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
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
                count={deals.length}
                sum={deals.reduce((acc, item) => acc + item.amount, 0)}
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
                <CollapsableBody deals={deals} handleSelect={handleSelect} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
