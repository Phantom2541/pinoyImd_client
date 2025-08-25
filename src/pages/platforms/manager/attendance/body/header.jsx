import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendars } from "../../../../../components/header";
import { SetMONTH, ResetDATE } from "../../../../../services/redux/slices/finance/bookkeeping/remittances";

const Header = () => {
  const dispatch = useDispatch();
  const { month, year } = useSelector(({ remittances }) => remittances);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-start align-items-center"
    >
      <Calendars
        month={month}
        moved={(action) => dispatch(SetMONTH(action))}
        year={year}
        reset={() => dispatch(ResetDATE())}
      />
    </MDBView>
  );
};

export default Header;
