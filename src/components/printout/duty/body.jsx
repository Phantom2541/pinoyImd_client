import { MDBCardBody } from "mdbreact";
import { fullName } from "../../../services/utilities";
import Footer from "./footer";

const Body = ({ selected }) => {
  const { breakdown = [], isFirstSched, month, year } = selected || {};
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const daysInSchedule = isFirstSched ? 15 : lastDayOfMonth - 15;
  const startDay = isFirstSched ? 1 : 16;
  const dayHeaders = Array.from(
    { length: daysInSchedule },
    (_, i) => startDay + i
  );
  const weekHeaders = Array.from({ length: daysInSchedule }, (_, i) => {
    const date = new Date(year, month - 1, startDay + i); // month is zero-based
    return date.toLocaleDateString("en-US", { weekday: "short" }); // 'Mon', 'Tue', etc.
  });

  return (
    <MDBCardBody>
      <table className="template-schedule-table">
        <thead>
          <tr>
            <th rowSpan="2">EMPLOYEE</th>
            {dayHeaders.map((day, index) => (
              <th key={index} className="text-center">
                {day}
              </th>
            ))}
          </tr>
          <tr>
            {weekHeaders.map((day, index) => (
              <th key={index} className="text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {breakdown.length > 0
            ? breakdown.map(({ eid, sched }, rowIdx) => (
                <tr key={rowIdx}>
                  <td
                    style={{
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {fullName(eid.fullName)}
                  </td>
                  {sched.map((val, colIdx) => {
                    const value = val ? val : "RO";
                    const isOff = value === "O" || value === "RO";
                    return (
                      <td
                        style={{
                          fontWeight: isOff ? 500 : 400,
                          textAlign: "center",
                        }}
                        key={colIdx}
                        className={isOff ? "template-schedule-red" : ""}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            : new Array(5).fill("").map((_, index) => (
                <tr key={index}>
                  <td style={{ height: "2.1rem" }}></td>
                  {new Array(daysInSchedule).fill("").map((_, index) => (
                    <td key={index}></td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>

      <Footer />
    </MDBCardBody>
  );
};

export default Body;
