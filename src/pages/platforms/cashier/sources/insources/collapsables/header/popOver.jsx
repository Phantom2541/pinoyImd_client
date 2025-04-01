import React from "react";
import {
  MDBPopover,
  MDBPopoverBody,
  MDBPopoverHeader,
  MDBIcon,
  MDBBtn,
} from "mdbreact";
const PopOver = ({
  index,
  providerID,
  setActiveId = () => {},
  handleUntag = () => {},
}) => {
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
          <MDBBtn
            size="sm"
            color="danger"
            onClick={() => handleUntag(providerID)}
          >
            <MDBIcon icon="unlink" className="mr-2" />
            Untag
          </MDBBtn>
        </MDBPopoverBody>
      </div>
    </MDBPopover>
  );
};

export default PopOver;
