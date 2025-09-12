import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import {
  BROWSE,
  SetPHYSICIAN,
} from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import { properFullname } from "../../../../services/utilities";
const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth);
  const { collections, physician } = useSelector(
    ({ appointments }) => appointments
  );
  const { physicians = [] } = activePlatform?.branch || {};
  const [appointments, setAppointments] = useState([]),
    dispatch = useDispatch();

  //initial values
  useEffect(() => {
    if (token && activePlatform)
      dispatch(
        BROWSE({
          token,
          data: {
            branch: activePlatform.branchId,
            user: auth?._id,
            // month: new Date().getMonth() + 1,
            month: 6,
            year: new Date().getFullYear(),
            // day: new Date().getDate(),
            day: 3,
          },
        })
      );
  }, [dispatch, token, activePlatform]);

  useEffect(() => {
    if (collections) setAppointments(collections);
  }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {appointments.length} Physicians
        </span>
      </div>
      <div>
        <div className="text-right d-flex align-items-center">
          <span className="mr-2">Physician:</span>
          <select className="form-control bg-light">
            <option value="all">All</option>
            {physicians.map((user) => (
              <option key={user?._id} value={user?._id}>
                Dr. {properFullname(user?.fullName)}
              </option>
            ))}
          </select>
          {/* <select
            className="form-control bg-light"
            value={physician}
            onChange={({ target }) => dispatch(SetPHYSICIAN(target.value))}
          >
            <option value="all">All</option>
            {appointments.map(({ user }) => (
              <option key={user?._id} value={user?._id}>
                Dr. {properFullname(user?.fullName)}
              </option>
            ))}
          </select> */}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
