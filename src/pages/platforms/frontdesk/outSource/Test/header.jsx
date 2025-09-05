// import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MDBView } from "mdbreact";

const Header = () => {
  // const { maxPage } = useSelector(({ auth }) => auth); //get the max page
  const { collections } = useSelector(({ services }) => services); //
  // dispatch = useDispatch();

  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections?.length} Services
        </span>
      </div>
      <div>
        <div></div>
      </div>
    </MDBView>
  );
};

export default Header;
