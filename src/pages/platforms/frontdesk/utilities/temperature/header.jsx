import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "./calendar";
import { MDBView, MDBBtn, MDBIcon } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/monitoring/temperature";
import { Calendar as calendar } from "../../../../../services/fakeDb";
import CustomSelect from "../../../../../components/searchables/customSelect";
import "./style.css";
import Swal from "sweetalert2"; // Import Swal for notifications
const today = new Date();

const Header = () => {
  const [month, setMonth] = useState(today.getMonth()),
    [year, setYear] = useState(today.getFullYear()),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ temperatures }) => temperatures
    ), // Adjust selector for ledger data
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId && year && month) {
      dispatch(
        BROWSE({
          token,
          key: {
            branchId: activePlatform?.branchId,
            start: new Date(year, month, 0),
            end: new Date(year, month + 1, 0, 23, 59, 59, 999),
          },
        })
      ).then((result) => {
        if (!result.payload || !result.payload?.length) {
          Swal.fire({
            icon: "warning",
            title: "Ledger Empty",
            text: "No data found for this month. Please generate the ledger.",
            confirmButtonText: "Okay",
          });
        }
      });
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform, month, year]);

  const handlePrint = () => {
    localStorage.setItem("temperature", JSON.stringify(collections));
    window.open(
      "/printout/TempGraph",
      "Temperature Graph",
      "top=100px,left=100px,width=1050px,height=750px" // size of page that will open
    );
  };

  return (
    <MDBView
      cascade
      className="gradient-card-header custom-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
    >
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex ">
          <CustomSelect
            className="ledger-select"
            value={month}
            onChange={(value) => setMonth(Number(value))}
            inputClassName="m-0 p-0"
            preValue={month}
            choices={calendar.Months.map((month, index) => ({
              values: index,
              texts: month,
            }))}
            disabled={isLoading}
          />

          <CustomSelect
            className="ledger-select ml-2"
            value={year}
            onChange={(value) => setYear(Number(value))}
            inputClassName="m-0 p-0"
            preValue={year}
            choices={calendar.Years?.map((year) => ({
              values: year,
              texts: year,
            }))}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="d-flex align-items-center">
        <span className="white-text mx-3 text-nowrap mt-0">Calendars </span>
        <MDBBtn
          type="submit"
          disabled={isLoading}
          color="info"
          className="mb-2"
          rounded
          onClick={() => handlePrint("PRINT")}
        >
          <MDBIcon icon="print" />
        </MDBBtn>
      </div>
      <Calendar month={month} year={year} />
    </MDBView>
  );
};

export default Header;
