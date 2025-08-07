import React from "react";
import { MDBBadge } from "mdbreact";
import { properFullname } from "../../../../../../services/utilities";

const Header = ({ item, isOpen, textColor, index, setActiveId }) => {
  const { aId, cId, status, isEmergency, roa, tags } = item;

  const statusColor =
    {
      active: "success",
      discharged: "danger",
      cancelled: "secondary",
      transferred: "warning",
    }[status] || "dark";

  // 🔥 Emergency background style (soft red highlight)
  const emergencyStyle = isEmergency
    ? { backgroundColor: "#ffdddd" } // light red
    : {};

  return (
    <div
      className={`d-flex justify-content-between align-items-center ${textColor}`}
      onClick={() => setActiveId((prev) => (index === prev ? -1 : index))}
      style={{ padding: "1rem", ...emergencyStyle }}
    >
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center">
          <strong>{aId?.split("-")[2]}.</strong>&nbsp;
          <span>{properFullname(cId?.fullName)}</span>
        </div>

        <div className="d-flex flex-wrap mt-1" style={{ gap: "0.25rem" }}>
          {tags?.length > 0 ? (
            tags.map((tag, i) => (
              <MDBBadge key={i} color="info">
                {tag}
              </MDBBadge>
            ))
          ) : (
            <span className="text-muted">No tags</span>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        {isEmergency && (
          <MDBBadge color="danger" className="ml-1">
            Emergency
          </MDBBadge>
        )}
        <MDBBadge color={statusColor}>{status}</MDBBadge>

        <span>{roa}</span>
        <button
          className="transition-all"
          style={{
            border: "none",
            backgroundColor: "transparent",
            rotate: `${isOpen ? -90 : 0}deg`,
          }}
        >
          <i
            className="fa fa-angle-left transition-all"
            style={{ color: isOpen ? "white" : "" }}
          />
        </button>
      </div>
    </div>
  );
};

export default Header;
