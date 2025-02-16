import { MDBTableBody, MDBTableHead } from "mdbreact";
import React, { useEffect, useState } from "react";
import { fullName } from "../../services/utilities";
import { Roles } from "../../services/fakeDb";

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
      <h5 className="text-center font-weight-bold">List of Personnel</h5>
      <div>
        <h5 className="font-weight-bold">Annex A</h5>
        <div
          className="d-flex justify-items-center"
          style={{ marginTop: "-8px" }}
        >
          <h5 style={{ fontWeight: 400 }}>Name of labaratory</h5>
          <h5 className="ml-5" style={{ fontWeight: 400 }}>
            : HEALTH-WIZ MEDICAL AND DIAGNOSTIC CENTER
          </h5>
        </div>

        <div
          className="d-flex justify-items-center"
          style={{ marginTop: "-8px" }}
        >
          <h5 style={{ fontWeight: 400 }}>Address of labaratory </h5>
          <h5 className="ml-4" style={{ fontWeight: 400 }}>
            : 096 QUEZON ST., F. C. OTIC, CARRANGLAN, NUEVA ECIJA
          </h5>
        </div>
      </div>

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
              const { prc = { id: "", from: "", to: "" } } = user;

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
                    College (static)
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
