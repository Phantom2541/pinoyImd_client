import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import {
  BROWSE,
  SetMONTH,
  ResetDATE,
} from "../../../../../services/redux/slices/market/attendances";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections, month, year } = useSelector(
    ({ attendances }) => attendances
  );
  const dispatch = useDispatch();
  console.log("collections", collections);
  

  const handlePrintOut = () => {
    localStorage.setItem("attendances", JSON.stringify(collections));
    window.open(
      "/printout/attendances",
      "RequestForm",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        params: {
          branchId: activePlatform?.branchId,
          createdAt: new Date(year, month - 1, 1),
          endDate: new Date(year, month, 0, 23, 59, 59, 999),
        },
      })
    );
  }, [token, dispatch, activePlatform, month, year]);

  const hasRecordForCurrentMonth = collections.some((item) => {
    const date = new Date(item.createdAt);
    return date.getMonth() === month - 1 && date.getFullYear() === year;
  });

  const showPrintButton = hasRecordForCurrentMonth;

  return (
    <div style={{ position: "relative" }}>
      <MDBView
        cascade
        className="gradient-card-header blue-gradient py-2 d-flex justify-content-between align-items-center"
      >
        <div className="d-flex align-items-center">
          <CalendarPicker
            month={month}
            moved={(action) => dispatch(SetMONTH(action))}
            year={year}
            reset={() => dispatch(ResetDATE())}
          />
        </div>
        <div
          className="white-text text-nowrap text-center"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <span className="h3 m-0 font-weight-bold">Daily Time Record</span>
        </div>

        {/* Right: Print Button */}
        {showPrintButton && (
          <MDBBtn
            size="sm"
            rounded
            color="info"
            onClick={handlePrintOut}
            className="no-print"
          >
            <MDBIcon icon="print" />
          </MDBBtn>
        )}
      </MDBView>
    </div>
  );
};

export default Header;
