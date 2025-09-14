import React from "react";
import { MDBCollapseHeader, MDBBadge, MDBBtn } from "mdbreact";
import { useDispatch } from "react-redux";
import {
  // axioKit,
  dateFormat,
  sourceColor,
  // harvestTask,
  collapse,
} from "../../../../../../../services/utilities";
// import { Services } from "../../../../../../services/fakeDb";
// import { REFORM } from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";
import { SetSELECTED } from "../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

export default function TaskHeader({
  task,
  didHoverID,
  setDidHoverID,
  setActiveCollapse,
  activeCollapse,
}) {
  const { _id } = task; // cart, customerId, ssx
  // const { activeCOLAPSE } = useSelector(({ validator }) => validator),
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
