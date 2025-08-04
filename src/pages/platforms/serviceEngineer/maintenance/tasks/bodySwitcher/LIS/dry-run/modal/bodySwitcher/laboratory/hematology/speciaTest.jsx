import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";

const _troupe = {
  retic: 0,
  esr: 0,
};

export default function SpecialTest() {
  const { task } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();
  const { retic, esr } = task.troupe;

  const handleChange = (key, value) => {
    dispatch(
      SetTASK({
        form: task?.form,
        task: { ...task, troupe: { ...troupe, [key]: value } },
      })
    );

    dispatch(SetPARAMS({ key: "troupe", value: { ...troupe, [key]: value } }));
  };
  const { troupe = _troupe, packages } = task;
  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-1">Category</th>
          <th className="py-1">Result</th>
          <th className="py-1">Reference</th>
        </tr>
      </thead>
      <tbody>
        {packages.includes(62) && (
          <tr>
            <td className="py-1">Reticulocytes</td>
            <td className="py-1">
              <input
                type="number"
                value={retic}
                onChange={(e) => handleChange("retic", e.target.value)}
                className="w-100 text-center fw-bold"
              />
            </td>
            <td className="py-1">0.5-1.5%</td>
          </tr>
        )}
        {packages.includes(63) && (
          <tr>
            <td className="py-1">ESR</td>
            <td className="py-1">
              <input
                type="number"
                value={esr}
                onChange={(e) => handleChange("esr", e.target.value)}
                className="w-100 text-center fw-bold"
              />
            </td>
            <td className="py-1">0-15 mm/hr</td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
}
