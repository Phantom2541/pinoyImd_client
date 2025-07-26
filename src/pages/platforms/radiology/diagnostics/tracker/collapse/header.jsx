import React from "react";
import { MDBCollapseHeader, MDBBadge, MDBBtn } from "mdbreact";
// import { useDispatch, useSelector } from "react-redux";
import {
  // axioKit,
  dateFormat,
  sourceColor,
  // harvestTask,
  collapse,
} from "../../../../../../services/utilities";
// import { Services } from "../../../../../../services/fakeDb";
// import { REFORM } from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";

export default function TaskHeader({
  task,
  number,
  didHoverID,
  setDidHoverID,
  setActiveCollapse,
  isActive,
  activeCollapse,
}) {
  const { _id, category, source } = task; // cart, customerId, ssx

  const { color, border } = collapse.getStyle(
    String(_id),
    String(activeCollapse),
    String(didHoverID)
  );
  return (
    <MDBCollapseHeader
      onMouseLeave={() => setDidHoverID(-1)}
      onMouseEnter={() => setDidHoverID(_id)}
      className={`${border} ${color}`}
      style={{ cursor: "default" }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span>
            {number}. {dateFormat(task?.createdAt)}
          </span>
          <span>
            <MDBBadge
              color={sourceColor(category)}
              className="mx-2"
              style={{ fontSize: "0.7rem" }}
            >
              {category}
            </MDBBadge>

            {source && <MDBBadge color="warning">{source?.name}</MDBBadge>}
          </span>
        </div>
        <div className="d-flex align-items-center">
          <MDBBtn
            size="sm"
            color="white"
            rounded
            onClick={() =>
              setActiveCollapse((prev) => (prev === _id ? "" : _id))
            }
            className="m-0 p-0 transition-all "
            style={{ width: isActive ? "1.5rem" : "2rem", height: "1.4rem" }}
          >
            <i
              style={{ rotate: `${isActive ? 0 : 90}deg` }}
              className="fa fa-angle-down transition-all "
            />
          </MDBBtn>
        </div>
      </div>
    </MDBCollapseHeader>
  );
}
