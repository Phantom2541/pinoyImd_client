import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/electrolyte";
import { fullName, getAge } from "../../../../../../services/utilities";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";
import Header from "../header";
import TableLoading from "../../../../../../components/tableLoading";
import "../styles.css";

import helpers from "../helpers";
const { dayNames, formatTime, groupByDay, isWeekDays } = helpers;

export default function Chems() {
  const [chems, setChems] = useState([]),
    { collections, isLoading } = useSelector(({ electrolyte }) => electrolyte);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  const groupedChems = groupByDay(chems);

  // Create an array for day names

  const renderGroupedChems = () => {
    return Object.keys(groupedChems).map((day) => {
      const sampleChem = groupedChems[day][0]; // Get one elec item to determine the date
      const d = new Date(sampleChem.createdAt); // Use `createdAt` to get the correct day
      const dayOfWeek = dayNames[d.getDay()]; // Get the day of the week

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="2">
              <strong
                className={
                  isWeekDays(dayOfWeek) ? "text-success" : "text-danger"
                }
              >
                {dayOfWeek} ({day}) {/* Display the day of the week */}
              </strong>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          {groupedChems[day].map((elec, index) => {
            const { customerId, packages, createdAt } = elec;

            const chemDate = new Date(createdAt);
            const h = chemDate.getHours();
            const m = chemDate.getMinutes();
            const timeFormatted = formatTime(h, m); // Format time to standard time

            return (
              <tr key={elec._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId.fullName)}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td> {/* Display formatted time */}
                <td>{packages["23"]}</td>
                <td>{packages["24"]}</td>
                <td>{packages["25"]}</td>
                <td>{packages["28"]}</td>
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
          title="Electrolyte"
          printPath="elec"
        />

        <MDBCardBody className="pb-0">
          {!isLoading ? (
            <MDBTable className="responsive" bordered>
              <thead className="sticky">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>K</th>
                  <th>CL</th>
                  <th>Na</th>
                  <th>iCa</th>

                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>{renderGroupedChems()}</tbody>
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
