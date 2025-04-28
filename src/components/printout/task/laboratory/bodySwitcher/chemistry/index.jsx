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

  console.log("task :xxxx", task);

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
        {Object.entries(packages).map(([fk, value], index) => {
          const { name, preference, range } = services?.find(
              ({ id }) => id === Number(fk)
            ),
            nameUppercase = name?.toUpperCase(),
            reference = findReference(
              fk,
              patient?.isMale,
              patient?.dob,
              preference,
              range
            ),
            { lo, hi, units } = reference,
            indicators = calculateIndicators(reference, value),
            color = value < lo ? "blue" : value > hi && "red",
            SIReference = !lo
              ? `< ${formatToSI(nameUppercase, hi)}`
              : `${formatToSI(nameUppercase, lo)} - ${formatToSI(
                  nameUppercase,
                  hi
                )}`;

          return (
            <tr key={`${fk}-${index}`}>
              <td style={style} className="py-0 text-left text-uppercase">
                {name}
              </td>
              <td style={{ ...style, color }} className="py-0 fw-bold">
                {indicators}
                {/* {Number.isInteger(value) ? value?.toFixed(2) : value} */}
                {parseFloat(value) % 1 === 0
                  ? value
                  : (parseFloat(value) * 10) % 10 === 0
                  ? parseFloat(value).toFixed(1)
                  : value}
              </td>
              <td className="py-1">
                {!lo ? `< ${hi}` : `${lo} - ${hi}`} {units}
              </td>
              <td style={{ ...style, color }} className="py-0 fw-bold">
                {indicators}
                {formatToSI(
                  nameUppercase,
                  value < 15 ? Number(value).toFixed(2) : value
                )}
              </td>
              <td style={style} className="py-0">
                {SIReference}&nbsp;
                {formatToSI(nameUppercase)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
