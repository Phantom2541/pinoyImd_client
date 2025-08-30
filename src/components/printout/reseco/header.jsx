import { currency } from "../../../services/utilities";

export default function Header({
  physician = "",
  source = "",
  gross = 0,
  rebate = 0,
}) {
  return (
    <div className="px-1 mt-2">
      <div className="d-flex justify-content-between">
        <h5 style={{ fontSize: "18px" }}>
          <span className="fw-bold mr-1">Source:</span>
          <span>{source}</span>
        </h5>
        <h5 style={{ fontSize: "18px" }}>
          <span className="fw-bold mr-1">Physician:</span>
          <span>{physician}</span>
        </h5>
      </div>
      <div className="d-flex justify-content-between">
        <h5 style={{ fontSize: "18px" }}>
          <span className="fw-bold mr-1">Gross:</span>
          <span>{currency.format(gross)}</span>
        </h5>
        <h5 style={{ fontSize: "18px" }}>
          <span className="fw-bold mr-1">Rebate:</span>
          <span>{currency.format(rebate)}</span>
        </h5>
      </div>
    </div>
  );
}
