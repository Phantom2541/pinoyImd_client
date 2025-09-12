import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Select } from "../../../../../components/customizable";
import { Templates, Services } from "../../../../../services/fakeDb";
import {
  BROWSE,
  SetPHYSICIAN,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";

const Header = () => {
  const { activePlatform, auth, token } = useSelector(({ auth }) => auth),
    { collections, physician } = useSelector(
      ({ appointments }) => appointments
    ),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform)
      dispatch(
        BROWSE({
          token,
          data: {
            branch: activePlatform.branchId,
            user: auth._id,
            month: new Date().getMonth() + 1,
            // month: 6,
            year: new Date().getFullYear(),
            day: new Date().getDate(),
            // day: 3,
          },
        })
      );
  }, [dispatch, token, activePlatform, auth]);

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
        <div className="text-right d-flex items-center"></div>
      </div>
    </MDBView>
  );
};

export default Header;
