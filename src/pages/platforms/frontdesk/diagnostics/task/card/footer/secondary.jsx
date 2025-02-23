import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TAGGING } from "./../../../../../../../services/redux/slices/commerce/taskGenerator";
import { MDBBtn, MDBBtnGroup } from "mdbreact";

const SecondaryFooter = ({ setEdit }) => {
  const { token } = useSelector(({ auth }) => auth),
    { source, physician, _id } = useSelector(
      ({ taskGenerator }) => taskGenerator
    ),
    dispatch = useDispatch();
  const handleUpdate = () => {
    dispatch(
      TAGGING({
        token,
        key: { source, physician, _id },
      })
    );
    setEdit(false);
  };

  return (
    <MDBBtnGroup className="w-100">
      <MDBBtn
        type="button"
        className="m-0"
        size="sm"
        color="danger"
        onClick={() => setEdit(false)}
      >
        Cancel
      </MDBBtn>
      <MDBBtn
        onClick={handleUpdate}
        type="button"
        className="m-0 "
        size="sm"
        color="primary"
      >
        Submit
      </MDBBtn>
    </MDBBtnGroup>
  );
};

export default SecondaryFooter;
