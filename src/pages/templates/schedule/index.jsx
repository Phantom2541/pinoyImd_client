import React from "react";
import "./style.css";

import SIGNATURE from "./../../../assets/templateSampleSignature.png";

export default function Schedule() {
  return (
    <div className="template-schedule-section">
      <div className="template-schedule-container">
        <div className="schedule-template-header">
          <div className="schedule-header-logo">
            <h2>SMART CARE-POLYCLINIC AND DIAGNOSTIC CENTER</h2>
            <span>Gulod St., San Pedro, Gen. Tinio, Nueva Ecija</span>
          </div>
          <div className="schedule-header-date">
            <h3>S C H E D U L E</h3>
            <span>July 1 – 15, 2025</span>
          </div>
        </div>

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
              {/* {[
                "1\nT",
                "2\nW",
                "3\nTh",
                "4\nF",
                "5\nS",
                "6\nSun",
                "7\nM",
                "8\nT",
                "9\nW",
                "10\nTh",
                "11\nF",
                "12\nS",
                "13\nSun",
                "14\nM",
                "15\nT",
              ].map((date, idx) => (
                <th key={idx} className="template-th-line">
                  {date.split("\n")[0]}
                  <br />
                  {date.split("\n")[1]}
                </th>
              ))} */}
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

        <div className="template-schedule-legend">
          <span className="template-schedule-legend-title">Legend:</span>
          <span>
            <strong>7</strong> = 7am - 5pm (Clinical Chemistry)
          </span>
          <span>
            <strong>CM</strong> = 8am - 3pm Clinical Microscopy
          </span>
          <span>
            <strong>HM</strong> = 8am - 3pm Hematology
          </span>
          <span>
            <strong>SR</strong> = 8am - 3pm Serology
          </span>
        </div>

        <div className="template-schedule-signatures">
          {[
            {
              name: "Debralene Gay R. Pajarrillaga, RMT",
              title: "Chief Medical Technologist",
            },
            {
              name: "Tomas B. Pajarrillaga Jr., RMT, RN, MSIT",
              title: "Administrator",
            },
            {
              name: "Nick R. Fernandez, MD, FPSP",
              title: "Pathologist",
            },
          ].map((person, idx) => (
            <div key={idx} className="template-schedule-signature-container">
              <span className="template-schedule-signature-checked">
                Checked By:
              </span>

              <div className="template-schedule-signature-info">
                <img src={SIGNATURE} alt="signature" />
                <span> {person.name}</span>
                <em>{person.title}</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
