import { Duty } from "../../../../services/fakeDb";

const Legend = () => {
  return (
    <div>
      <span className="template-schedule-legend-title mb-n3 d-block">
        Legend:
      </span>
      <div className="template-schedule-legend d-flex align-items-center justify-content-around ">
        {Duty.collections.map(({ code, label, time }, index) => (
          <span key={index} style={{ margin: "0 15px", textAlign: "center" }}>
            <strong>{code}</strong> = {time} {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Legend;
