import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE } from "../../../../services/redux/slices/clinical/appointments";
import { Select } from "../../../../components/customizable";
const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections } = useSelector(({ appointments }) => appointments);
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
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            day: new Date().getDate(),
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
        <div className="text-right d-flex items-center">
          <Select
            className="m-0 p-0 calendar mr-4"
            // value={appointments}
            // onChange={(value) => handleComponent(value)}
            inputClassName="m-0 p-0"
            // preValue={appointments}
            collections={appointments}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
