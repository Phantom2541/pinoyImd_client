import React, { useState } from "react";
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
  const { filtered, activePage, maxPage } = useSelector(
    ({ generics }) => generics
  );

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  /**
   * Active states
   */
  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  return (
    <MDBContainer
      style={{
        minHeight: "300px",
      }}
      fluid
    >
      {paginatedData?.map((item, index) => {
        const actualIndex = startIndex + index; // Get the real index in filtered array
        const { color, border } = collapse.getStyle(
          actualIndex,
          activeId,
          didHoverId
        );

        return (
          <MDBCard
            key={`item-${actualIndex}`}
            style={{ boxShadow: "0px 0px 0px 0px", backgroundColor: "white" }}
          >
            <MDBCollapseHeader
              className={border}
              onMouseLeave={() => setDidHoverId(-1)}
              onMouseEnter={() => setDidHoverId(actualIndex)}
              style={{ borderRadius: "50%" }}
            >
              <CollapsableHeader
                item={item}
                isOpen={activeId === actualIndex}
                textColor={color}
                setActiveId={setActiveId}
                index={actualIndex}
              />
            </MDBCollapseHeader>

            <MDBCollapse
              id={`collapse-${actualIndex}`}
              isOpen={actualIndex === activeId}
            >
              <MDBCardBody className="m-0 p-0">
                <CollapsableBody item={item} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
