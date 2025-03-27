import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { Calendar as calendar } from "../../../../../../services/fakeDb";
import { Select } from "../../../../../../components/customizable";
import "./style.css";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";

const Header = () => {
  const { month, year } = useSelector(({ remittances }) => remittances),
    { collections } = useSelector(({ deals }) => deals),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const [sum, setSum] = useState(0);

  useEffect(() => {
    if (collections) {
      const sum = collections
        .filter((item) => !item.deleted)
        .reduce((acc, item) => acc + item.amount, 0);
      setSum(sum);
    }
  }, [collections]);

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
            startDate: startDate,
            endDate: endDate,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  const handleMonth = (m) => console.log(m);
  const handleYear = (y) => console.log(y);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <span className="white-text mx-3 text-nowrap mt-0">
        Monthly Ledger (₱{sum.toLocaleString()})
      </span>
      <div className="d-flex align-items-center justify-content-between"></div>

      <div className="d-flex align-items-center">
        <div className="d-flex ">
          <Select
            className="m-0 p-0 calendar mr-4"
            value={month}
            onChange={(value) => handleMonth(value)}
            inputClassName="m-0 p-0"
            preValue={month}
            collections={calendar.Months}
          />
          <Select
            value={year}
            inputClassName="m-0 p-0"
            preValue={year}
            onChange={(value) => handleYear(value)}
            className="m-0 p-0   calendar"
            collections={calendar.Years}
          />
        </div>
      </div>
    </MDBView>
  );
};

export default Header;
