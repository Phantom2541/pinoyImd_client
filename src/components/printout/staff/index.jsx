import React, { useEffect } from "react";
import { MDBCardBody, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { fullName } from "../../../services/utilities";
import { Policy } from "../../../services/fakeDb";

const Staff = () => {
  const collections = JSON.parse(localStorage.getItem("staffs"));

  // Auto-print pag load
  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
  <style>{`
  @page {
    size: landscape;
    margin: 10mm;
  }
  @media print {
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
    }
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #000;
      padding: 6px;
      text-align: center;
      font-size: 12px;
      word-wrap: break-word;
    }
    th:nth-child(1),
    td:nth-child(1) {
      text-align: left;
    }
  }
`}</style>


      <MDBCardBody>
        <div style={{ fontWeight: "bold", marginBottom: "20px" }}>
          List of Personnel
        </div>
        <div>Annex A</div>
        <div>
          Name of Laboratory:
          <strong> ALPHAMED DIAGNOSTIC LABORATORY - STO. ROSARIO BRANCH</strong>
        </div>
        <div>
          Address of Laboratory:
          <strong> JLO BLDG, B. MENDOZA ST. STO. ROSARIO, CITY OF SAN FERNANDO, PAMPANGA</strong>
        </div>

        <MDBTable bordered>
          <colgroup>
       <col style={{ width: "25%" }} /> {/* Name */}
       <col style={{ width: "15%" }} /> {/* Designation */}
       <col style={{ width: "18%" }} /> {/* Educational Attainment */}
       <col style={{ width: "12%" }} /> {/* PRC Reg. No. */}
       <col style={{ width: "7%" }} />  {/* Valid From */}
       <col style={{ width: "7%" }} />  {/* Valid To */}
       <col style={{ width: "10%" }} /> {/* Date of Birth */}
       <col style={{ width: "6%" }} />  {/* Signature */}
        </colgroup>

          <MDBTableHead>
            <tr>
              <th rowSpan={2}>Name</th>
              <th rowSpan={2}>Designation/Position</th>
              <th rowSpan={2}>Highest Educational Attainment</th>
              <th rowSpan={2}>PRC Reg. No.</th>
              <th colSpan={2}>Valid</th>
              <th rowSpan={2}>Date of Birth (mm/dd/yy)</th>
              <th rowSpan={2}>Signature</th>
            </tr>
            <tr>
              <th>From</th>
              <th>To</th>
            </tr>
          </MDBTableHead>

          <MDBTableBody>
            {collections?.length > 0 ? (
              collections.map((personnels, index) => {
                const { user, contract } = personnels;
                const { prc = { id: "", from: "", to: "" }, hea } = user;

                return (
                  <tr key={`personnel-${index}`}>
                    <td>{index + 1}. {fullName(user?.fullName).toUpperCase()}</td>
                    <td>{Policy.getPositions(Number(contract?.designation))}</td>
                    <td>{hea}</td>
                    <td>{prc.id}</td>
                    <td>{prc?.from?.replace(/-/g, "/")}</td>
                    <td>{prc?.to?.replace(/-/g, "/")}</td>
                    <td>{user?.dob?.replace(/-/g, "/")}</td>
                    <td></td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No Record.
                </td>
              </tr>
            )}
          </MDBTableBody>
        </MDBTable>
      </MDBCardBody>
    </div>
  );
};

export default Staff;
