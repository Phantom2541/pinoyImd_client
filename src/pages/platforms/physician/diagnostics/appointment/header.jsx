// import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MDBView } from "mdbreact";

const Header = () => {
  const { collections } = useSelector(({ appointments }) => appointments);

  //initial values

  return (
    <MDBView
      cascade
      className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {collections.length} Apointments
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">xxxx</div>
      </div>
    </MDBView>
  );
};

export default Header;
