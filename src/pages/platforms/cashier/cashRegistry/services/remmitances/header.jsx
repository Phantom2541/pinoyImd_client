import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendar as calendar } from "../../../../../../services/fakeDb";
import CustomSelect from "../../../../../../components/searchables/customSelect";
import {
  BROWSE,
  RESET,
  SetMONTH,
  SetYEAR,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import "./style.css";

// const today = new Date();
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { month, year } = useSelector(({ remittances }) => remittances),
    dispatch = useDispatch();

  console.log("activePlatform", activePlatform);

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            month: monthNames[month],
            year,
            cashier: auth?._id,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year, auth]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex ">
          <span className="white-text mx-3 text-nowrap mt-0">Remittances</span>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <CustomSelect
          className="m-0 p-0 calendar mr-4"
          value={calendar.Months[month]}
          onChange={(value) =>
            dispatch(SetMONTH(calendar.Months.indexOf(value)))
          }
          inputClassName="m-0 p-0"
          preValue={calendar.Months[month]}
          choices={calendar.Months}
        />
        <CustomSelect
          value={year}
          inputClassName="m-0 p-0"
          preValue={year}
          onChange={(value) => dispatch(SetYEAR(value))}
          className="m-0 p-0   calendar"
          choices={calendar.Years}
        />
      </div>
    </MDBView>
  );
};

export default Header;
