import { MDBInput, MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import { Pbs } from "../../../../../../../../../services/fakeDb/diagnostics";
const _platelet = {
  count: 0,
  pma: "",
};
const Platelets = () => {
  const { task, selected } = useSelector(({ validator }) => validator);
  const { customerId: patient = {} } = selected;
  const { platelet = _platelet } = task;
  const { lo, hi } = Pbs.platelet.getReference(patient.dob);
  return (
    <>
      <MDBTable small className="mt-n3">
        <thead>
          <tr>
            <th className="text-left">Parameter/Feature</th>
            <th>Result</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-left">Platelet Count</td>
            <td>
              <input
                type="number"
                className="sectInput w-100 text-center fw-bold"
                style={{ width: "8rem" }}
              />
            </td>
            <td>
              {lo.toLocaleString()}-{hi.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td className="text-left">Platelet Morphology / Abnormalities:</td>
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
    </>
  );
};

export default Platelets;
