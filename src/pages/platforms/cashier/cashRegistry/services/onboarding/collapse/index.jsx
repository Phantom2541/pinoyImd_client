import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapse, MDBCollapseHeader } from "mdbreact";

import CollapsableBody from "./body";
import CollapsableHeader from "./header";
import { collapse } from "../../../../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";

export default function Body({ toggle, setSelected }) {
  const { filtered, activePage, maxPage } = useSelector(
    ({ onBoardings }) => onBoardings
  );

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const renderNoData = () => (
    <div className="text-center text-muted py-4">No Onboarding available</div>
  );

  const renderData = () =>
    paginatedData.map((item, index) => {
      const actualIndex = startIndex + index;
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
            <BodySwitcher item={item} />
            {/* <CollapsableBody item={item} /> */}
          </MDBCollapse>
        </MDBCard>
      );
    });

  return (
    <div style={{ minHeight: "300px" }}>
      {paginatedData.length === 0 ? renderNoData() : renderData()}
    </div>
  );
}
