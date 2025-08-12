import { MDBBtn, MDBIcon, MDBBtnGroup } from "mdbreact";
import { Calendar as calendar } from "../../../services/fakeDb";

const CalendarPicker = ({ month, year, moved, reset, isLoading = false }) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 0-based index (Jan = 0)
  const currentYear = today.getFullYear();

  // Check if the displayed month/year is the current one
  const isActiveMonth = year === currentYear && month === currentMonth;

  return (
    <div className="d-flex align-items-center justify-content-center">
      <MDBBtnGroup style={{ height: "2.3rem" }}>
        <MDBBtn
          onClick={reset}
          disabled={isActiveMonth || isLoading}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
          style={{ borderRight: "1px solid grey" }}
        >
          TODAY
        </MDBBtn>
        <MDBBtn
          onClick={() => moved("prev")}
          disabled={isLoading}
          size="sm"
          className="p-2 m-0 z-depth-0"
          color="white"
        >
          <MDBIcon icon="angle-left" style={{ fontSize: "1rem" }} />
        </MDBBtn>
        <span
          style={{
            fontSize: "0.9rem",
            backgroundColor: "white",
            color: "black",
            padding: "0 20px",
            textAlign: "center",
            boxShadow: "inset 0 0 7px 1px rgba(0,0,0,0.2)",
          }}
          className="d-flex align-items-center "
        >
          {calendar.Months[month - 1]}&nbsp;
          {year}
        </span>
        <MDBBtn
          onClick={() => moved("next")}
          disabled={isActiveMonth || isLoading}
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
