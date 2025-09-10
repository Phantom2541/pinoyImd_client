import { useState } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCollapse, MDBCollapseHeader } from "mdbreact";

import CollapsableHeader from "./header";
import { collapse } from "../../../../../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";

export default function Body() {
  const { filtered, activePage, maxPage } = useSelector(
    ({ onBoardings }) => onBoardings
  );

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // First: Slice the filtered data
  const paginatedData = filtered.slice(startIndex, endIndex);
  // // Then: Sort so that "done" statuses are pushed to the bottom
  // const paginatedData = slicedData.sort((a, b) => {
  //   if (a.status === "done" && b.status !== "done") return 1;
  //   if (a.status !== "done" && b.status === "done") return -1;
  //   return 0; // keep original order otherwise
  // });
  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const renderNoData = () => (
    <div className="text-center text-muted py-4">
      <h3 className="text-muted"> No Express Lane Requests Available</h3>
      <p className="mt-2 small">
        Express Lane is our fast-track process for patients who reserved online
        or submitted HMO/Contract inquiries ahead of time.
        <br /> This allows us to secure approvals before your visit, so you can
        proceed directly to the cashier without delays.
      </p>
    </div>
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
