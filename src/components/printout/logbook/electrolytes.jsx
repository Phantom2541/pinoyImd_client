import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../../services/utilities";
import Months from "../../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../../services/redux/slices/results/laboratory/electrolyte"; // Adjusted slice for Electrolytes

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

export default function ElectrolytesPrint() {
  const [electrolytes, setElectrolytes] = useState([]),
    { collections } = useSelector(({ electrolyte }) => electrolyte),
        { token, activePlatform } = useSelector(({ auth }) => auth),
    [month, setMonth] = useState(""),
    [year, setYear] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    const _month = JSON.parse(localStorage.getItem("month"));
    const _year = JSON.parse(localStorage.getItem("year"));
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/electrolyte/logbook",
          data: {
            branch: activePlatform?.branchId,
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
  }, [activePlatform, dispatch, token, month, year]);

  useEffect(() => {
    setElectrolytes(collections);
  }, [collections]);

  const groupByDay = (electrolyteData) =>
    electrolyteData.reduce((acc, item) => {
      const createdAt = new Date(item.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const groupedElectrolytes = groupByDay(electrolytes);

  const renderGroupedElectrolytes = () => {
    return Object.keys(groupedElectrolytes).map((day) => {
      const sampleItem = groupedElectrolytes[day][0];
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
          {groupedElectrolytes[day].map((item, index) => {
            const { customerId, packages, createdAt } = item;
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
                <td>{packages["23"] || "N/A"}</td>
                <td>{packages["24"] || "N/A"}</td>
                <td>{packages["25"] || "N/A"}</td>
                <td>{packages["28"] || "N/A"}</td>
              </tr>
            );
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <div>
      <Banner
        company={activePlatform?.companyId?.name}
        branch={activePlatform?.name}
      />
      <h3 className="text-center">
        Electrolytes Report for {Months[month - 1]} {year}
      </h3>
      <MDBTable className="responsive">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Na (Sodium)</th>
            <th>K (Potassium)</th>
            <th>Cl (Chloride)</th>
            <th>iCa (Calcium)</th>
          </tr>
        </thead>
        <tbody>{renderGroupedElectrolytes()}</tbody>
      </MDBTable>
    </div>
  );
}
