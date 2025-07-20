import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { BROWSE } from "../../../../../services/redux/slices/diagnostics/management/temperatures";
import {
  SetMONTH,
  ResetDATE,
} from "../../../../../services/redux/slices/diagnostics/management/temperatures";
import CalendarPicker from "../../../../../components/header/calendars";

const Header = () => {
  const dispatch = useDispatch();
  const { maxPage, token, activePlatform } = useSelector(({ auth }) => auth);
  const { month, year } = useSelector(({ temperatures }) => temperatures);

  // Fetch data based on month/year
  useEffect(() => {
    if (maxPage) {
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
  }, [dispatch, maxPage, month, year, token, activePlatform]);

  // Get full month name
  const getMonthName = (m) => {
    if (!m) return new Date().toLocaleString("default", { month: "long" });
    return new Date(2000, m - 1).toLocaleString("default", { month: "long" });
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex justify-items-center" style={{ width: "20rem" }}>
        <span className="white-text mx-3 text-nowrap mt-0">
          {getMonthName(month)} {year} Room Temperatures
        </span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <CalendarPicker
            month={month}
            moved={(action) => dispatch(SetMONTH(action))}
            year={year}
            reset={() => dispatch(ResetDATE())}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
