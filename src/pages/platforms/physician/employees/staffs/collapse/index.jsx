// File: staffs/collapse/index.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import CollapsableBody from "./body";
import { MDBCollapse, MDBCardBody } from "mdbreact";
import { collapse, properFullname } from "../../../../../../services/utilities";
import { Policy } from "../../../../../../services/fakeDb";

export default function CollapsableIndex() {
  const { filtered, activePage, maxPage } = useSelector(
    ({ physicians }) => physicians
  );

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  const [activeId, setActiveId] = useState(-1);
  const [didHoverId] = useState(-1);

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
            <th>Specialization</th>
            <th>Department</th>
            <th>Status</th>
            <th>Clinic</th>
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
            const isActive = activeId === actualIndex;
            const textClass = isActive
              ? "font-weight-bold text-dark"
              : "text-dark";

            return (
              <React.Fragment key={`item-${actualIndex}`}>
                <tr className={color}>
                  <td className={textClass}>
                    {item.user
                      ? properFullname(item.user.fullName)
                      : properFullname(item.ghostName)}
                  </td>
                  <td className={textClass}>{item.specialization}</td>
                  <td>
                    {item?.position?.employment &&
                      Policy.getDepartment(
                        item?.position?.employment?.designation
                      )}
                  </td>
                  <td className={textClass}>
                    {renderStatusBadge(item?.clinic && item?.clinic?.status)}
                  </td>
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
                      <MDBCardBody className="m-0 p-3">
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
