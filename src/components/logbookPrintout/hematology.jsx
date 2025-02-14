import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../services/utilities";
import Months from "../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../services/redux/slices/results/laboratory/hematology"; // Updated slice for Hematology

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

export default function HemaPrint() {
  const [hema, setHema] = useState([]),
    { collections } = useSelector(({ hematology }) => hematology),
    { token, onDuty } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty?._id) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/hematology/logbook",
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
    setHema(collections);
  }, [collections]);

  const groupByDay = (hematologyData) =>
    hematologyData.reduce((acc, item) => {
      const createdAt = new Date(item.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const groupedHema = groupByDay(hema);

  const renderGroupedHema = () => {
    return Object.keys(groupedHema).map((day) => {
      const sampleItem = groupedHema[day][0];
      const d = new Date(sampleItem.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="10">
              <strong>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedHema[day].map((item, index) => {
            const { customerId, cc, dc, rci, bt, esr, apc, createdAt } = item;
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
                <td>{cc[0]}</td>
                <td>{cc[1]}</td>
                <td>{cc[2]}</td>
                <td>{cc[3]}</td>
                <td>{dc["a"]}</td>
                <td>{dc["b"]}</td>
                <td>{dc["c"]}</td>
                <td>{dc["d"]}</td>
                <td>{dc["e"]}</td>
                <td>{rci[0]}</td>
                <td>{rci[1]}</td>
                <td>{rci[2]}</td>
                <td>{rci[3]}</td>
                <td>{bt}</td>
                <td>{esr}</td>
                <td>{apc}</td>
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
        Hematology Report for {Months[month - 1]} {year}
      </h3>
      <MDBTable className="responsive">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            {/* cc */}
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              hct
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              hgb
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              rbc
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              wbc
            </th>
            {/* dc */}
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              seg
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              mono
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              eo
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              stab
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              baso
            </th>
            {/* rci */}
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              mcv
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              mch
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              mchc
            </th>
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              rdw
            </th>
            {/* bt */}
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              bt
            </th>
            {/* esr */}
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              esr
            </th>
            {/* apc */}
            <th
              style={{
                transform: "skewX(10deg)",
              }}
            >
              apc
            </th>
          </tr>
        </thead>
        <tbody>{renderGroupedHema()}</tbody>
      </MDBTable>
    </div>
  );
}
