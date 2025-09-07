import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fullName, getAge, Banner } from "../../../services/utilities";
import Months from "../../../services/fakeDb/calendar/months";
import {
  BROWSE,
  RESET,
} from "../../../services/redux/slices/diagnostics/laboratory/miscellaneous";

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

export default function MiscellaneousPrint() {
  const dispatch = useDispatch();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [data, setData] = useState([]);
  const { collections } = useSelector(({ miscellaneous }) => miscellaneous);
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  useEffect(() => {
    const _month = JSON.parse(localStorage.getItem("month"));
    const _year = JSON.parse(localStorage.getItem("year"));
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/miscellaneous/logbook",
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
  }, [dispatch, token, activePlatform]);

  useEffect(() => {
    setData(collections);
  }, [collections]);

  const groupByDay = (records) =>
    records.reduce((acc, item) => {
      const createdAt = new Date(item.createdAt);
      const day = createdAt.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const grouped = groupByDay(data);

  const renderGrouped = () => {
    return Object.keys(grouped).map((day) => {
      const sample = grouped[day][0];
      const d = new Date(sample.createdAt);
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
          {grouped[day].map((item, index) => {
            const { createdAt, customerId, results, troupe } = item;
            const testTime = formatTime(
              new Date(createdAt).getHours(),
              new Date(createdAt).getMinutes()
            );

            return (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId?.fullName || {})}</h6>
                  <span>
                    {getAge(customerId?.dob)} | {customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{testTime}</td>
                <td>{results?.ns1 ? "Positive" : "Negative"}</td>
                <td>{results?.igg ? "Positive" : "Negative"}</td>
                <td>{results?.igm ? "Positive" : "Negative"}</td>
                <td>{troupe?.kit}</td>
                <td>{troupe?.lot}</td>
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
        company={activePlatform?.branch?.companyId?.name}
        branch={activePlatform?.branch?.name}
      />
      <h3 className="text-center">
        Miscellaneous Report for {Months[month - 1]} {year}
      </h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>NS1</th>
            <th>IgG</th>
            <th>IgM</th>
            <th>Kit</th>
            <th>Lot</th>
          </tr>
        </thead>
        <tbody>{renderGrouped()}</tbody>
      </table>
         <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
          }

          .logbooks-table th,
          .logbooks-table td {
            font-size: 10px !important;
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
