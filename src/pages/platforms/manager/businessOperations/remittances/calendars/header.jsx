import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import "./style.css";
import {
  BROWSE,
  SetMONTH,
  SetYEAR,
  RESET,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { Calendars } from "./../../../../../../components/header";

const Header = () => {
  const {
      collections: remittances,
      month,
      year,
    } = useSelector(({ remittances }) => remittances),
    { collections: deals } = useSelector(({ deals }) => deals),
    { token, activePlatform } = useSelector(({ auth }) => auth),
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
      console.log("remittances", remittances);

      const totalRemitted = remittances
        .filter((item) => !item.deleted)
        .reduce((acc, item) => acc + (item?.closing?.sum || 0), 0);
      setRemitted(totalRemitted);
    }
  }, [remittances]);

  useEffect(() => {
    if (token && activePlatform?.branchId && year !== null && month !== null) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

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

  const reset = () => {
    const _month = new Date().getMonth();
    const _year = new Date().getFullYear();
    dispatch(SetMONTH(_month));
    dispatch(SetYEAR(_year));
  };

  const prev = () => dispatch(SetMONTH(month - 1));
  const next = () => dispatch(SetMONTH(month + 1));

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
        year={year}
        prev={prev}
        next={next}
        reset={reset}
      />

      <div className="d-flex align-items-center">
        <span className="mx-3 text-nowrap mt-0">
          Sales: <strong className="text-white">₱{sum.toLocaleString()}</strong>{" "}
          | Remitted:{" "}
          <strong className={remittedClass}>
            ₱{remitted.toLocaleString()}
          </strong>{" "}
          ({balanceMessage})
        </span>
      </div>
    </MDBView>
  );
};

export default Header;
