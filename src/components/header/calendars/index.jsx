import React from "react";
import { MDBBtn, MDBIcon, MDBBtnGroup } from "mdbreact";
import { Calendar as calendar } from "../../../services/fakeDb";

const CalendarPicker = ({ month, year, prev, next, reset }) => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-based index (Jan = 0)
  const currentYear = today.getFullYear();

  // Check if the displayed month/year is the current one
  const isActiveMonth = year === currentYear && month === currentMonth;

  return (
    <div className="d-flex align-items-center justify-content-center">
      <MDBBtnGroup>
        <MDBBtn
          onClick={next}
          disabled={isActiveMonth}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
        >
          TODAY
        </MDBBtn>
        <MDBBtn
          onClick={prev}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
        >
          <MDBIcon icon="angle-left" style={{ fontSize: "1rem" }} />
        </MDBBtn>
        <MDBBtn color="white" style={{ fontSize: "0.9rem" }} className="m-0">
          {calendar.Months[month]}&nbsp;
          {year}
        </MDBBtn>
        <MDBBtn
          onClick={next}
          disabled={isActiveMonth}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
        >
          <MDBIcon icon="angle-right" style={{ fontSize: "1rem" }} />
        </MDBBtn>
      </MDBBtnGroup>
    </div>
    // <div className="d-flex align-items-center">
    //   <MDBBtnGroup>
    //     <MDBBtn onClick={reset} size="sm" color="white" className="z-depth-0">
    //       TODAY
    //     </MDBBtn>
    //     <MDBBtn onClick={prev} size="sm" color="white" className="z-depth-0">
    //       <MDBIcon icon="angle-left" />
    //     </MDBBtn>

    //     <MDBBtn
    //       onClick={next}
    //       disabled={isActiveMonth} // Disable Next if it's the active month
    //       size="sm"
    //       color="white"
    //       className="z-depth-0"
    //     >
    //       <MDBIcon icon="angle-right" />
    //     </MDBBtn>
    //   </MDBBtnGroup>
    //   <>
    //     <strong className="cursor-pointer h3-responsive">{year}</strong>
    //     &nbsp;
    //     <strong className="cursor-pointer h3-responsive">
    //       {calendar.Months[month]}
    //     </strong>
    //   </>
    // </div>
  );
};

export default CalendarPicker;
