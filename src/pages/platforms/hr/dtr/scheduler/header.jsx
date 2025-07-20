import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendars } from "../../../../components/header";
// import {
//   SetMONTH,
//   ResetDATE,
// } from "../../../../services/redux/slices/finance/journals/payments";

export default function Header() {
  // const { month, year } = useSelector(({ scheduler }) => scheduler),
  //   dispatch = useDispatch();

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">Scheduler</span>
      </div>
      <div>
        <div>
          <Calendars
          // month={month}
          // moved={(action) => dispatch(SetMONTH(action))}
          // year={year}
          // reset={() => dispatch(ResetDATE())}
          />
        </div>
      </div>
    </MDBView>
  );
}
