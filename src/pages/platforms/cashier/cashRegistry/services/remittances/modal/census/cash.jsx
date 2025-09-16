import { currency } from "../../../../../../../../services/utilities";
import { MDBIcon, MDBContainer } from "mdbreact";

export default function Cash({
  fc = 0,
  breakdown,
  gross,
  paymentsSum,
  patients,
}) {
  const cashOnHand = fc + gross - paymentsSum;

  const topData = [
    {
      icon: "user-injured",
      text: "Patients",
      value: patients,
      color: "text-primary",
    },
  ];

  const breakdownData = [
    {
      icon: "money-bill",
      text: "Cash",
      value: currency.format(breakdown?.cash),
    },
    {
      icon: "money-bill",
      text: "Gcash",
      value: currency.format(breakdown?.gcash),
    },
    {
      icon: "money-bill",
      text: "Downpayment",
      value: currency.format(breakdown?.downpayment),
    },
  ];

  return (
    <MDBContainer fluid className="p-3">
      <div>
        {topData.map(({ icon, text, value, color }, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center mb-2"
          >
            <div>
              <MDBIcon icon={icon} className={`${color} mr-2`} />
              {text}
            </div>
            <strong className="text-nowrap">{value}</strong>
          </div>
        ))}

        {/* Cash On Hand section with styling */}
        <div
          className="mt-4 p-3 rounded"
          style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #e0e0e0",
          }}
        >
          <strong>Daily Liquidation Summary</strong>
          <hr />
          <div className="d-flex justify-content-between mb-1">
            <span>Floating Cash</span>
            <b>{currency.format(fc)}</b>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span>+ Gross Sales</span>
            <b>{currency.format(gross)}</b>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span>- Expenses</span>
            <b className="text-danger">({currency.format(paymentsSum)})</b>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <span>
              <strong>Cash On Hand (COH)</strong>
            </span>
            <strong className="text-success" style={{ fontSize: "1.2rem" }}>
              {currency.format(cashOnHand)}
            </strong>
          </div>
        </div>
        <hr />
      </div>
      <strong>Payment Categories</strong>
      <hr />
      {breakdown?.downpayment && (
        <div>
          <strong>Breakdown</strong>
          <hr />
          {breakdownData.map(({ icon, text, value }, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              <div>
                <MDBIcon icon={icon} className="text-primary mr-2" />
                {text}
              </div>
              <strong className="text-nowrap">{value}</strong>
            </div>
          ))}
          <hr />
        </div>
      )}

      <div>
        {Object.entries(breakdown).map(([key, value], idx) => (
          <div
            key={idx}
            className="d-flex justify-content-between align-items-center mb-1"
          >
            <span className="text-capitalize">
              {key === "co" ? "Care Of" : key}
            </span>
            <b>{currency.format(value) || 0}</b>
          </div>
        ))}
      </div>

      <hr />
    </MDBContainer>
  );
}
