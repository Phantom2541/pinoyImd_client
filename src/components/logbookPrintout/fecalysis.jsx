import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../services/utilities";
import Months from "../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../services/redux/slices/results/laboratory/fecalysis"; // Updated slice for Fecalysis
import {
  Consistency,
  FecalColor,
  MicroscopicInRange,
} from "../../services/fakeDb";

const today = new Date();
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const month = JSON.parse(localStorage.getItem("month"));
const year = JSON.parse(localStorage.getItem("year"));
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

export default function FecalysisPrint() {
  const [fecalysis, setFecalysis] = useState([]),
    { collections } = useSelector(({ fecalysis }) => fecalysis),
    { token, onDuty } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty?._id) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/fecalysis/logbook",
          data: {
            branch: onDuty._id,
            month,
            year,
          },
          token,
        })
      );
    }
    return () => {
      dispatch(RESET());
    };
  }, [onDuty, dispatch, token, month, year]);

  useEffect(() => {
    setFecalysis(collections);
  }, [collections]);

  const groupByDay = (fecalysisData) =>
    fecalysisData.reduce((acc, item) => {
      const createdAt = new Date(item.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const groupedFecalysis = groupByDay(fecalysis);

  const renderGroupedFecalysis = () => {
    return Object.keys(groupedFecalysis).map((day) => {
      const sampleItem = groupedFecalysis[day][0];
      const d = new Date(sampleItem.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="8">
              <strong>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedFecalysis[day].map((item, index) => {
            const { customerId, pe, me, createdAt } = item;
            const itemDate = new Date(createdAt);
            const h = itemDate.getHours();
            const m = itemDate.getMinutes();
            const timeFormatted = formatTime(h, m);

            return (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId.fullName)}</h6>
                  <span>
                    {getAge(customerId?.dob)} | {customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td>
                <td>{FecalColor[pe[0]]}</td>
                <td>{Consistency[pe[1]]}</td>
                <td>{MicroscopicInRange[me[0]]}</td>
                <td>{MicroscopicInRange[me[1]]}</td>
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
        Fecalysis Report for {Months[month - 1]} {year}
      </h3>
      <MDBTable className="responsive">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Color</th>
            <th>Consistency</th>
            <th>pH</th>
            <th>Mucus</th>
            <th>Occult Blood</th>
          </tr>
        </thead>
        <tbody>{renderGroupedFecalysis()}</tbody>
      </MDBTable>
    </div>
  );
}
