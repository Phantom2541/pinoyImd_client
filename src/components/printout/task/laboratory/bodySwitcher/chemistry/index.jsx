import React from "react";
import { MDBTable } from "mdbreact";
import {
  calculateIndicators,
  findReference,
  formatToSI,
} from "../../../../../../services/utilities";

export default function Chemistry({ task, fontSize }) {
  const style = { fontSize: `${fontSize}px` },
    { packages, services, patient } = task;

  return (
    <MDBTable hover striped bordered responsive className="mb-0 text-center">
      <thead>
        <tr>
          <th
            style={{ ...style, fontSize: "1.2rem" }}
            rowSpan={2}
            className="py-0 text-left fw-bold align-middle text-center"
          >
            Service
          </th>
          <th
            style={{ ...style, fontSize: "1.1rem" }}
            className="text-center py-0 fw-bold"
            colSpan={2}
          >
            Conventional Unit
          </th>
          <th
            style={{ ...style, fontSize: "1.1rem" }}
            className="text-center py-0 fw-bold"
            colSpan={2}
          >
            System International Unit
          </th>
        </tr>
        <tr>
          <th style={{ ...style, fontSize: "1.1rem" }} className="py-0 fw-bold">
            Result
          </th>
          <th style={{ ...style, fontSize: "1.1rem" }} className="py-0 fw-bold">
            Reference
          </th>
          <th style={{ ...style, fontSize: "1.1rem" }} className="py-0 fw-bold">
            Result
          </th>
          <th style={{ ...style, fontSize: "1.1rem" }} className="py-0 fw-bold">
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(packages).map(([fk, res], index) => {
          const parts = String(res).split(/([<>])/);
          const value = parts[2] ?? parts[0];
          const operator = parts[2] ? parts[1] : "";
          const {
              name = "",
              preference,
              references,
            } = services?.find(({ id }) => id === Number(fk)) || {},
            nameUppercase = name?.toUpperCase(),
            reference = findReference(
              fk,
              patient?.isMale,
              patient?.dob,
              preference,
              references
            ),
            { lo, hi, units } = reference,
            indicators = calculateIndicators(reference, value),
            color = value < lo ? "blue" : value > hi && "red",
            SI_value = formatToSI(nameUppercase, value),
            CI_value =
              parseFloat(value) < 5
                ? parseFloat(value).toFixed(2) // always 2 decimals if < 5
                : Number.isInteger(value)
                ? value // whole number
                : parseFloat(value).toFixed(1),
            SI_reference = !lo
              ? `< ${String(formatToSI(nameUppercase, hi)).replace(
                  /\.0+$|(\.\d*?)0+$/,
                  "$1"
                )}`
              : `${String(formatToSI(nameUppercase, lo)).replace(
                  /\.0+$|(\.\d*?)0+$/,
                  "$1"
                )} - ${String(formatToSI(nameUppercase, hi)).replace(
                  /\.0+$|(\.\d*?)0+$/,
                  "$1"
                )}`;

          return (
            <tr key={`${fk}-${index}`}>
              <td style={style} className="py-0 text-left text-uppercase">
                {name}
              </td>
              <td style={{ ...style, color }} className="py-0 fw-bold">
                {indicators}
                {operator} {CI_value}
              </td>
              <td className="py-1">
                {!lo ? `< ${hi}` : `${lo} - ${hi}`} {units}
              </td>
              <td style={{ ...style, color }} className="py-0 fw-bold">
                {indicators}
                {operator} {SI_value}
              </td>
              <td style={style} className="py-0">
                {SI_reference}&nbsp;
                {Number(SI_value) === Number(CI_value)
                  ? units
                  : formatToSI(nameUppercase)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
