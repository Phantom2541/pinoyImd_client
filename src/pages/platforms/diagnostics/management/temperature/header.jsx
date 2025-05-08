// Header.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBIcon, MDBBtn } from "mdbreact";
import "./style.css";
import {
  SetMONTH,
  ResetDATE,
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/diagnostics/management/temperatures";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const dispatch = useDispatch();
  const { collections, isLoading, month, year } = useSelector(
    ({ temperatures }) => temperatures
  );
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  useEffect(() => {
    if (token && activePlatform?.branchId && year !== null && month !== null) {
      dispatch(
        BROWSE({
          token,
          data: {
            branchId: activePlatform?.branchId,
            month,
            year,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  const handlePrint = () => {
    localStorage.setItem("temperature", JSON.stringify(collections));
    console.log("collections: ", collections);

    window.open(
      "/printout/temperature/graph",
      "Temperature Graph",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <CalendarPicker
          month={month}
          moved={(action) => dispatch(SetMONTH(action))}
          year={year}
          reset={() => dispatch(ResetDATE())}
        />
      </div>
      <h3 className="text-white text-center mx-3">TEMPERATURE MONITORING</h3>
      <div className="d-flex align-items-center">
        <MDBBtn
          type="submit"
          disabled={isLoading}
          color="primary"
          size="md"
          rounded
          onClick={handlePrint}
        >
          <MDBIcon icon="print" />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
