// File: staffs/collapse/index.jsx
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import CollapsableBody from "./body";
import { MDBCollapse, MDBCardBody } from "mdbreact";
import { collapse, properFullname } from "../../../../../../services/utilities";

export default function CollapsableIndex() {
  const { filtered, activePage, maxPage } = useSelector(
    ({ applicants }) => applicants
  );

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // ✅ Memoized paginated data
  const paginatedData = useMemo(
    () => filtered.slice(startIndex, endIndex),
    [filtered, startIndex, endIndex]
  );

  const [activeId, setActiveId] = useState(-1);

  const renderStatusBadge = (status, interviewDate) => {
    if (status === "denied")
      return <span className="badge badge-danger">Denied</span>;
    if (!interviewDate)
      return <span className="badge badge-warning">Pending</span>;
    return null;
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Application Date</th>
            <th>Interview Date</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => {
            const { user, createdAt, interviewDate, status } = item;
            const actualIndex = startIndex + index;

            const { color } = collapse.getStyle(actualIndex, activeId, -1);
            const isActive = activeId === actualIndex;

            const textClass = isActive
              ? "font-weight-bold text-dark"
              : "text-dark";

            return (
              <React.Fragment key={`item-${actualIndex}`}>
                <tr className={color}>
                  <td className={textClass}>{actualIndex + 1}.</td>
                  <td className={textClass}>{properFullname(user.fullName)}</td>
                  <td className={textClass}>
                    {new Date(createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </td>
                  <td className={textClass}>
                    {interviewDate
                      ? new Date(interviewDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td>{renderStatusBadge(status, interviewDate)}</td>
                  <td>
                    <button
                      onClick={() =>
                        setActiveId((prev) =>
                          actualIndex === prev ? -1 : actualIndex
                        )
                      }
                      className="btn btn-link p-0"
                      aria-expanded={isActive}
                    >
                      Docs{" "}
                      <i
                        className="fa fa-angle-left ml-1"
                        style={{
                          transform: `rotate(${isActive ? "-90deg" : "0deg"})`,
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" className="p-0 m-0">
                    <MDBCollapse isOpen={isActive}>
                      <MDBCardBody className="m-0 p-4">
                        <CollapsableBody item={item} />
                      </MDBCardBody>
                    </MDBCollapse>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
