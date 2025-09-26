import { MDBTable } from "mdbreact";
import { Pbs } from "../../../../../../../../../services/fakeDb/diagnostics";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
const _rbc = [0, 0, 0, 0, 0];
const WBC = () => {
  const { task, selected } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const { rbc = _rbc } = task;
  const { customerId: patient = {} } = selected;
  const handleChange = (index, value) => {
    const _rbc = [...rbc];
    _rbc[index] = Number(value);

    dispatch(SetTASK({ form: task?.form, task: { ...task, rbc: _rbc } }));
  };
  return (
    <MDBTable small className="mt-n3">
      <thead>
        <tr>
          <th className="text-left">Parameter/Feature</th>
          <th className="text-center">Result</th>
          {rbc[0] ? <th className="text-left">Absolute Count</th> : ""}
          <th className="text-left">Reference</th>
        </tr>
      </thead>
      <tbody>
        {rbc.map((result, index) => {
          const { lo, hi } = Pbs.wbc.getReference(index, patient.dob);
          return (
            <tr>
              <td className="text-left">{Pbs.wbc.titles[index]}</td>
              <td>
                <input
                  type="number"
                  className="sectInput w-100 text-center fw-bold"
                  onChange={(e) => handleChange(index, e.target.value)}
                  value={String(result)}
                  style={{ width: "8rem" }}
                />
              </td>
              {rbc[0] ? (
                <td className="text-center">
                  {Pbs.wbc.computeCount(rbc, index)}
                </td>
              ) : (
                ""
              )}
              <td className="text-left">
                {lo} - {hi} {index > 0 ? "%" : "/ µL"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default WBC;
