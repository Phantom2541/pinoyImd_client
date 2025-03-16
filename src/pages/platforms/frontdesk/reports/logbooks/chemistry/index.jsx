import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "./../../../../../../services/redux/slices/diagnostics/laboratory/chemistry.js";
import { fullName, getAge } from "../../../../../../services/utilities";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";

import TableLoading from "../../../../../../components/tableLoading/index.jsx";
import Header from "../header.jsx";
import helpers from "../helpers.js";
import "../styles.css";

export default function Chems() {
  const [chems, setChems] = useState([]),
    { collections, isLoading } = useSelector(({ chemistry }) => chemistry);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  // Group the chems by day
  const groupedChems = helpers.groupByDay(chems);

  const renderGroupedChems = () => {
    return Object.keys(groupedChems).map((day) => {
      const sampleChem = groupedChems[day][0]; // Get one chem item to determine the date
      const d = new Date(sampleChem.createdAt); // Use createdAt to get the correct day
      const dayOfWeek = helpers.dayNames[d.getDay()]; // Get the day of the week
      const chems = groupedChems[day];
      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="18">
              <strong
                className={
                  helpers.isWeekDays(dayOfWeek) ? "text-success" : "text-danger"
                }
              >
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {chems.map((chem, index) => {
            const { customerId, packages, createdAt } = chem;
            const chemDate = new Date(createdAt);
            const h = chemDate.getHours();
            const m = chemDate.getMinutes();
            const timeFormatted = helpers.formatTime(h, m); // Format time to standard time

            return (
              <tr key={chem._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId?.fullName || {})}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td> {/* Display formatted time */}
                <td>{packages["9"]}</td>
                <td>{packages["10"]}</td>
                <td>{packages["12"]}</td>
                <td>{packages["13"]}</td>
                <td>{packages["14"]}</td>
                <td>{packages["15"]}</td>
                <td>{packages["16"]}</td>
                <td>
                  {packages["17"] ? Number(packages["17"])?.toFixed(2) : ""}
                </td>
                <td>{packages["21"]}</td>
                <td>{packages["20"]}</td>
                <td>{packages["22"]}</td>
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
        <Header BROWSE={BROWSE} RESET={RESET} title={"Chemistrys"} />

        <MDBCardBody className="pb-0">
          {!isLoading ? (
            <MDBTable className="responsive" bordered>
              <thead className="sticky ">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>RBS</th>
                  <th>FBS</th>
                  <th>SGPT</th>
                  <th>SGOT</th>
                  <th>Chole</th>
                  <th>Trigly</th>
                  <th>HDL</th>
                  <th>LDL</th>
                  <th>BUN</th>
                  <th>CREA</th>
                  <th>BUA</th>
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
