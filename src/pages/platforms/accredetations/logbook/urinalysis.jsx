import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../../../services/utilities";
import Months from "../../../../services/fakeDb/calendar/months";
import { BROWSE, RESET } from "../../../../services/redux/slices/diagnostics/laboratory/urinalysis";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
  ResultInRange,
  ResultInName,
  SpecificGravity,
  Transparency,
  UrineColors,
} from "../../../../services/fakeDb";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
  const dispatch = useDispatch();
  const { collections } = useSelector(({ urinalysis }) => urinalysis);
  const { token, activePlatform } = useSelector(({ auth }) => auth);

  const [urinalysis, setUrinalysis] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // Fetch logbook data
  useEffect(() => {
    let storedMonth = parseInt(JSON.parse(localStorage.getItem("month")));
    let storedYear = parseInt(JSON.parse(localStorage.getItem("year")));

    const safeMonth = storedMonth >= 1 && storedMonth <= 12 ? storedMonth : new Date().getMonth() + 1;
    const safeYear = storedYear >= 2000 ? storedYear : new Date().getFullYear();

    setMonth(safeMonth);
    setYear(safeYear);

    if (!token || !activePlatform?.branchId) {
      console.warn("Cannot fetch Urinalysis logbook: missing token or branchId", {
        token,
        branchId: activePlatform?.branchId,
      });
      return;
    }

    dispatch(
      BROWSE({
        entity: "results/laboratory/urinalysis/logbook",
        data: {
          branch: activePlatform.branchId,
          month: safeMonth,
          year: safeYear,
        },
        token,
      })
    );

    return () => dispatch(RESET());
  }, [dispatch, token, activePlatform]);

  // Sync collections to local state
  useEffect(() => {
    setUrinalysis(collections || []);
  }, [collections]);

  const groupByDay = (data) =>
    data.reduce((acc, item) => {
      const day = new Date(item.createdAt).getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

  const groupedUrinalysis = groupByDay(urinalysis);

  const getInitials = (text) => text?.split(" ").map((word) => word[0]).join("");

  const renderGroupedUrinalysis = () =>
    Object.keys(groupedUrinalysis).map((day) => {
      const sampleItem = groupedUrinalysis[day][0];
      const d = new Date(sampleItem.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="18">
              <strong>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedUrinalysis[day].map((urin, index) => {
            const { ce, pe, me, createdAt, customerId } = urin;
            const urinDate = new Date(createdAt);
            const timeFormatted = formatTime(urinDate.getHours(), urinDate.getMinutes());
            const nonEmptyPackages = Object.entries(ce || {}).filter(([_, value]) => value && value !== 0);

            return (
              <tr key={urin._id}>
                <td>{index + 1}</td>
                <td>
                  <span style={{ whiteSpace: "nowrap" }}>{fullName(customerId?.fullName)}</span>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td>
                <td className="text-center">
                  {getInitials(UrineColors[pe?.[0]])}/{getInitials(Transparency[pe?.[1]])}
                </td>
                <td>{SpecificGravity[pe?.[2]]}</td>
                <td>{PH[pe?.[3]]}</td>
                <td>
                  {nonEmptyPackages.map(([key, value]) => (
                    <span key={key}>
                      {ResultInName[parseInt(key)]?.substring(0, 3)}:{ResultInRange[value]?.substring(0, 2)}{" "}
                    </span>
                  ))}
                </td>
                <td>{MicroscopicInRange[me?.[0]]?.replace("/hpf", "")}</td>
                <td>{MicroscopicInRange[me?.[1]]?.replace("/hpf", "")}</td>
                <td>{MicroscopicResultInWord[me?.[2]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me?.[3]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me?.[4]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me?.[5]]?.substring(0, 1)}</td>
                <td></td>
              </tr>
            );
          })}

          <style>
            {`
              @media print {
                @page {
                  size: landscape;
                }
                .logbooks-table tr td,
                .logbooks-table tr th {
                  font-size: .8rem !important;
                }
              }
              .logbooks-table tr th,
              .logbooks-table tr td {
                padding: 0 5px !important;
              }
            `}
          </style>
        </React.Fragment>
      );
    });

  return (
    <div>
      <Banner company={activePlatform?.branch?.companyId?.name} branch={activePlatform?.branch?.name} />

      {/* Month/Year Header + Print Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1rem 0" }}>
        <h3>
          Urinalysis Report for {Months[month - 1]} {year}
        </h3>
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print
        </button>
      </div>

      <MDBTable className="responsive logbooks-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>C / T</th>
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
