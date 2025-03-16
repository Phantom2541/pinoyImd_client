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

  // Create an array for day names

  const renderGroupedUrin = () => {
    return Object.keys(groupedFecal).map((day) => {
      const sampleUrin = groupedFecal[day][0]; // Get one fecal item to determine the date
      const d = new Date(sampleUrin.createdAt); // Use `createdAt` to get the correct day
      const dayOfWeek = dayNames[d.getDay()]; // Get the day of the week

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="18">
              <strong
                className={
                  isWeekDays(dayOfWeek) ? "text-success" : "text-danger"
                }
              >
                {dayOfWeek} ({day}) {/* Display the day of the week */}
              </strong>
            </td>
          </tr>
          {groupedFecal[day].map((fecal, index) => {
            const { pe, me, createdAt, customerId } = fecal;

            const fecalDate = new Date(createdAt);
            const h = fecalDate.getHours();
            const m = fecalDate.getMinutes();
            const timeFormatted = formatTime(h, m); // Format time to standard time

            return (
              <tr key={fecal._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId.fullName)}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td> {/* Display formatted time */}
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
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>color</th>
                  <th>consistensy</th>
                  <th>PUS</th>
                  <th>RBC</th>
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
