import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendar as calendar } from "../../../../../../services/fakeDb";
import { Select } from "../../../../../../components/customizable";
import {
  BROWSE,
  RESET,
  SetMONTH,
  SetYEAR,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import "./style.css";
import { currency } from "../../../../../../services/utilities";
import { Calendars } from "../../../../../../components/header";

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { month, year, collections } = useSelector(
      ({ remittances }) => remittances
    ),
    [coh, setCoh] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      const startDate = new Date(year, month, 1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
      endDate.setHours(23, 59, 59, 999);

      dispatch(
        BROWSE({
          token,
          key: {
            branch: activePlatform?.branchId,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            cashier: auth?._id,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year, auth]);

  useEffect(() => {
    if (collections) {
      let gross = 0;
      collections.forEach((collection) => {
        if (!collection?.collector && collection.gross) {
          let _expenses = collection?.expenses || 0;
          let _gross = collection.gross || 0;
          gross += _gross - _expenses;
        }
      });
      setCoh(gross);
    }
  }, [collections]);

  const reset = () => {
    const _month = new Date().getMonth();
    const _year = new Date().getFullYear();
    dispatch(SetMONTH(_month));
    dispatch(SetYEAR(_year));
  };

  const prev = () => dispatch(SetMONTH(month - 1));
  const next = () => dispatch(SetMONTH(month + 1));

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex ">
          <span className="white-text mx-3 text-nowrap mt-0">
            Remittances{" "}
            {coh > 0 && (
              <span style={{ color: "green" }}> COH:({currency(coh)})</span>
            )}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <Calendars
          prev={prev}
          next={next}
          reset={reset}
          month={month}
          year={year}
        />

        {/* <Select
          className="m-0 p-0 calendar mr-4"
          value={calendar.Months[month]}
          onChange={(value) =>
            dispatch(SetMONTH(calendar.Months.indexOf(value)))
          }
          inputClassName="m-0 p-0"
          preValue={calendar.Months[month]}
          choices={calendar.Months}
        />
        <Select
          value={year}
          inputClassName="m-0 p-0"
          preValue={year}
          onChange={(value) => dispatch(SetYEAR(value))}
          className="m-0 p-0   calendar"
          choices={calendar.Years}
        /> */}
      </div>
    </MDBView>
  );
};

export default Header;
