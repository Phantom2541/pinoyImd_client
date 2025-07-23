import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBView } from "mdbreact";
import {
  PAYROLL,
  SetMONTH,
  RESET,
  ResetDATE,
} from "../../../../services/redux/slices/assets/persons/personnels";
import { employment } from "../../../../services/utilities";
// import { Select } from "../../../../components/customizable";
import CalendarPicker from "../../../../components/header/calendars";

const Header = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ personnels }) => personnels),
    dispatch = useDispatch();
  console.log("employment", employment);
  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const abbr = [...employment.employed].map(({ abbr }) => abbr);
      dispatch(
        PAYROLL({
          token,
          params: {
            branchId: activePlatform?.branchId,
            abbr,
            timezone: "Asia/Manila",
            month,
            year,
          },
        })
      );
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div
        className="d-flex justify-items-center my-2"
        style={{ width: "20rem" }}
      >
        <span className="white-text mx-3 text-nowrap mt-0">Person List</span>
      </div>
      <div>
        <div className="text-right d-flex items-center">
          <CalendarPicker
            month={month}
            year={year}
            moved={(next) => dispatch(SetMONTH(next))}
            reset={() => dispatch(ResetDATE())}
          />
          {/* <Select
            className="m-0 p-0 calendar mr-4"
            value={component}
            onChange={(value) => handleComponent(value)}
            inputClassName="m-0 p-0"
            preValue={component}
            collections={Templates.getComponents("LAB")}
          /> */}
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
