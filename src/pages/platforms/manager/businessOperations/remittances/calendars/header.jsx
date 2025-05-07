import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import "./style.css";
import {
  BROWSE,
  SetMONTH,
  ResetDATE,
  RESET,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { Calendars } from "./../../../../../../components/header";
import { currency } from "../../../../../../services/utilities";

const Header = () => {
  const {
      collections: remittances,
      month,
      year,
    } = useSelector(({ remittances }) => remittances),
    { collections: deals } = useSelector(({ deals }) => deals),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [expenses, setExpenses] = useState(0),
    [sum, setSum] = useState(0),
    [remitted, setRemitted] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    if (deals) {
      const totalSales = deals
        .filter((item) => !item.deleted)
        .reduce((acc, item) => acc + item.amount, 0);
      setSum(totalSales);
    }
  }, [deals]);

  useEffect(() => {
    if (remittances) {
      const totalRemitted = remittances
        .filter((item) => !item.deleted)
        .reduce((acc, item) => acc + (item?.coh - item?.opening?.sum), 0);

      const totalExpenses = remittances
        .filter((item) => !item.deleted)
        .reduce((acc, item) => acc + (item?.expenses || 0), 0);

      setRemitted(totalRemitted);
      setExpenses(totalExpenses);
    }
  }, [remittances]);

  useEffect(() => {
    if (token && activePlatform?.branchId && year !== null && month !== null) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      dispatch(
        BROWSE({
          token,
          key: {
            branch: activePlatform?.branchId,
            startDate,
            endDate,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  // Determine balance status and style for remittance only
  let remittedClass = "";
  let balanceMessage = "";

  if (remitted < sum) {
    remittedClass = "text-danger font-weight-bold"; // Dark red for under-remitted
    balanceMessage = "⚠️ Under-remitted";
  } else if (remitted > sum) {
    remittedClass = "text-warning font-weight-bold"; // Dark yellow for over-remitted
    balanceMessage = "⚠️ Over-remitted";
  } else {
    remittedClass = "text-success font-weight-bold"; // Dark green for balanced
    balanceMessage = "✔ Balanced";
  }

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <Calendars
        month={month}
        moved={(action) => dispatch(SetMONTH(action))}
        year={year}
        reset={() => dispatch(ResetDATE())}
      />

      <div className="d-flex align-items-center">
        <span className="mx-3 text-nowrap mt-0">
          Sales: <strong className="text-white">{currency(sum)}</strong>
        </span>
        |<span> Expenses : {currency(expenses)}</span>
        <span className="mx-3 text-nowrap mt-0">
          + Remitted:{" "}
          <strong className={remittedClass}>{currency(remitted)}</strong> (
          {balanceMessage})
        </span>
      </div>
    </MDBView>
  );
};

export default Header;
