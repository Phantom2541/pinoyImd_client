import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { SetAddChild } from "../../../../../../services/redux/slices/market/generics";

export default function Body() {
  const { filtered, activePage, maxPage } = useSelector(
      ({ generics }) => generics
    ),
    { isSuccess, selected } = useSelector(({ medicines }) => medicines),
    dispatch = useDispatch();

  useEffect(() => {
    dispatch(SetAddChild({ id: "684ced9a1a92a2bbe365e5c4", child: selected }));
  }, [selected, isSuccess, dispatch]);

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
                <CollapsableBody generics={item} brands={item.brands} />
              </MDBCardBody>
            </MDBCollapse>
          </MDBCard>
        );
      })}
    </MDBContainer>
  );
}
