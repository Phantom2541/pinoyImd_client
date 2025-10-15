import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBIcon, MDBView } from "mdbreact";
import "./style.css";
import {
  BROWSE,
  SetMONTH,
  ResetDATE,
  RESET,
} from "../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import { Calendars } from "../../../../../../components/header";
import { currency, fullName } from "../../../../../../services/utilities";
import MonhtlyReport from "../../../../../../services/utilities/export/excel/monthlyReport";
import { Monthly } from "../../../../../../services/redux/slices/finance/journals/payments";
import Swal from "sweetalert2";
import Months from "../../../../../../services/fakeDb/calendar/months";

const Header = () => {
  const {
      collections: remittances,
      month,
      year,
    } = useSelector(({ remittances }) => remittances),
    { collections: deals, isLoading: isLoadingDeals } = useSelector(
      ({ deals }) => deals
    ),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections: payments, isLoading: isLoadingPayments } = useSelector(
      ({ payments }) => payments
    ),
    [expenses, setExpenses] = useState(0),
    [preExpenses, setPreExpenses] = useState(0),
    [nonCash, setNonCash] = useState(0),
    [sum, setSum] = useState(0),
    [remitted, setRemitted] = useState(0),
    dispatch = useDispatch();

  const disableExport =
    isLoadingDeals || isLoadingPayments || (!deals.length && payments.length);

  console.log(deals, payments);

  useEffect(() => {
    if (deals) {
      const totalSales = deals
        .filter(({ deletedAt }) => !deletedAt)
        .reduce((acc, { amount }) => acc + amount, 0);
      setSum(totalSales);

      const totalPreExpenses = deals
        .filter((item) => !item.deletedAt)
        .reduce(
          (acc, item) =>
            acc + (item?.cart?.reduce((a, b) => a + (b?.capital || 0), 0) || 0),
          0
        );
      setPreExpenses(totalPreExpenses);
    }
  }, [deals]);

  useEffect(() => {
    if (remittances) {
      const totalRemitted = remittances
        .filter((item) => !item.deletedAt)
        .reduce((acc, item) => acc + (item?.coh - item?.opening?.sum), 0);
      setRemitted(totalRemitted);

      const totalExpenses = remittances
        .filter((item) => !item.deletedAt)
        .reduce((acc, item) => acc + (item?.expenses || 0), 0);
      setExpenses(totalExpenses);

      const totalNonCash = remittances
        .filter((item) => !item.deletedAt)
        .reduce((acc, item) => {
          const {
            gcash = 0,
            voucher = 0,
            cheque = 0,
            credit = 0,
          } = item.breakdown || {};
          return acc + (gcash + voucher + cheque + credit);
        }, 0);
      setNonCash(totalNonCash);
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
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  useEffect(() => {
    //payables
    dispatch(
      Monthly({
        token,
        key: {
          branchId: activePlatform?.branchId,
          month,
          year,
        },
      })
    );
  }, [month, year, token, activePlatform?.branchId, dispatch]);

  // Determine balance status and style for remittance only
  let remittedClass = "";
  let balanceMessage = "";

  if (remitted + nonCash + expenses < sum) {
    remittedClass = "text-danger font-weight-bold"; // Dark red for under-remitted
    balanceMessage = "⚠️ Under-remitted";
  } else if (remitted + nonCash + expenses > sum) {
    remittedClass = "text-warning font-weight-bold"; // Dark yellow for over-remitted
    balanceMessage = "⚠️ Over-remitted";
  } else {
    remittedClass = "text-success font-weight-bold"; // Dark green for balanced
    balanceMessage = "✔ Balanced";
  }

  const handleExport = async () => {
    const { isConfirmed } = await Swal.fire({
      title: `Generate Monthly Report for ${Months[month - 1]} ${year}?`,
      html: `
    <p>You're about to create an Excel report that includes <b>three sheets</b>:</p>
    <ul style="text-align: left; margin-left: 30px;">
      <li><b>Patients</b> – complete list of patients recorded for the month</li>
      <li><b>Daily Sales</b> – summary of all sales made each day</li>
      <li><b>Expenses</b> – detailed record of all expenses for the month</li>
    </ul>
    <p>If any of these sheets are missing, it simply means there’s no data available for that section.</p>
    <p>Would you like to continue?</p>
  `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Generate Report",
      cancelButtonText: "Cancel",
    });
    if (!isConfirmed) return;

    // Show loading alert
    Swal.fire({
      title: "Generating Report...",
      text: "Please wait while we prepare your Excel file.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await MonhtlyReport({
        branch:
          activePlatform?.branch?.name || activePlatform?.branch?.displayname,
        deals,
        expenses: payments,
        config: { createdBy: fullName(auth.fullName), month, year },
      });

      Swal.fire({
        icon: "success",
        title: "Export Complete!",
        text: "Your monthly report has been successfully generated.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log("error", error.message);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "Something went wrong while generating the report. Please try again.",
      });
    }
  };

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
          title={`predictable expenses: ${currency.format(preExpenses)}`}
        >
          Collections:{" "}
          <strong className="text-white">{currency.format(sum)}</strong>
        </span>
        |<span> Expenses : {currency.format(expenses)}</span>|
        <span title="Gcash, Voucher, Cheque, Credit">
          Non-Cash: {currency.format(nonCash)}
        </span>
        <span className="mx-3 text-nowrap mt-0">
          + Remitted:{" "}
          <strong className={remittedClass}>{currency.format(remitted)}</strong>{" "}
          ({balanceMessage})
        </span>
        <MDBBtn
          size="sm"
          className="px-2 py-1 p-0"
          color="primary"
          disabled={disableExport}
          title="Export to Excel"
          onClick={handleExport}
          style={{ fontSize: "1.2rem" }}
        >
          <MDBIcon icon="file-excel" />
        </MDBBtn>
      </div>
    </MDBView>
  );
};

export default Header;
