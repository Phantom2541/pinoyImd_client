import { MDBTable } from "mdbreact";
import Protime from "./Protime";
import APTT from "./APTT";
export default function Coagulation({ task }) {
  const { aptt = [], pt = [], data: packages = [] } = task;
  return (
    <MDBTable hover small bordered responsive className="mb-0 ">
      <thead>
        <tr>
          <th className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
            Test
          </th>
          <th
            style={{ fontSize: "1.1rem" }}
            className="py-0 fw-bold text-center"
          >
            Result
          </th>
          <th className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {packages?.includes(53) && <Protime pt={pt} />}
        {packages?.includes(54) && <APTT aptt={aptt} />}
      </tbody>
    </MDBTable>
  );
}
