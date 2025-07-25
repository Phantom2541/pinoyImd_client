// src/pages/platforms/frontdesk/reports/logbooks/miscellaneous/index.jsx

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/miscellaneous";
import { fullName, getAge } from "../../../../../../services/utilities";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";
import Header from "../header";
import TableLoading from "../../../../../../components/tableLoading";
import helpers from "../helpers";

const { dayNames, formatTime, groupByDay, isWeekDays } = helpers;

export default function Miscellaneous() {
  const [data, setData] = useState([]);
  const { collections, isLoading } = useSelector(({ miscellaneous }) => miscellaneous);

  useEffect(() => {
    setData(collections);
  }, [collections]);

  const grouped = groupByDay(data);

  const renderGrouped = () => {
    return Object.keys(grouped).map((day) => {
      const group = grouped[day];
      const sample = group[0];
      const d = new Date(sample.createdAt);
      const dayOfWeek = dayNames[d.getDay()];

      return (
        <React.Fragment key={day}>
          <tr>
            <td colSpan="8">
              <strong className={isWeekDays(dayOfWeek) ? "text-success" : "text-danger"}>
                {dayOfWeek} ({day})
              </strong>
            </td>
          </tr>
          {group.map((item, index) => {
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
    <MDBCard narrow>
      <Header
        BROWSE={BROWSE}
        RESET={RESET}
        title={"Miscellaneous"}
        printPath="misc"
      />
      <MDBCardBody className="pb-0">
        {!isLoading ? (
          <MDBTable className="responsive" bordered>
            <thead className="sticky">
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
