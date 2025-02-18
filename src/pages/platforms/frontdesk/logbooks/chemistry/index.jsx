import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/results/laboratory/chemistry";
import { fullName, getAge } from "../../../../../services/utilities";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTable,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
} from "mdbreact";
import TableRowCount from "../../../../../components/pagination/rows";
import Months from "../../../../../services/fakeDb/calendar/months";
import Years from "../../../../../services/fakeDb/calendar/years";

const today = new Date();

const addZero = (i) => {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
};

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Function to convert 24-hour time to 12-hour time with AM/PM
const formatTime = (hours, minutes) => {
  let period = "AM";
  if (hours >= 12) {
    period = "PM";
    hours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
  } else if (hours === 0) {
    hours = 12; // Handle midnight (00:00)
  }
  return `${addZero(hours)}:${addZero(minutes)} ${period}`;
};

export default function Chems() {
  const [chems, setChems] = useState([]),
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ chemistry }) => chemistry),
    { search, pathname } = useLocation(),
    query = new URLSearchParams(search),
    month = query.get("month"),
    year = query.get("year"),
    focusedDay = query.get("focusedDay"),
    history = useHistory(),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty?._id) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/chemistry/logbook",
          data: {
            branch: onDuty._id,
            month,
            year,
          },
          token,
        })
      );
    }
    return () => RESET();
  }, [onDuty, dispatch, token, month, year]);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  // Function to group chems by the day they were created
  const groupByDay = (chemistryData) => {
    return chemistryData.reduce((acc, chem) => {
      const createdAt = new Date(chem.createdAt); // assuming createdAt field exists
      const day = createdAt.getDate();

      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(chem);
      return acc;
    }, {});
  };

  // Group the chems by day
  const groupedChems = groupByDay(chems);

  // Create an array for day names

  const renderGroupedChems = () => {
    return Object.keys(groupedChems).map((day) => {
      const sampleChem = groupedChems[day][0]; // Get one chem item to determine the date
      const d = new Date(sampleChem.createdAt); // Use createdAt to get the correct day
      const dayOfWeek = dayNames[d.getDay()]; // Get the day of the week
      // setChemsPrint(groupedChems);
      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="18">
              <strong>
                {dayOfWeek} ({day}) {/* Display the day of the week */}
              </strong>
            </td>
          </tr>
          {groupedChems[day].map((chem, index) => {
            const { customerId, packages, createdAt } = chem;

            const chemDate = new Date(createdAt);
            const h = chemDate.getHours();
            const m = chemDate.getMinutes();
            const timeFormatted = formatTime(h, m); // Format time to standard time

            return (
              <tr key={chem._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId.fullName)}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td> {/* Display formatted time */}
                <td>{packages["9"]}</td>
                <td>{packages["10"]}</td>
                <td>{packages["12"]}</td>
                <td>{packages["13"]}</td>
                <td>{packages["14"]}</td>
                <td>{packages["15"]}</td>
                <td>{packages["16"]}</td>
                <td>
                  {packages["17"] ? Number(packages["17"])?.toFixed(2) : ""}
                </td>
                <td>{packages["21"]}</td>
                <td>{packages["20"]}</td>
                <td>{packages["22"]}</td>
                <td></td>
              </tr>
            );
          })}
        </React.Fragment>
      );
    });
  };

  const selectToday = () => {
    const params = new URLSearchParams({
      month: today.getMonth() + 1, // Add 1 to match human-readable month format
      year: today.getFullYear(),
    });
    history.push(`${pathname}?${params.toString()}`);
  };

  const isTodaySelected =
    Number(month) === today.getMonth() && Number(year) === today.getFullYear();

  const prev = (clearFocused = true) => {
    let _month = Number(month) === 1 ? 12 : Number(month) - 1, // Adjust the month to be 1-based
      _year = Number(month) === 1 ? Number(year) - 1 : Number(year);

    const params = new URLSearchParams({
      month: _month,
      year: _year,
      ...(!clearFocused && { focusedDay }),
    });

    history.push(`${pathname}?${params.toString()}`);

    if (!clearFocused) dispatch(RESET({ resetCollections: true }));
  };

  const next = (clearFocused = true) => {
    let _month = Number(month) === 12 ? 1 : Number(month) + 1, // Adjust the month to be 1-based
      _year = Number(month) === 12 ? Number(year) + 1 : Number(year);

    const params = new URLSearchParams({
      month: _month,
      year: _year,
      ...(!clearFocused && { focusedDay }),
    });

    history.push(`${pathname}?${params.toString()}`);

    if (!clearFocused) dispatch(RESET({ resetCollections: true }));
  };

  const disablePrevOnLastChoice = () => {
    if (Number(month) === 0 && Number(year) === Years[0]) return true;
    return false;
  };

  const disableNextOnLastChoice = () => {
    if (Number(month) === 11 && Number(year) === Years[Years.length - 1])
      return true;
    return false;
  };
  const handlePrint = () => {
    localStorage.setItem("month", JSON.stringify(month));
    localStorage.setItem("year", JSON.stringify(year));
    window.open(
      "/printout/chem",
      "Chemistry Logbook",
      "top=100px,left=100px,width=1050px,height=750px" // size of page that will open
    );
  };

  return (
    <>
      <MDBCard narrow>
        <MDBCardHeader>
          <div className="d-flex align-items-center justify-content-between">
            <MDBBtnGroup>
              <MDBBtn
                onClick={selectToday}
                size="sm"
                color="white"
                className="z-depth-0"
                disabled={isTodaySelected}
              >
                TODAY
              </MDBBtn>
              <MDBBtn
                onClick={prev}
                disabled={disablePrevOnLastChoice()}
                size="sm"
                color="white"
                className="z-depth-0"
              >
                <MDBIcon icon="angle-left" />
              </MDBBtn>
              <MDBBtn
                onClick={next}
                disabled={disableNextOnLastChoice()}
                size="sm"
                color="white"
                className="z-depth-0"
              >
                <MDBIcon icon="angle-right" />
              </MDBBtn>
            </MDBBtnGroup>
            <strong className="cursor-pointer h3-responsive">{year}</strong>
            &nbsp;
            <strong className="cursor-pointer h3-responsive">
              {Months[month - 1]}{" "}
              {/* Subtract 1 to display the correct month name */}
            </strong>
            {/* Print Button */}
            <MDBBtn color="primary" size="sm" onClick={handlePrint}>
              <MDBIcon icon="print" /> Print
            </MDBBtn>
          </div>
          <h3>Chemistry</h3>
        </MDBCardHeader>
        <MDBCardBody className="pb-0">
          <MDBTable className="responsive">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Time</th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  RBS
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  FBS
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  SGPT
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  SGOT
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  Chole
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  Trigly
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  HDL
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  LDL
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  BUN
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  CREA
                </th>
                <th
                  style={{
                    transform: "skewX(10deg)",
                  }}
                >
                  BUA
                </th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>{renderGroupedChems()}</tbody>
          </MDBTable>
          <div className="d-flex justify-content-between align-items-center px-4">
            <TableRowCount />
          </div>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}
