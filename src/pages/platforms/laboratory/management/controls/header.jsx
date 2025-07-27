import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { Services } from "../../../../../services/fakeDb";
import { SetCREATE } from "../../../../../services/redux/slices/diagnostics/management/controls";

const Header = () => {
  const { serviceId } = useSelector(({ controls }) => controls);
  const dispatch = useDispatch();

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex flex-column rounded"
    >
      {/* Row container para sa flex alignment */}
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        {/* Left-aligned text (auto-adjust kapag tumama sa button) */}
        <div className="flex-grow-1 w-50">
          <span className="white-text d-block w-100 text-wrap">
            {serviceId ? Services.getName(serviceId) : "Select Service first"}
          </span>
        </div>

        {/* Right-aligned button */}
        <MDBBtn
          size="sm"
          className="ms-2"
          rounded
          color="success"
          onClick={() => dispatch(SetCREATE({ serviceId }))}
        >
          <MDBIcon icon="plus" />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
