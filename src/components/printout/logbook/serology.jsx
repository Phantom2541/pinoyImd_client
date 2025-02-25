import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../../services/utilities";
import Months from "../../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../../services/redux/slices/results/laboratory/serology"; // Updated slice for Serology
import { Services } from "../../../services/fakeDb";

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

export default function SerologyPrint() {
  const [serology, setSerology] = useState([]),
    { collections } = useSelector(({ serology }) => serology),
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
          entity: "results/laboratory/serology/logbook",
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
    setSerology(collections);
  }, [collections]);

  const groupByDay = (serologyData) =>
    serologyData.reduce((acc, serology) => {
      const createdAt = new Date(serology.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(serology);
      return acc;
    }, {});

  const groupedSerology = groupByDay(serology);

  const renderGroupedSerology = () => {
    return Object.keys(groupedSerology).map((day) => {
      const sampleSerology = groupedSerology[day][0];
      const d = new Date(sampleSerology.createdAt);
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
          {groupedSerology[day].map((serology, index) => {
            const { customerId, packages, createdAt } = serology;
            const serologyDate = new Date(createdAt);
            const h = serologyDate.getHours();
            const m = serologyDate.getMinutes();
            const timeFormatted = formatTime(h, m);
            const nonEmptyPackages = Object.entries(packages).filter(
              ([key, value]) => value && value !== ""
            );

            return (
              <React.Fragment key={serology._id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <h6>{fullName(customerId.fullName)}</h6>
                    <span>
                      {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                    </span>
                  </td>
                  <td>{timeFormatted}</td> {/* Display formatted time */}
                  <td>
                    {nonEmptyPackages.map(([key, value]) => {
                      //console.log(nonEmptyPackages);
                      const service = Services.find(key);
                      return (
                        <React.Fragment key={key}>
                          <p>
                            {" "}
                            {service.abbreviation != null
                              ? service.abbreviation
                              : service.name}
                            : {value}
                          </p>
                        </React.Fragment>
                      );
                    })}
                  </td>
                </tr>
              </React.Fragment>
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
        Serology Report for {Months[month - 1]} {year}
      </h3>
      <MDBTable className="responsive">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>Service</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>{renderGroupedSerology()}</tbody>
      </MDBTable>
    </div>
  );
}
