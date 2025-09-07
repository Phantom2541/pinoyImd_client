import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { fullName, getAge, Banner } from "../../../services/utilities";
import Months from "../../../services/fakeDb/calendar/months";
import { BROWSE, RESET } from "../../../services/redux/slices/diagnostics/laboratory/hematology";
import "./table.css"; // Optional: for any additional table styling

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

export default function HemaPrint() {
  const [hema, setHema] = useState([]);
  const { collections } = useSelector(({ hematology }) => hematology);
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const _month = JSON.parse(localStorage.getItem("month")) || new Date().getMonth() + 1;
    const _year = JSON.parse(localStorage.getItem("year")) || new Date().getFullYear();

    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          entity: "results/laboratory/hematology/logbook",
          data: { branch: activePlatform.branchId, month: _month, year: _year },
          token,
        })
      );
    }

    setMonth(_month);
    setYear(_year);

    return () => dispatch(RESET());
  }, [activePlatform, dispatch, token]);

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

  const renderGroupedHema = () =>
    Object.keys(groupedHema).map((day) => {
      const sampleItem = groupedHema[day][0];
      const d = new Date(sampleItem.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="20">
              <strong>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedHema[day].map((item, index) => {
            const { customerId, cc, dc, rci, bt, esr, apc, createdAt } = item;
            const itemDate = new Date(createdAt);
            const timeFormatted = formatTime(itemDate.getHours(), itemDate.getMinutes());

            return (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>
                  <span style={{ whiteSpace: "nowrap" }}>{fullName(customerId.fullName)}</span>{" "}
                  | {getAge(customerId?.dob)} {customerId?.isMale ? "M" : "F"}
                </td>
                <td>{timeFormatted}</td>
                {/* CC */}
                <td>{cc?.[0] || ""}</td>
                <td>{cc?.[1] || ""}</td>
                <td>{cc?.[2] || ""}</td>
                <td>{cc?.[3] || ""}</td>
                {/* DC */}
                <td>{dc?.["a"] || ""}</td>
                <td>{dc?.["b"] || ""}</td>
                <td>{dc?.["c"] || ""}</td>
                <td>{dc?.["d"] || ""}</td>
                <td>{dc?.["e"] || ""}</td>
                {/* RCI */}
                <td>{rci?.[0] || ""}</td>
                <td>{rci?.[1] || ""}</td>
                <td>{rci?.[2] || ""}</td>
                <td>{rci?.[3] || ""}</td>
                {/* Others */}
                <td>{bt || ""}</td>
                <td>{esr || ""}</td>
                <td>{apc || ""}</td>
                <td></td>
              </tr>
            );
          })}
        </React.Fragment>
      );
    });

  return (
    <div>
      {/* Banner on top, outside table */}
      <Banner
        company={activePlatform?.branch?.companyId?.name}
        branch={activePlatform?.branch?.name}
        className="banner"
      />

      <h3 className="text-center">
        Hematology Report for {Months[month - 1]} {year}
      </h3>

      <MDBTable className="responsive logbooks-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Time</th>
            <th>hct</th>
            <th>hgb</th>
            <th>rbc</th>
            <th>wbc</th>
            <th>seg</th>
            <th>mono</th>
            <th>eo</th>
            <th>stab</th>
            <th>baso</th>
            <th>mcv</th>
            <th>mch</th>
            <th>mchc</th>
            <th>rdw</th>
            <th>bt</th>
            <th>esr</th>
            <th>apc</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>{renderGroupedHema()}</tbody>
      </MDBTable>

      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .banner {
            display: block;
            text-align: center;
            margin-bottom: 10px;
          }

          .logbooks-table {
            width: 100%;
            border-collapse: collapse;
          }

          .logbooks-table tr th,
          .logbooks-table tr td {
            font-size: 10px !important;
            padding: 1px 3px !important;
          }

          .logbooks-table tr {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
