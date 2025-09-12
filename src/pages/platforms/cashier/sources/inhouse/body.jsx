import {
  MDBBadge,
  MDBBtn,
  MDBCardBody,
  MDBCollapse,
  MDBCollapseHeader,
  MDBIcon,
} from "mdbreact";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  capitalize,
  collapse,
  handlePagination,
} from "../../../../../services/utilities";
import Collapse from "./collapse";
const Body = () => {
  const { filtered, maxPage, activePage } = useSelector(
      ({ branches }) => branches
    ),
    [activeId, setActiveId] = useState(0),
    [didHoverId, setDidHoverId] = useState(-1);

  const statusOrder = {
    active: 1,
    suspended: 2,
    draft: 3,
    expired: 4,
    cancelled: 5,
  };

  const sorted = [...filtered].sort((a, b) => {
    const rankA = statusOrder[a.settings?.status?.trim().toLowerCase()] ?? 99;
    const rankB = statusOrder[b.settings?.status?.trim().toLowerCase()] ?? 99;
    return rankA - rankB;
  });

  const getColorByStatusType = (type) => {
    const map = {
      draft: "light",
      active: "primary",
      expired: "danger",
      suspended: "warning",
      cancelled: "dark",
    };
    return map[type?.toLowerCase()] || "secondary";
  };
  return (
    <MDBCardBody>
      {filtered.length > 0 ? (
        handlePagination(sorted, activePage, maxPage).map((branch, index) => {
          const {
            name = "",
            displayname = "",
            isMain = false,
            settings,
          } = branch;
          const { color, border } = collapse.getStyle(
            index,
            activeId,
            didHoverId
          );
          const isOpen = index === activeId;
          const baseName = capitalize(name || displayname);
          return (
            <>
              <MDBCollapseHeader
                className={border}
                onMouseLeave={() => setDidHoverId(-1)}
                onMouseEnter={() => setDidHoverId(index)}
                style={{ borderRadius: "50%" }}
              >
                <div className={`d-flex justify-content-between ${color} `}>
                  <div>
                    {index + 1} . {baseName}
                    {isMain && (
                      <MDBBadge color="warning" className=" ml-2">
                        <small className="fw-bold">Main</small>
                      </MDBBadge>
                    )}
                  </div>
                  <div className="d-flex">
                    <MDBBadge
                      color={getColorByStatusType(settings?.status)}
                      className="mr-2 px-2 py-1 rounded"
                    >
                      {settings?.status}
                    </MDBBadge>

                    <MDBBtn
                      size="sm"
                      color="white"
                      rounded
                      onClick={() =>
                        setActiveId((prev) => (index === prev ? -1 : index))
                      }
                      className="m-0 p-0 transition-all "
                      style={{ width: isOpen ? "1.5rem" : "2rem" }}
                    >
                      <i
                        style={{ rotate: `${isOpen ? 0 : 90}deg` }}
                        className="fa fa-angle-down transition-all "
                      />
                    </MDBBtn>
                  </div>
                </div>
              </MDBCollapseHeader>
              <MDBCollapse
                id={`collapse-${index}`}
                className="mb-2 border border-black"
                isOpen={isOpen}
              >
                <Collapse branch={branch} />
              </MDBCollapse>
            </>
          );
        })
      ) : (
        <div className="text-center p-5">
          <MDBIcon far icon="sad-tear" size="3x" className="text-muted mb-3" />
          <h5 className="font-weight-bold mb-3">No In-House Source Found</h5>
          <p className="mb-2">
            You currently don't have any registered in-house source.
          </p>
          <p className="text-muted">
            In-House Sources refer to patients coming directly from our own
            physicians or other departments within the clinic/hospital.
            <br />
            <br />
            Declaring in-house sources helps us properly track referrals, ensure
            accurate reporting, and recognize the contributions of our internal
            medical team.
          </p>
        </div>
      )}
    </MDBCardBody>
  );
};

export default Body;
