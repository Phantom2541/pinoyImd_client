import { MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useEffect, useState } from "react";
import { dateFormat, fullName } from "../../../services/utilities";
import { Policy } from "../../../services/fakeDb";
import Header from "./header";

const PersonnelPrintOut = () => {
  const [personnels, setPersonnels] = useState([]);

  useEffect(() => {
    setPersonnels(JSON.parse(localStorage.getItem("personnels")));
  }, []);

  const tdStyle = {
    border: "1px solid black",
    fontWeight: 400,
    fontSize: "1.1rem",
  };

  const thStyle = {
    border: "1px solid black",
    height: "20px",
  };

  return (
    <div className="m-4">
      <Header />

      <table
        style={{ border: "1px solid black", width: "100%" }}
        className="mt-4"
      >
        <MDBTableHead>
          <tr style={{ border: "1px solid black" }}>
            <th rowSpan={2} className="text-center" style={thStyle}>
              Name
            </th>
            <th rowSpan={2} className="text-center" style={thStyle}>
              Designation/Position
            </th>
            <th rowSpan={2} className="text-center" style={thStyle}>
              Highest
              <br /> Educational
              <br /> Attainment
            </th>
            <th rowSpan={2} className="text-center" style={thStyle}>
              PRC Reg. No.
            </th>
            <th colSpan={2} className="text-center" style={thStyle}>
              Valid
            </th>
            <th rowSpan={2} className="text-center" style={thStyle}>
              Date of Birth <br />
              (yr/mm/dd)
            </th>
          </tr>
          <tr>
            <th className="text-center" style={thStyle}>
              From
            </th>
            <th className="text-center" style={thStyle}>
              To
            </th>
          </tr>
        </MDBTableHead>

        <MDBTableBody>
          {personnels.length > 0 ? (
            personnels.map((personnel, index) => {
              const { user, contract } = personnel;
              const { prc = { id: "", from: "", to: "" }, hea = "" } = user;

              return (
                <tr
                  key={`personnel-${index}`}
                  style={{ border: "1px solid black" }}
                >
                  <td style={tdStyle}>
                    <p className="m-0 ml-2">
                      {fullName(user.fullName).toUpperCase()}
                    </p>
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {Policy.getRole(contract?.designation)}
                    {contract?.designation}
                  </td>
                  <td style={tdStyle} className="text-center">
                    {hea.toUpperCase()}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {prc.id}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {dateFormat(prc.from)}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {dateFormat(prc.to)}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {dateFormat(user.dob)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>No Record.</td>
            </tr>
          )}
        </MDBTableBody>
      </table>
    </div>
  );
};

export default PersonnelPrintOut;
