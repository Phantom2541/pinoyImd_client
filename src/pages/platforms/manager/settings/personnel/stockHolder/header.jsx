import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../components/customizable";

const Header = () => {
  const { maxPage } = useSelector(({ auth }) => auth);
  const { filtered } = useSelector(({ services }) => services);
  dispatch = useDispatch();

  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {services.length} Stock Holders
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <Select className="m-0 p-0 calendar mr-4" />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
