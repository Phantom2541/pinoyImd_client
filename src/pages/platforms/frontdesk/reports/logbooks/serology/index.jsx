import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/serology";
import { fullName, getAge } from "../../../../../../services/utilities";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";

import { Services } from "../../../../../../services/fakeDb";
import Header from "../header";
import TableLoading from "../../../../../../components/tableLoading";
import "../styles.css";

import helpers from "../helpers";
const { dayNames, formatTime, groupByDay, isWeekDays } = helpers;

export default function Chems() {
  const [chems, setChems] = useState([]),
    { collections, isLoading } = useSelector(({ serology }) => serology);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  // Function to group chems by the day they were created

  // Group the chems by day
  const groupedChems = groupByDay(chems);

  // Function to filter and display only non-empty services and results
  const renderGroupedChems = () => {
    return Object.keys(groupedChems).map((day) => {
      const sampleChem = groupedChems[day][0]; // Get one chem item to determine the date
      const d = new Date(sampleChem.createdAt); // Use `createdAt` to get the correct day
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
          {groupedChems[day].map((chem, index) => {
            const { customerId, packages, createdAt } = chem;

            const chemDate = new Date(createdAt);
            const h = chemDate.getHours();
            const m = chemDate.getMinutes();
            const timeFormatted = formatTime(h, m); // Format time to standard time

            // Filter the packages to show only those with a value
            const nonEmptyPackages = Object.entries(packages).filter(
              ([key, value]) => value && value !== ""
            );

            return (
              <React.Fragment key={chem._id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <h6>{fullName(customerId.fullName)}</h6>
                    <span>
                      {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                    </span>
                  </td>
                  <td>{timeFormatted}</td> {/* Display formatted time */}
                  <td>
                    {nonEmptyPackages.map(([key, value]) => {
                      //console.log(nonEmptyPackages);
                      const service = Services.find(key);
                      return (
                        <React.Fragment key={key}>
                          <p>
                            {" "}
                            {service.abbreviation != null
                              ? service.abbreviation
                              : service.name}
                            : {value}
                          </p>
                        </React.Fragment>
                      );
                    })}
                  </td>
                </tr>
              </React.Fragment>
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
          title={"Serology"}
          printPath="sero"
        />
        <MDBCardBody className="pb-0">
          {!isLoading ? (
            <MDBTable className="responsive" bordered>
              <thead className="sticky">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Service</th>
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
