// File: staffs/collapse/index.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CollapsableBody from "./body";
import { MDBCollapse, MDBCardBody } from "mdbreact";
import { collapse } from "../../../../../../services/utilities";
import { properFullname } from "../../../../../../services/utilities";
export default function CollapsableIndex() {
  const { filtered, activePage, maxPage } = useSelector(
    ({ applicants }) => applicants
  );
console.log("filtered",filtered);

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);
console.log("item",paginatedData);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId, setDidHoverId] = useState(-1);

  const renderStatusBadge = (status) => {
    let className = "badge";
    switch (status?.toLowerCase()) {
      case "active":
        className += " badge-success";
        break;
      case "on leave":
        className += " badge-warning";
        break;
      case "inactive":
        className += " badge-secondary";
        break;
      default:
        className += " badge-light";
    }
    return <span className={className}>{status}</span>;
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Name</th>
            <th>Application Date</th>
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
                  <td>{new Date(item.createdAt).toISOString().slice(0, 10)}</td>
                  <td>{renderStatusBadge(item.status)}</td>
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
