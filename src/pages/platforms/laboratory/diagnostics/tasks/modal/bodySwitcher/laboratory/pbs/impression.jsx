import { MDBTable } from "mdbreact";

const Impression = () => {
  return (
    <MDBTable small className="mt-n3">
      <thead>
        <tr>
          <th className="text-left">Parasites</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-left">Inclusion Bodies:</td>
          <td colSpan={2}>
            <input
              type="text"
              className="sectInput w-100 text-center fw-bold"
              style={{ width: "8rem" }}
            />
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default Impression;
