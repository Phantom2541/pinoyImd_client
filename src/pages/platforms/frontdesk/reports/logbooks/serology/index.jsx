import React, { useState, useEffect, useCallback } from "react";
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
  const [chems, setChems] = useState([]);
  const [showDetails, setShowDetails] = useState(false); // Example toggle state

  const { collections, isLoading } = useSelector(({ serology }) => serology);

  // Wrapped toggle using useCallback to avoid dependency warnings
  const toggle = useCallback(() => {
    setShowDetails((prev) => !prev);
  }, []);

  useEffect(() => {
    setChems(collections);
    // Example: You might want to auto-toggle details on data load
    toggle(); // Will not cause a warning now
  }, [collections, toggle]);

  const groupedChems = groupByDay(chems);

  const renderGroupedChems = () => {
    return Object.keys(groupedChems).map((day) => {
      const sampleChem = groupedChems[day][0];
      const d = new Date(sampleChem.createdAt);
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
          {groupedChems[day].map((chem, index) => {
            const { customerId, packages, createdAt } = chem;

            const chemDate = new Date(createdAt);
            const h = chemDate.getHours();
            const m = chemDate.getMinutes();
            const timeFormatted = formatTime(h, m);

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
                  <td>{timeFormatted}</td>
                  <td>
                    {nonEmptyPackages.map(([key, value]) => {
                      const service = Services.find(key);
                      return (
                        <p key={key}>
                          {service.abbreviation != null
                            ? service.abbreviation
                            : service.name}
                          : {value}
                        </p>
                      );
                    })}
                  </td>
                  <td>
                    {/* Optional toggle UI */}
                    <button onClick={toggle} className="btn btn-sm btn-outline-info">
                      {showDetails ? "Hide" : "Show"} Details
                    </button>
                    {showDetails && <p className="mt-2">Extra info here...</p>}
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
  );
}
