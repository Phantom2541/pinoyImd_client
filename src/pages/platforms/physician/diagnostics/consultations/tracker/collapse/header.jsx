import React from "react";
import { MDBCollapseHeader } from "mdbreact";
import { useDispatch } from "react-redux";
import { dateFormat, collapse } from "../../../../../../../services/utilities";
import { SetSELECTED } from "../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function TaskHeader({
  task,
  didHoverID,
  setDidHoverID,
  setActiveCollapse,
  activeCollapse,
}) {
  const { _id } = task; // cart, customerId, ssx
  const dispatch = useDispatch();

  const { color, border } = collapse.getStyle(
    String(_id),
    String(activeCollapse),
    String(didHoverID)
  );
  return (
    <MDBCollapseHeader
      onMouseLeave={() => setDidHoverID(-1)}
      onMouseEnter={() => setDidHoverID(_id)}
      className={`${border} ${color} p-2`}
      style={{ cursor: "default" }}
      onClick={() => {
        dispatch(
          SetSELECTED({
            deal: task,
          })
        );
        setActiveCollapse((prev) => (prev === _id ? "" : _id));
      }}
    >
      <div className="checkup-data-tracker-collapse-header">
        <span>{dateFormat(task?.createdAt)}</span>
      </div>
    </MDBCollapseHeader>
  );
}
