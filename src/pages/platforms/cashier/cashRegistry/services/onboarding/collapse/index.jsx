import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapse, MDBCollapseHeader } from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse } from "../../../../../../../services/utilities";
import { isEmpty } from "lodash";
import Swal from "sweetalert2";
import { Services } from "../../../../../../../services/fakeDb";

export default function Body({ toggle, setSelected }) {
  const { filtered, activePage, maxPage } = useSelector(({ deals }) => deals);

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  console.log("paginatedData", paginatedData);
  /**
   * Active states
   */
  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const handleProcess = (deal) => {
    const { sendouts } = deal;
    if (isEmpty(sendouts.foundMenus)) {
      return Swal.fire({
        icon: "warning",
        title: "No Matching Menu Found",
        html: `This request cannot be processed because there is no menu that offers the <b>${sendouts?.servicesId
          .map((id) => Services.getAbbr(id))
          .join(
            ", "
          )}</b> services. Please contact the administrator for assistance.`,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }

    setSelected(deal);
    toggle();
  };
  return (
    <>
      <div
        style={{
          minHeight: "300px",
        }}
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
                className="mb-2 border border-black"
                isOpen={actualIndex === activeId}
              >
                <MDBCardBody className="pt-2">
                  <CollapsableBody item={item} handleProcess={handleProcess} />
                </MDBCardBody>
              </MDBCollapse>
            </MDBCard>
          );
        })}
      </div>
    </>
  );
}
