import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../../services/utilities";
import Months from "../../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../../services/redux/slices/diagnostics/laboratory/serology";
import { Services } from "../../../services/fakeDb";
import "./table.css"; // external css gaya sa ChemsPrint

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

  const groupByDay = (data) =>
    data.reduce((acc, item) => {
      const createdAt = new Date(item.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const groupedSerology = groupByDay(serology);

  const renderGroupedSerology = () =>
    Object.keys(groupedSerology).map((day) => {
      const sample = groupedSerology[day][0];
      const d = new Date(sample.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="5">
              <strong>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedSerology[day].map((s, index) => {
            const { customerId, packages, createdAt, remarks } = s;
            const date = new Date(createdAt);
            const timeFormatted = formatTime(date.getHours(), date.getMinutes());

            const nonEmptyPackages = Object.entries(packages).filter(
              ([, value]) => value && value !== ""
            );

            return (
              <tr key={s._id}>
                <td>{index + 1}</td>
                <td>
                  <span style={{ whiteSpace: "nowrap" }}>
                    {fullName(customerId?.fullName)}
                  </span>
                  <span>
                    {getAge(customerId?.dob)} |{" "}
                    {customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td>
                <td>
                  {nonEmptyPackages.map(([key, value]) => {
                    const service = Services.find(
                      (srv) => srv._id === key || srv.name === key
                    );
                    return (
                      <p key={key}>
                        {service?.abbreviation ?? service?.name ?? key}: {value}
                      </p>
                    );
                  })}
                </td>
                <td>{remarks || ""}</td>
              </tr>
            );
          })}
        </React.Fragment>
      );
    });

  return (
    <div>
      <Banner
        company={activePlatform?.branch?.companyId?.name}
        branch={activePlatform?.branch?.name}
        className="banner"
      />

      <h3 className="text-center">
        Serology Report for {Months[month - 1]} {year}
      </h3>

      <MDBTable className="responsive logbooks-table">
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

      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }

          .logbooks-table {
            width: 100%;
            border-collapse: collapse;
          }

          .logbooks-table tr th,
          .logbooks-table tr td {
            font-size: 12px !important;
            padding: 1px 3px !important;
          }

          .logbooks-table tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
