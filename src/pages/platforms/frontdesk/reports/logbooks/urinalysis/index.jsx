import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/results/laboratory/urinalysis";
import { fullName, getAge } from "../../../../../../services/utilities";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBTable,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
} from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";
import Months from "../../../../../../services/fakeDb/calendar/months";
import Years from "../../../../../../services/fakeDb/calendar/years";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
  ResultInRange,
  ResultInName,
  SpecificGravity,
  Transparency,
  UrineColors,
} from "../../../../../../services/fakeDb";

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
  const [hemas, setChems] = useState([]),
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ urinalysis }) => urinalysis),
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
          token,
          data: {
            branch: onDuty._id,
            month,
            year,
          },
        })
      );
    }
    return () => RESET();
  }, [onDuty, dispatch, token, month, year]);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  // Function to group hemas by the day they were created
  const groupByDay = (hemaData) => {
    return hemaData.reduce((acc, urin) => {
      const createdAt = new Date(urin.createdAt); // assuming `createdAt` field exists
      const day = createdAt.getDate();

      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(urin);
      return acc;
    }, {});
  };

  // Group the hemas by day
  const groupedUrins = groupByDay(hemas);

  const renderGroupedUrin = () => {
    return Object.keys(groupedUrins).map((day) => {
      const sampleUrin = groupedUrins[day][0]; // Get one urin item to determine the date
      const d = new Date(sampleUrin.createdAt); // Use `createdAt` to get the correct day
      const dayOfWeek = dayNames[d.getDay()]; // Get the day of the week

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="18">
              <strong>
                {dayOfWeek} ({day}) {/* Display the day of the week */}
              </strong>
            </td>
          </tr>
          {groupedUrins[day].map((urin, index) => {
            const { ce, pe, me, createdAt, customerId } = urin;

            const urinDate = new Date(createdAt);
            const h = urinDate.getHours();
            const m = urinDate.getMinutes();
            const timeFormatted = formatTime(h, m); // Format time to standard time
            const nonEmptyPackages = Object.entries(ce).filter(
              ([key, value]) => value && value !== 0
            );

            const getInitials = (text) => {
              return text
                ?.split(" ") // Split the string by spaces to get each word
                .map((word) => word[0]) // Get the first letter of each word
                .join(""); // Join the letters together
            };

            return (
              <tr key={urin._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId.fullName)}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td> {/* Display formatted time */}
                <td className="text-center">
                  {getInitials(UrineColors[pe[0]])}/
                  {getInitials(Transparency[pe[1]])}
                </td>
                <td>{SpecificGravity[pe[2]]}</td>
                <td>{PH[pe[3]]}</td>
                <td>
                  {nonEmptyPackages.map(([key, value]) => (
                    <p key={key}>
                      {ResultInName[parseInt(key)]?.substring(0, 3)}:
                      {ResultInRange[value]?.substring(0, 2)}
                    </p>
                  ))}
                </td>
                <td>{MicroscopicInRange[me[0]]?.replace("/hpf", "")}</td>
                <td>{MicroscopicInRange[me[1]]?.replace("/hpf", "")}</td>
                <td>{MicroscopicResultInWord[me[2]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me[3]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me[4]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me[5]]?.substring(0, 1)}</td>
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
    localStorage.setItem("UrinLog", JSON.stringify());
    window.open(
      "/printout/urin",
      "Urinalysis Logbook",
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
          <h3>Urinalysis</h3>
        </MDBCardHeader>
        <MDBCardBody className="pb-0">
          <MDBTable className="responsive">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Time</th>
                <th>Color / Trans</th>
                <th>SG</th>
                <th>PH</th>
                <th>Chemical Reaction</th>
                <th>PUS</th>
                <th>RC</th>
                <th>EC</th>
                <th>MT</th>
                <th>AU</th>
                <th>Bact</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>{renderGroupedUrin()}</tbody>
          </MDBTable>
          <div className="d-flex justify-content-between align-items-center px-4">
            <TableRowCount />
          </div>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}
