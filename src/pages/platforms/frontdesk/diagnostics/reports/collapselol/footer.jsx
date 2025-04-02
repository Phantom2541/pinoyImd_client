import React from "react";
import { MDBCardFooter, MDBBtn } from "mdbreact";
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
    <MDBCardFooter className="d-flex justify-content-between align-items-center">
      <span className="text-muted">Task ID: {_id}</span>
      <MDBBtn color="success" size="sm" onClick={markAsCompleted}>
        Mark as Completed
      </MDBBtn>
    </MDBCardFooter>
  );
}
