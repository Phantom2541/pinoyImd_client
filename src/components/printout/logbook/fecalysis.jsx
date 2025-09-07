import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../../services/utilities";
import Months from "../../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../../services/redux/slices/diagnostics/laboratory/fecalysis";
import {
  Consistency,
  FecalColor,
  MicroscopicInRange,
} from "../../../services/fakeDb";

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

export default function FecalysisPrint() {
  const [fecalysis, setFecalysis] = useState([]),
    { collections } = useSelector(({ fecalysis }) => fecalysis),
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
          entity: "results/laboratory/fecalysis/logbook",
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
  }, [activePlatform, dispatch, token]);

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
            <td colSpan="9">
              <strong>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedFecalysis[day].map((item, index) => {
            const { customerId, pe, me, remarks, createdAt } = item;
            const itemDate = new Date(createdAt);
            const h = itemDate.getHours();
            const m = itemDate.getMinutes();
            const timeFormatted = formatTime(h, m);

            return (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  <div>{fullName(customerId.fullName)}</div>
                  <small>
                    {getAge(customerId?.dob)} | {customerId?.isMale ? "M" : "F"}
                  </small>
                </td>
                <td>{timeFormatted}</td>
                <td>{FecalColor[pe?.[0]] || "N/A"}</td>
                <td>{Consistency[pe?.[1]] || "N/A"}</td>
                <td>N/A</td>
                <td>{MicroscopicInRange[me?.[1]] || "N/A"}</td>
                <td>{MicroscopicInRange[me?.[2]] || "N/A"}</td>
                <td>{remarks || "N/A"}</td>
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
        className="print-banner"
        company={activePlatform?.branch?.companyId?.name}
        branch={activePlatform?.branch?.name}
      />
      <h4 className="text-center report-title">
        Fecalysis Report for {Months[month - 1]} {year}
      </h4>
      <MDBTable className="logbooks-table">
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
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>{renderGroupedFecalysis()}</tbody>
      </MDBTable>

      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }

          .print-banner {
            margin-bottom: 8mm; 
          }

          .report-title {
            margin: 2mm 0 6mm 0;
            font-size: 14px !important;
            text-align: center;
          }

          .logbooks-table {
            width: 100%;
            border-collapse: collapse;
          }

          .logbooks-table th,
          .logbooks-table td {
            font-size: 11px !important;
            padding: 2px 4px !important;
          }

          .logbooks-table tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
