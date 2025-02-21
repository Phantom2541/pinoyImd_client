import { MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useEffect, useState } from "react";
import { fullName } from "../../../services/utilities";
import { Roles } from "../../../services/fakeDb";
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

  console.log(personnels);
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
              const { user, employment } = personnel;
              const { prc = { id: "", from: "", to: "" }, hea = "" } = user;

              return (
                <tr
                  key={`personnel-${index}`}
                  style={{ border: "1px solid black" }}
                >
                  <td style={tdStyle}>
                    <p className="m-0 ml-2">{fullName(user.fullName)}</p>
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {Roles.findById(employment.designation)?.name || ""}
                  </td>
                  <td style={tdStyle} className="text-center">
                    {hea}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {prc.id}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {prc.from}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {prc.to}
                  </td>
                  <td className="text-center" style={tdStyle}>
                    {user.dob}
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
