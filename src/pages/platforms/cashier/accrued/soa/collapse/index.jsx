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
import { collapse, dateFormat } from "../../../../../../services/utilities";

export default function Body() {
  const { filtered, activePage, maxPage } = useSelector(({ deals }) => deals),
    [cluster, setCluster] = useState([]);

  // Pagination logic and grouping by date
  useEffect(() => {
    const _cluster = filtered.reduce((groups, item) => {
      const date = dateFormat(item.createdAt);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {});

    setCluster(_cluster);
  }, [filtered, activePage, maxPage]); // Re-run whenever filtered data or page changes

  /**
   * Active states for collapsible items
   */
  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid>
      {Object.entries(cluster)?.map(([key, values], index) => {
        const actualIndex = index; // Directly use the index in the paginated data
        const { color, border } = collapse.getStyle(
          actualIndex,
          activeId,
          didHoverId
        );

        const sum = values.reduce((acc, item) => {
          return acc + (item?.services?.up || 0);
        }, 0);

        return (
          <MDBCard
            key={`service-${key}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={border}
              onMouseLeave={() => setDidHoverId(-1)}
              onMouseEnter={() => setDidHoverId(actualIndex)}
              onClick={() =>
                setActiveId(activeId === actualIndex ? -1 : actualIndex)
              } // Toggle active state
              style={{ borderRadius: "50%" }}
            >
              <CollapsableHeader
                key={key}
                title={key}
                count={values.length}
                sum={sum}
                isOpen={activeId === actualIndex}
                textColor={color}
                setActiveId={setActiveId}
                index={actualIndex}
              />
            </MDBCollapseHeader>

            <MDBCollapse
              id={`collapse-${actualIndex}`}
              className="mb-2 border border-black"
              isOpen={actualIndex === activeId} // Only open if the current ID matches activeId
            >
              <MDBCardBody className="pt-2">
                <CollapsableBody deals={values} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
