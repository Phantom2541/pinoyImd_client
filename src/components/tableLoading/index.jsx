import React from "react";
import { MDBTable, MDBAnimation, MDBProgress } from "mdbreact";
import "./progress.css";
const array = new Array(5).fill().map((_, index) => index);

function TableLoading() {
  return (
    <MDBTable>
      <tbody>
        {array
          .sort(() => Math.random() - 0.5)
          .map((num, rI) => (
            <tr key={`presetRow-${rI}`}>
              <td key={`presetCol-${rI}`}>
                <div
                  style={{
                    width: `${num * 200 + 100}px`,
                    maxWidth: "100%", // para sa pending
                  }}
                >
                  <MDBAnimation
                    type="flash"
                    infinite
                    delay={`${rI + 1}00ms`}
                    duration="3000ms"
                  >
                    <MDBProgress
                      color="light"
                      value={3000}
                      id="progress-table"
                    ></MDBProgress>
                  </MDBAnimation>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </MDBTable>
  );
}

export default TableLoading;
