import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBIcon,
  MDBBtn,
} from "mdbreact";
import Swal from "sweetalert2";
import { DESTROY } from "../../../../../../../services/redux/slices/assets/providers";
const PopOver = ({ index, _id, setActiveId = () => {} }) => {
  const { token } = useSelector((state) => state.auth),
    dispatch = useDispatch();

  const handleUntag = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to untag this company!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, untag it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };
  return (
    <MDBPopover placement="bottom" popover clickable id={`popover-${index}`}>
      <MDBBtn
        className="m-0 p-0 ml-2"
        rounded
        color="light"
        onClick={() => setActiveId(index)}
        style={{
          width: "1.8rem",
          boxShadow: "0px 0px 0px 0px",
        }}
      >
        <i className="fa fa-ellipsis-h"></i>
      </MDBBtn>
      <div>
        <MDBPopoverHeader className="text-center">Action</MDBPopoverHeader>
        <MDBPopoverBody className="d-flex flex-column m-0 p-0">
          <MDBBtn size="sm" color="danger" onClick={() => handleUntag(_id)}>
            <MDBIcon icon="unlink" className="mr-2" />
            Untag
          </MDBBtn>
        </MDBPopoverBody>
      </div>
    </MDBPopover>
  );
};

export default PopOver;
