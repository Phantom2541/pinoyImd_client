import { currency } from "../../../../../../../../services/utilities";
import { MDBIcon, MDBContainer } from "mdbreact";

export default function Cash({
  selected,
  breakdown,
  gross,
  paymentsSum,
  patients,
}) {
  const topData = [
    {
      icon: "user-injured",
      text: "Patients",
      value: patients,
      color: "text-primary",
    },
    {
      icon: "hand-holding-usd",
      text: "Floating Cash",
      value: currency.format(selected?.opening?.sum),
      color: "text-success",
    },
    {
      icon: "money-bill-wave",
      text: "Expenses",
      value: currency.format(paymentsSum),
      color: "text-danger",
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
        <strong>Payment Categories</strong>
        <hr />

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

        <hr />
      </div>

      {breakdown?.downpayment && (
        <div>
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

      {/* Display full breakdown items */}
      <div>
        {Object.entries(breakdown).map(([key, value], idx) => (
          <div
            key={idx}
            className="d-flex justify-content-between align-items-center mb-1"
          >
            <span className="text-capitalize">{key}</span>
            <b>{currency.format(value) || 0}</b>
          </div>
        ))}
      </div>

      <hr />
      <strong>Total Gross: {currency.format(gross)}</strong>
    </MDBContainer>
  );
}
