import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../services/utilities";
import Months from "../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../services/redux/slices/results/laboratory/chemistry";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Format time function as in original
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

export default function ChemsPrint() {
  const [chems, setChems] = useState([]),
    { collections } = useSelector(({ chemistry }) => chemistry),
    [month, setMonth] = useState(""),
    [year, setYear] = useState(""),
    { token, onDuty } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    const _month = JSON.parse(localStorage.getItem("month"));
    const _year = JSON.parse(localStorage.getItem("year"));
    if (token && onDuty?._id) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/chemistry/logbook",
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
    return () => RESET();
  }, [onDuty, dispatch, token]);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  const groupByDay = (chemistryData) =>
    chemistryData.reduce((acc, chem) => {
      const createdAt = new Date(chem.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(chem);
      return acc;
    }, {});

  const groupedChems = groupByDay(chems);

  const renderGroupedChems = () => {
    return Object.keys(groupedChems).map((day) => {
      const sampleChem = groupedChems[day][0];
      const d = new Date(sampleChem.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="14">
              <strong>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedChems[day].map((chem, index) => {
            const { customerId, packages, createdAt } = chem;
            const chemDate = new Date(createdAt);
            const h = chemDate.getHours();
            const m = chemDate.getMinutes();
            const timeFormatted = formatTime(h, m);

            return (
              <tr key={chem._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId.fullName)}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td>
                <td>{packages["9"]}</td>
                <td>{packages["10"]}</td>
                <td>{packages["12"]}</td>
                <td>{packages["13"]}</td>
                <td>{packages["14"]}</td>
                <td>{packages["15"]}</td>
                <td>{packages["16"]}</td>
                <td>
                  {packages["17"] ? Number(packages["17"]).toFixed(2) : ""}
                </td>
                <td>{packages["21"]}</td>
                <td>{packages["20"]}</td>
                <td>{packages["22"]}</td>
              </tr>
            );
          })}
        </React.Fragment>
      );
    });
  };
  console.log(onDuty);

  return (
    <div>
      <Banner company={onDuty?.companyId?.name} branch={onDuty?.name} />

      <h3 className="text-center">
        Chemistry Report for {Months[month - 1]} {year}
      </h3>
      <MDBTable className="responsive">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>RBS</th>
            <th>FBS</th>
            <th>SGPT</th>
            <th>SGOT</th>
            <th>Chole</th>
            <th>Trigly</th>
            <th>HDL</th>
            <th>LDL</th>
            <th>BUN</th>
            <th>CREA</th>
            <th>BUA</th>
          </tr>
        </thead>
        <tbody>{renderGroupedChems()}</tbody>
      </MDBTable>
    </div>
  );
}
