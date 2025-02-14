import React from "react";
import { MDBTable } from "mdbreact";
import {
  calculateIndicators,
  findReference,
  formatToSI,
} from "../../../../../services/utilities";

export default function Electrolyte({ task, fontSize }) {
  console.log(fontSize);
  const style = { fontSize: `${fontSize}px` },
    { packages, services, patient, preferences } = task;

  return (
    <MDBTable hover striped bordered responsive className="mb-0 text-center">
      <thead>
        <tr>
          <th className="py-0" />
          <th style={style} className="text-center py-0" colSpan={2}>
            Conventional Unit
          </th>
          <th style={style} className="text-center py-0" colSpan={2}>
            System International Unit
          </th>
        </tr>
        <tr>
          <th style={style} className="py-0 text-left">
            Service
          </th>
          <th style={style} className="py-0">
            Result
          </th>
          <th style={style} className="py-0">
            Reference
          </th>
          <th style={style} className="py-0">
            Result
          </th>
          <th style={style} className="py-0">
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(packages).map(([fk, value], index) => {
          const { name, preference } = services.find(
              ({ id }) => id === Number(fk)
            ),
            nameUppercase = name.toUpperCase(),
            reference = findReference(
              fk,
              patient?.isMale,
              patient?.dob,
              preference,
              preferences
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
                {Number.isInteger(value) ? value : value.toFixed(2)}
              </td>
              <td style={style} className="py-0">
                {!lo ? `< ${hi}` : `${lo} - ${hi}`} {units}
              </td>
              <td style={{ ...style, color }} className="py-0 fw-bold">
                {indicators}
                {formatToSI(
                  nameUppercase,
                  value < 15 ? Number(value.toFixed(2)) : value
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
