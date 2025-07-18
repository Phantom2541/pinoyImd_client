import React, { useState, useMemo } from "react";
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
  const { filtered, activePage, maxPage } = useSelector(({ quest }) => quest);

  // ✅ Sort by schedule date first, then by title alphabetically
  const sortedFiltered = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.schedule || a.date || a.createdAt);
      const dateB = new Date(b.schedule || b.date || b.createdAt);

      if (dateA.getTime() !== dateB.getTime()) {
        return dateA - dateB; // earlier date first
      }

      const titleA = (a.company + " " + a.location).toLowerCase();
      const titleB = (b.company + " " + b.location).toLowerCase();
      return titleA.localeCompare(titleB); // alphabetical if same date
    });
  }, [filtered]);

  // ✅ Pagination
  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedFiltered.slice(startIndex, endIndex);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  return (
    <MDBContainer style={{ minHeight: "300px" }} fluid>
      {paginatedData.map((item, index) => {
        const actualIndex = startIndex + index;
        const { color, border } = collapse.getStyle(
          actualIndex,
          activeId,
          didHoverId
        );

        return (
          <MDBCard
            key={`item-${actualIndex}`}
            style={{
              boxShadow: "0px 0px 0px 0px",
              backgroundColor: "white",
            }}
          >
            <MDBCollapseHeader
              className={border}
              onMouseLeave={() => setDidHoverId(-1)}
              onMouseEnter={() => setDidHoverId(actualIndex)}
              style={{ borderRadius: "25%" }}
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
              className="mb-2 border border-black"
              isOpen={actualIndex === activeId}
            >
              <MDBCardBody className="pt-2">
                <CollapsableBody team={item?.team} _id={item?._id} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
