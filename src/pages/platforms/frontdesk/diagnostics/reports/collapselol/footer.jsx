import React from "react";
import { MDBCardFooter, MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { REFORM } from "../../../../../../services/redux/slices/commerce/pos/services/taskGenerator";

export default function TaskFooter({ task }) {
  const { _id } = task;
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);

  const markAsCompleted = () => {
    dispatch(
      REFORM({
        token,
        data: {
          _id,
          completed: true,
          completedAt: new Date().toISOString(),
        },
      })
    );
    alert("Task marked as completed!");
  };

  return (
    <div
      style={{ marginTop: "-1.3rem" }}
      className="border-bottom border-right border-left border-black"
    >
      <div className="d-flex justify-content-between align-items-center mx-2 my-1">
        <div className="d-flex align-items-center">
          <span className="grey-text">Task ID:</span>
          <span style={{ fontWeight: 400 }} className="ml-1">
            {_id}
          </span>
        </div>
        <MDBBtn color="success" size="sm" onClick={markAsCompleted}>
          Mark as Completed <MDBIcon icon="check" className="ml-2" />
        </MDBBtn>
      </div>
    </div>
  );
}
