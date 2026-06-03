import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBView } from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  BROWSE,
  RESET,
  ResetDATE,
  SetMONTH,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import "./style.css";
import { currency } from "../../../../../../services/utilities";
import { Calendars } from "../../../../../../components/header";

const Header = () => {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { month, year, collections, isSuccess, message } = useSelector(
      ({ remittances }) => remittances,
    ),
    [coh, setCoh] = useState(0),
    [sales, setSales] = useState(0),
    [expenses, setExpenses] = useState(0),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    message &&
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      const startDate = new Date(year, month - 1, 1);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
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
        }),
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year, auth]);

  useEffect(() => {
    if (collections) {
      const totals = [...collections]?.reduce(
        (total, collection) => {
          if (!collection?.collector && collection.sales) {
            const grossSales = Number(collection?.sales || 0);
            const expenseAmount = Number(collection?.expenses || 0);
            const closingSum = collection?.coh || 0;
            const openingSum = collection?.opening?.sum || 0;

            total.sales += grossSales;
            total.expenses += expenseAmount;
            total.collections += closingSum - openingSum;
          }

          return total;
        },
        { sales: 0, expenses: 0, collections: 0 },
      );

      setSales(totals.sales);
      setExpenses(totals.expenses);
      setCoh(totals.collections);
    }
  }, [collections]);

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex ">
          <span className="white-text mx-3 text-nowrap mt-0">
            Remittances :&nbsp;&nbsp;
            {sales > 0 && (
              <span style={{ color: "white" }} title="Gross sales before expenses">
                Sales:({currency.format(sales)})&nbsp;&nbsp;
              </span>
            )}
            {expenses > 0 && (
              <span style={{ color: "white" }} title="Declared expenses deducted from cash on hand">
                Expenses:({currency.format(expenses)})&nbsp;&nbsp;
              </span>
            )}
            {coh > 0 && (
              <span
                style={{ color: "white" }}
                title="Cash remittance after expenses and floating cash adjustment"
              >
                Collections:({currency.format(coh)})
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <Calendars
          moved={(next) => dispatch(SetMONTH(next))}
          reset={() => dispatch(ResetDATE())}
          month={month}
          year={year}
        />
      </div>
    </MDBView>
  );
};

export default Header;
