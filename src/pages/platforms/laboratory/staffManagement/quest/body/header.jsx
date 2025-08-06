import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import "./style.css";

import {
  BROWSE,
  SetMONTH,
  ResetDATE,
} from "../../../../../../services/redux/slices/diagnostics/clinician/quest";
import { Calendars } from "../../../../../../components/header";

const Header = () => {
  const { collections, month, year } = useSelector(({ quest }) => quest),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year !== null && month !== null) {
      dispatch(
        BROWSE({
          token,
          params: {
            branchId: activePlatform?.branchId,
            month,
            year,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform, month, year]);

  // Determine balance status and style for remittance only
  let balanceMessage = "";

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
        <span
          className="mx-3 text-nowrap mt-0"
          // title={`predictable expenses: ${currency.format(preExpenses)}`}
        >
          Collections:{" "}
          <strong className="text-white">{collections?.length}</strong>
        </span>
        {/* |<span> Expenses : {currency.format(expenses)}</span>| */}
        <span title="Gcash, Voucher, Cheque, Credit">
          {/* Non-Cash: {currency.format(nonCash)} */}
        </span>
        <span className="mx-3 text-nowrap mt-0">
          + Remitted:{" "}
          {/* <strong className={remittedClass}>{currency.format(remitted)}</strong>{" "} */}
          ({balanceMessage})
        </span>
      </div>
    </MDBView>
  );
};

export default Header;
