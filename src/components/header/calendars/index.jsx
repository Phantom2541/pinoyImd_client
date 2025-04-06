import React from "react";
import { MDBBtn, MDBIcon, MDBBtnGroup } from "mdbreact";
import { Calendar as calendar } from "../../../services/fakeDb";

const CalendarPicker = ({ month, year, moved, reset }) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 0-based index (Jan = 0)
  const currentYear = today.getFullYear();

  // Check if the displayed month/year is the current one
  const isActiveMonth = year === currentYear && month === currentMonth;

  return (
    <div className="d-flex align-items-center justify-content-center">
      <MDBBtnGroup>
        <MDBBtn
          onClick={reset}
          disabled={isActiveMonth}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
        >
          TODAY
        </MDBBtn>
        <MDBBtn
          onClick={() => moved("prev")}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
        >
          <MDBIcon icon="angle-left" style={{ fontSize: "1rem" }} />
        </MDBBtn>
        <MDBBtn color="white" style={{ fontSize: "0.9rem" }} className="m-0">
          {calendar.Months[month - 1]}&nbsp;
          {year}
        </MDBBtn>
        <MDBBtn
          onClick={() => moved("next")}
          disabled={isActiveMonth}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
        >
          <MDBIcon icon="angle-right" style={{ fontSize: "1rem" }} />
        </MDBBtn>
      </MDBBtnGroup>
    </div>
  );
};

export default CalendarPicker;
