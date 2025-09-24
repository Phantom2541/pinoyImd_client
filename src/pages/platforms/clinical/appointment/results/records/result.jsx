import { MDBBadge } from "mdbreact";
import { Services, Templates } from "../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { SetDIAGNOSTIC } from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { getDepartment } from "../../../../../../services/utilities";

const Result = ({ form: formTxt, index, obj }) => {
  const { diagnostic, selected } = useSelector(
    ({ appointments }) => appointments
  );
  const dispatch = useDispatch();
  const { packages, dealId } = obj;

  const _packages = Array.isArray(packages)
    ? obj.packages
    : Object.keys(packages || {}).map(Number);

  const { department: dept = "" } = selected;
  const department = getDepartment(dept);

  const form = Templates.getComponentIndex(formTxt, department);

  const handleCheck = () => {
    const _diagnostic = { ...diagnostic };
    if (!_diagnostic[dealId]?.length) {
      _diagnostic[dealId] = [];
    }
    let forms = [...(_diagnostic[dealId] || [])];

    if (forms?.includes(form)) {
      forms.splice(forms.indexOf(form), 1);
    } else {
      forms.push(form);
    }

    if (forms.length === 0) {
      delete _diagnostic[dealId];
    } else {
      _diagnostic[dealId] = forms;
    }

    dispatch(SetDIAGNOSTIC(_diagnostic));
  };

  return (
    <tr key={index}>
      <td style={{ verticalAlign: "middle" }}>
        <input
          className="form-check-input"
          type="checkbox"
          onChange={handleCheck}
          checked={!!diagnostic[dealId]?.includes(form)}
          id={`${formTxt}-${index}-${obj?._id}`}
        />
        <label
          htmlFor={`${formTxt}-${index}-${obj?._id}`}
          className="form-check-label label-table"
        >
          {formTxt}
        </label>
      </td>
      <td>
        {Services.whereIn(_packages).map(({ abbreviation }, index) => (
          <MDBBadge
            pill
            key={`${abbreviation}-service-${index}`}
            className="pt-1"
          >
            {abbreviation}
          </MDBBadge>
        ))}
      </td>
    </tr>
  );
};

export default Result;
