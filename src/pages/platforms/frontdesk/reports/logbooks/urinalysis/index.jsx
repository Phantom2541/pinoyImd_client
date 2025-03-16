import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../../services/redux/slices/diagnostics/laboratory/urinalysis";
import { fullName, getAge } from "../../../../../../services/utilities";
import { MDBCard, MDBCardBody, MDBTable } from "mdbreact";
import TableRowCount from "../../../../../../components/pagination/rows";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
  ResultInRange,
  ResultInName,
  SpecificGravity,
  Transparency,
  UrineColors,
} from "../../../../../../services/fakeDb";
import Header from "../header";
import TableLoading from "../../../../../../components/tableLoading";
import helpers from "../helpers";
const { dayNames, formatTime, groupByDay, isWeekDays } = helpers;

export default function Chems() {
  const [hemas, setChems] = useState([]),
    { collections, isLoading } = useSelector(({ urinalysis }) => urinalysis);

  useEffect(() => {
    setChems(collections);
  }, [collections]);

  // Group the hemas by day
  const groupedUrins = groupByDay(hemas);

  const renderGroupedUrin = () => {
    return Object.keys(groupedUrins).map((day) => {
      const sampleUrin = groupedUrins[day][0]; // Get one urin item to determine the date
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
          {groupedUrins[day].map((urin, index) => {
            const { ce, pe, me, createdAt, customerId } = urin;

            const urinDate = new Date(createdAt);
            const h = urinDate.getHours();
            const m = urinDate.getMinutes();
            const timeFormatted = formatTime(h, m); // Format time to standard time
            const nonEmptyPackages = Object.entries(ce).filter(
              ([key, value]) => value && value !== 0
            );

            const getInitials = (text) => {
              return text
                ?.split(" ") // Split the string by spaces to get each word
                .map((word) => word[0]) // Get the first letter of each word
                .join(""); // Join the letters together
            };

            return (
              <tr key={urin._id}>
                <td>{index + 1}</td>
                <td>
                  <h6>{fullName(customerId?.fullName || {})}</h6>
                  <span>
                    {getAge(customerId?.dob)}|{customerId?.isMale ? "M" : "F"}
                  </span>
                </td>
                <td>{timeFormatted}</td> {/* Display formatted time */}
                <td className="text-center">
                  {getInitials(UrineColors[pe[0]])}/
                  {getInitials(Transparency[pe[1]])}
                </td>
                <td>{SpecificGravity[pe[2]]}</td>
                <td>{PH[pe[3]]}</td>
                <td>
                  {nonEmptyPackages.map(([key, value]) => (
                    <p key={key}>
                      {ResultInName[parseInt(key)]?.substring(0, 3)}:
                      {ResultInRange[value]?.substring(0, 2)}
                    </p>
                  ))}
                </td>
                <td>{MicroscopicInRange[me[0]]?.replace("/hpf", "")}</td>
                <td>{MicroscopicInRange[me[1]]?.replace("/hpf", "")}</td>
                <td>{MicroscopicResultInWord[me[2]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me[3]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me[4]]?.substring(0, 1)}</td>
                <td>{MicroscopicResultInWord[me[5]]?.substring(0, 1)}</td>
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
          title={"Urinalysis"}
          printPath="urin"
        />
        <MDBCardBody className="pb-0">
          {!isLoading ? (
            <MDBTable className="responsive" bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Color / Trans</th>
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
