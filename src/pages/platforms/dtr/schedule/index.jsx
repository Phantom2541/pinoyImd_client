import React from "react";
import "./style.css";

import Header from "./header";
import Footer from "./footer";
import Legend from "./legend";

export default function Schedule() {
  return (
    <div className="template-schedule-section">
      <div className="template-schedule-container">
        <Header />
        <table className="template-schedule-table">
          <thead>
            <tr>
              <th rowSpan="2">EMPLOYEE</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>6</th>
              <th>7</th>
              <th>8</th>
              <th>9</th>
              <th>10</th>
              <th>11</th>
              <th>12</th>
              <th>13</th>
              <th>14</th>
              <th>15</th>
            </tr>
            <tr>
              <th>T</th>
              <th>W</th>
              <th>Th</th>
              <th>F</th>
              <th>S</th>
              <th>Sun</th>
              <th>M</th>
              <th>T</th>
              <th>W</th>
              <th>Th</th>
              <th>F</th>
              <th>S</th>
              <th>Sun</th>
              <th>N</th>
              <th>T</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Debralene Gay R. Pajarrillaga",
                [
                  "7",
                  "7",
                  "7",
                  "7",
                  "O",
                  "O",
                  "7",
                  "7",
                  "7",
                  "7",
                  "O",
                  "O",
                  "O",
                  "7",
                  "7",
                ],
              ],
              [
                "Tomas B. Pajarrillaga Jr.",
                [
                  "SR",
                  "SR",
                  "0",
                  "SR",
                  "7",
                  "O",
                  "SR",
                  "SR",
                  "SR",
                  "0",
                  "0",
                  "SR",
                  "O",
                  "0",
                  "SR",
                ],
              ],
              [
                "Limuel John Manlusoc",
                [
                  "CM",
                  "CM",
                  "CM",
                  "0",
                  "0",
                  "O",
                  "CM",
                  "CM",
                  "0",
                  "CM",
                  "CM",
                  "CM",
                  "O",
                  "CM",
                  "CM",
                ],
              ],
              [
                "John Michael Nabong",
                [
                  "HM",
                  "HM",
                  "0",
                  "0",
                  "SR",
                  "O",
                  "HM",
                  "HM",
                  "HM",
                  "HM",
                  "HM",
                  "HM",
                  "O",
                  "0",
                  "HM",
                ],
              ],
              [
                "John Anthony Pajarrillaga",
                [
                  "0",
                  "0",
                  "SR",
                  "0",
                  "7",
                  "O",
                  "0",
                  "0",
                  "0",
                  "0",
                  "SR",
                  "0",
                  "O",
                  "0",
                  "0",
                ],
              ],
            ].map(([name, schedule], rowIdx) => (
              <tr key={rowIdx}>
                <td>{name}</td>
                {schedule.map((val, colIdx) => (
                  <td
                    key={colIdx}
                    className={val === "O" ? "template-schedule-red" : ""}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Legend />
        <Footer />
      </div>
    </div>
  );
}
