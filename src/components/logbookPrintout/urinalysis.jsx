import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../services/utilities";
import Months from "../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../services/redux/slices/results/laboratory/urinalysis"; // Updated slice for Urinalysis
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
  ResultInRange,
  ResultInName,
  SpecificGravity,
  Transparency,
  UrineColors,
} from "../../services/fakeDb";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const addZero = (i) => (i < 10 ? "0" + i : i);
const formatTime = (hours, minutes) => {
  let period = "AM";
  if (hours >= 12) {
    period = "PM";
    hours = hours > 12 ? hours - 12 : hours;
  } else if (hours === 0) {
    hours = 12;
  }
  return `${addZero(hours)}:${addZero(minutes)} ${period}`;
};

export default function UrinalysisPrint() {
  const [urinalysis, setUrinalysis] = useState([]),
    { collections } = useSelector(({ urinalysis }) => urinalysis),
    { token, onDuty } = useSelector(({ auth }) => auth),
    [month, setMonth] = useState(""),
    [year, setYear] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    const _month = JSON.parse(localStorage.getItem("month"));
    const _year = JSON.parse(localStorage.getItem("year"));
    if (token && onDuty?._id) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/urinalysis/logbook",
          data: {
            branch: onDuty._id,
            month: _month,
            year: _year,
          },
          token,
        })
      );
    }
    setMonth(_month);
    setYear(_year);
    return () => {
      dispatch(RESET());
    };
  }, [onDuty, dispatch, token, month, year]);

  useEffect(() => {
    setUrinalysis(collections);
  }, [collections]);

  const groupByDay = (urinalysisData) =>
    urinalysisData.reduce((acc, item) => {
      const createdAt = new Date(item.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const groupedUrinalysis = groupByDay(urinalysis);

  const renderGroupedUrinalysis = () => {
    return Object.keys(groupedUrinalysis).map((day) => {
      const sampleItem = groupedUrinalysis[day][0];
      const d = new Date(sampleItem.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="18">
              <strong>
                {dayOfWeek} ({day}) {/* Display the day of the week */}
              </strong>
            </td>
          </tr>
          {groupedUrinalysis[day].map((urin, index) => {
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

  return (
    <div>
      <Banner company={onDuty?.companyId?.name} branch={onDuty?.name} />
      <h3 className="text-center">
        Urinalysis Report for {Months[month - 1]} {year}
      </h3>
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
        <tbody>{renderGroupedUrinalysis()}</tbody>
      </MDBTable>
    </div>
  );
}
