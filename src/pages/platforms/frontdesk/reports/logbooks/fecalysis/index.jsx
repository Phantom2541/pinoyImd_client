import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/fecalysis";
import { fullName, getAge } from "../../../../../../services/utilities";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";
import {
  Consistency,
  FecalColor,
  MicroscopicInRange,
} from "../../../../../../services/fakeDb";
import Header from "../header";
import TableLoading from "../../../../../../components/tableLoading";
import "../styles.css";

import helpers from "../helpers";
const { dayNames, formatTime, groupByDay, isWeekDays } = helpers;

export default function Chems() {
  const [hemas, setChems] = useState([]),
    { collections, isLoading } = useSelector(({ fecalysis }) => fecalysis);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  // Group the hemas by day
  const groupedFecal = groupByDay(hemas);

  const renderGroupedUrin = () => {
    return Object.keys(groupedFecal).map((day) => {
      const sampleUrin = groupedFecal[day][0];
      const d = new Date(sampleUrin.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="18">
              <strong
                className={
                  isWeekDays(dayOfWeek) ? "text-success" : "text-danger"
                }
              >
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {groupedFecal[day].map((fecal, index) => {
            const { pe, me, createdAt, customerId, remarks } = fecal;

            // Debug
            console.log("Fecal ME data:", me, fecal._id);

            const fecalDate = new Date(createdAt);
            const h = fecalDate.getHours();
            const m = fecalDate.getMinutes();
            const timeFormatted = formatTime(h, m);

            return (
              <tr key={fecal._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId.fullName)}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td>
                <td>{FecalColor[pe[0]]}</td> {/* Color */}
                <td>{Consistency[pe[1]]}</td> {/* Consistency */}
                <td>{MicroscopicInRange[me?.[0]] || "N/A"}</td> {/* PUS */}
                <td>{me?.length > 3 ? MicroscopicInRange[me[1]] : "N/A"}</td> {/* pH */}
                <td>{MicroscopicInRange[me?.[1]] || "N/A"}</td> {/* Mucus */}
                <td>{MicroscopicInRange[me?.[2]] || "N/A"}</td> {/* Occult Blood */}
                <td>{remarks || "N/A"}</td> {/* Remarks */}
              </tr>
            );
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <MDBCard narrow>
        <Header
          BROWSE={BROWSE}
          RESET={RESET}
          title={"Fecalysis"}
          printPath="feca"
        />

        <MDBCardBody className="pb-0">
          {!isLoading ? (
            <MDBTable className="responsive" bordered>
              <thead className="sticky">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Color</th>
                  <th>Consistency</th>
                  <th>PUS</th>
                  <th>pH</th>
                  <th>MUCUS</th>
                  <th>Occult Blood</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>{renderGroupedUrin()}</tbody>
            </MDBTable>
          ) : (
            <TableLoading />
          )}
          <div className="d-flex justify-content-between align-items-center px-4">
            <TableRowCount />
          </div>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}
