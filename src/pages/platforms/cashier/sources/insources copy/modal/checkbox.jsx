import { capitalize } from "../../../../../../services/utilities";

const Checkbox = ({
  setChecked = () => {},
  isChecked = () => {},
  value = "",
  _label = "",
}) => {
  return (
    <div>
      <input
        className="form-check-input"
        type="checkbox"
        onClick={() => setChecked(value)}
        checked={isChecked(value)}
        id={value}
      />
      <label
        htmlFor={value}
        className="form-check-label label-table"
        style={{ fontWeight: 300 }}
      >
        {capitalize(_label || value)}
      </label>
    </div>
  );
};

export default Checkbox;
