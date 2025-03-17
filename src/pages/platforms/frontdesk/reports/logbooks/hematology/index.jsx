import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/hematology";
import { fullName, getAge } from "../../../../../../services/utilities";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";
import Header from "../header";
import TableLoading from "../../../../../../components/tableLoading";
import "../styles.css";

import helpers from "../helpers";
const { groupByDay, formatTime, isWeekDays, dayNames } = helpers;

export default function Chems() {
  const [hemas, setChems] = useState([]),
    { collections, isLoading } = useSelector(({ hematology }) => hematology);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  const groupedChems = groupByDay(hemas);

  // Create an array for day names
  const valueChecker = (value) => value || "";
  const renderGroupedHema = () => {
    return Object.keys(groupedChems).map((day) => {
      const sampleChem = groupedChems[day][0]; // Get one hema item to determine the date
      const d = new Date(sampleChem.createdAt); // Use `createdAt` to get the correct day
      const dayOfWeek = dayNames[d.getDay()]; // Get the day of the week

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="20">
              <strong
                className={
                  isWeekDays(dayOfWeek) ? "text-success" : "text-danger"
                }
              >
                {dayOfWeek} ({day}) {/* Display the day of the week */}
              </strong>
            </td>
          </tr>
          {groupedChems[day].map((hema, index) => {
            const {
              cc,
              dc = {},
              rci,
              apc,
              bt,
              esr,
              createdAt,
              customerId,
            } = hema;
            //console.log(hema);
            console.log(dc);
            const chemDate = new Date(createdAt);
            const h = chemDate.getHours();
            const m = chemDate.getMinutes();
            const timeFormatted = formatTime(h, m); // Format time to standard time

            return (
              <tr key={hema._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId?.fullName || {})}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td> {/* Display formatted time */}
                <td>{valueChecker(cc[0])}</td>
                <td>{valueChecker(cc[1])}</td>
                <td>{valueChecker(cc[2])}</td>
                <td>{valueChecker(cc[3])}</td>
                <td>{valueChecker(dc["a"]) || ""}</td>
                <td>{valueChecker(dc["b"])}</td>
                <td>{valueChecker(dc["c"])}</td>
                <td>{valueChecker(dc["d"])}</td>
                <td>{valueChecker(dc["e"])}</td>
                <td>{valueChecker(rci[0])}</td>
                <td>{valueChecker(rci[1])}</td>
                <td>{valueChecker(rci[2])}</td>
                <td>{valueChecker(rci[3])}</td>
                <td>{bt}</td>
                <td>{esr}</td>
                <td>{apc}</td>
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
          title={"Hematology"}
          printPath="hema"
        />
        <MDBCardBody className="pb-0">
          {!isLoading ? (
            <MDBTable className="responsive" bordered>
              <thead className="sticky">
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
