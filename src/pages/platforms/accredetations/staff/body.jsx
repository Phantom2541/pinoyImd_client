import {  useSelector } from "react-redux";
import {
  MDBTableHead,
  MDBTableBody,
  MDBCardBody,
  MDBTable,
} from "mdbreact";
import { Policy } from "../../../../services/fakeDb";
import { fullName } from "../../../../services/utilities/";


const Body = () => {
  const { collections    } = useSelector(    ({ personnels }) => personnels  );

  
  return (
    <>
        <MDBCardBody>
        <div style={{ textAlign: "center", fontWeight: "bold", marginBottom: "20px" }}>
          List of Personnel
        </div>
        <div>Annex A</div>
        <div>
          Name of Laboratory: <strong>ALPHAMED DIAGNOSTIC LABORATORY - STO. ROSARIO BRANCH</strong>
        </div>
        <div>
          Address of Laboratory: <strong>JLO BLDG, B. MENDOZA ST. STO. ROSARIO, CITY OF SAN FERNANDO, PAMPANGA</strong>
        </div>

        <MDBTable bordered>
          <MDBTableHead>
            <tr>
              <th rowSpan={2} className="text-center">Name</th>
              <th rowSpan={2} className="text-center">Designation/Position</th>
              <th rowSpan={2} className="text-center">
                Highest <br /> Educational <br /> Attainment
              </th>
              <th rowSpan={2} className="text-center">PRC Reg. No.</th>
              <th colSpan={2} className="text-center">Valid</th>
              <th rowSpan={2} className ="text-center">
                Date of Birth <br /> (mm/dd/yy)
              </th>
              <th rowSpan={2} className="text-center">Signature</th>
            </tr>
            <tr>
              <th className="text-center">From</th>
              <th className="text-center">To</th>
            </tr>
          </MDBTableHead>

          <MDBTableBody>
            {collections.length > 0 ? (
              collections.map((personnels, index) => {
                const { user, contract } = personnels;
                const { prc = { id: "", from: "", to: "" }, hea } = user;

                return (
                  <tr key={`personnel-${index}`}>
                    <td>{index + 1}. {fullName(user?.fullName).toUpperCase()}</td>
                    <td className="text-center">{Policy.getPositions(Number(contract?.designation))}</td>
                    <td>{hea}</td>
                    <td className="text-center">{prc.id}</td>
                    <td className="text-center">{prc?.from?.replace(/-/g, "/")}</td>
                    <td className="text-center">{prc?.to?.replace(/-/g, "/")}</td>
                    <td className="text-center">{user?.dob?.replace(/-/g, "/")}</td>
                    <td></td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No Record.</td>
              </tr>
            )}
          </MDBTableBody>
        </MDBTable>
      </MDBCardBody>
    </>
  );
};

export default Body;
