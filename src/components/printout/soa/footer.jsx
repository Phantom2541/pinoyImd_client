import React from "react";
import { Legend } from "./legend";

const Footer = ({ menus }) => {
  return (
    <div
      className="mt-3"
      style={{
        borderLeft: "1px solid black",
        borderRight: "1px solid black",
      }}
    >
      <div
        style={{
          background: "rgba(46,110,172,255)",
          height: "1.4rem",
        }}
        className="d-flex align-items-center text-white"
      >
        <span className="ml-2">Legend</span>
      </div>
      <table style={{ marginTop: "0rem" }} className="w-100">
        <thead>
          <tr>
            <th className="fw-bold ">Services</th>
            <th className="fw-bold ">Packages</th>
          </tr>
        </thead>
        <tbody>
          {menus.map(({ _id, packages, abbr }, index) => (
            <tr
              style={{
                borderBottom: "1px solid black",
                borderTop: "1px solid black",
              }}
              key={_id}
            >
              <td style={{ fontWeight: "bold", width: "20%" }}>
                {index + 1}. <strong className="ml-1">{abbr}</strong>
              </td>
              <td>
                <Legend packages={packages} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Footer;
