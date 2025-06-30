import { Services } from "../../../../services/fakeDb";
import { MDBRow, MDBCol } from "mdbreact";

const Miscellaneous = ({ data = [] }) => {
  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "1px" }}>Test</th>
            <th style={{ textAlign: "left", padding: "1px" }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {data.map((test, index) => {
            return (
              <tr key={index}>
                <td style={{ padding: "1px" }} className="text-left">
                  <span>{Services.find(test)?.abbreviation}</span>
                </td>
                <td style={{ padding: "1px" }}>
                  <span
                    style={{
                      borderBottom: "1px dotted black",
                      display: "inline-block",
                      width: "100%",
                      minHeight: "1em",
                    }}
                  ></span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Miscellaneous;
