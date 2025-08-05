// File: staffs/collapse/index.jsx
import React, { useState } from "react";
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
  const paginatedData = filtered.slice(startIndex, endIndex);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId] = useState(-1);

  const renderStatusBadge = (status, interviewDate) => {
    if (status === "denied") {
      return <span className="badge badge-danger">denied</span>;
    }

    if (!interviewDate && status !== "denied") {
      return <span className="badge badge-warning">pending</span>;
    }

    return null;
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Application Date</th>
            <th>Interview Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((item, index) => {
            const actualIndex = startIndex + index;
            const { color } = collapse.getStyle(
              actualIndex,
              activeId,
              didHoverId
            );

            return (
              <React.Fragment key={`item-${actualIndex}`}>
                <tr className={color}>
                  <td>{properFullname(item.user.fullName)}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </td>
                  <td>
                    {item.interviewDate
                      ? new Date(item.interviewDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td>{renderStatusBadge(item.status, item.interviewDate)}</td>
                  <td>
                    <button
                      onClick={() =>
                        setActiveId((prev) =>
                          actualIndex === prev ? -1 : actualIndex
                        )
                      }
                      className="btn btn-link p-0"
                    >
                      View{" "}
                      <i
                        className="fa fa-angle-left"
                        style={{
                          transform: `rotate(${
                            activeId === actualIndex ? "-90deg" : "0deg"
                          })`,
                          transition: "transform 0.3s ease",
                          marginLeft: "5px",
                        }}
                      />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" className="p-0 m-0">
                    <MDBCollapse isOpen={activeId === actualIndex}>
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
