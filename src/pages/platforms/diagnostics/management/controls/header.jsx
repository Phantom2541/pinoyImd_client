import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import { Services } from "../../../../../services/fakeDb";
import { SetCREATE } from "../../../../../services/redux/slices/liability/controls";
const Header = () => {
  const { serviceId } = useSelector(({ controls }) => controls),
    dispatch = useDispatch();
  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {serviceId ? Services.getName(serviceId) : ""}
        </span>
        <MDBBtn
          size="sm"
          className="px-2"
          rounded
          color="success"
          style={{ marginRight: "200px" }} // Moves right by 5px
          onClick={() =>
            dispatch(
              SetCREATE({
                serviceId: serviceId,
              })
            )
          }
        >
          <MDBIcon icon="plus" />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
