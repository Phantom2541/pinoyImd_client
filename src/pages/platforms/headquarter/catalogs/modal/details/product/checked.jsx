const Checked = ({ label, isChecked = false }) => {
  return (
    <div>
      <span style={{ fontWeight: 500 }}>{label}:</span>
      <div>
        <input
          className="form-check-input"
          type="checkbox"
          id={"fit-yes"}
          checked={isChecked}
        />
        <label htmlFor={`fit-yes`} className="label-table ml-1">
          Yes
        </label>
      </div>
    </div>
  );
};

export default Checked;
