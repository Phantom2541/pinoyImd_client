import { MDBTable } from "mdbreact";

export default function Coagulation() {
  return (
    <MDBTable hover small bordered responsive className="mb-0 ">
      <thead>
        <tr>
          <th className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
            Test
          </th>
          <th style={{ fontSize: "1.1rem" }} className="py-0 fw-bold">
            Result
          </th>
          <th className="py-0 fw-bold" style={{ fontSize: "1.1rem" }}>
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            colSpan={3}
            className="py-0 fw-bold"
            style={{ fontSize: "1.1rem" }}
          >
            Prothrombin Time (PT)
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
