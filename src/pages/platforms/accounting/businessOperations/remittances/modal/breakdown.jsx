import React from "react";
import { useSelector } from "react-redux";
import { MDBCol } from "mdbreact";
import { currency, paymentMethod } from "../../../../../../services/utilities";

const Breakdown = () => {
  const { selected } = useSelector(({ remittances }) => remittances);
  const { expenses, opening, breakdown, coh, sales } = selected;
  console.log("breakdown", breakdown);
  return (
    <MDBCol style={{ minHeight: "350px" }} md="2">
      <h5 className="text-center fw-bold">Sales Break Down</h5>
      <div>Floating Cash: {currency.format(opening?.sum || 0)}</div>
      <div className="mt-5">
        {breakdown &&
          Object.entries(breakdown || {}).map(([key, value]) => {
            const paymentData = paymentMethod.getImage(key); // Get payment method data
            const { img, style, text = "" } = paymentData;
            return (
              <div
                key={key}
                title={text === "co" ? "Care Of" : text}
                className="d-flex align-items-center text-white justify-content-between mt-2"
              >
                {paymentData?.img ? (
                  <img
                    src={img} // ✅ Use an <img> tag
                    alt={key}
                    className="mr-2"
                    style={{
                      ...style,
                      height: text === "co" ? "1.5rem" : "1.1rem",
                    }} // Adjust size if needed
                  />
                ) : (
                  <span>{text} 💰</span>
                )}
                <span>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                  <strong className="text-dark">
                    ₱{value.toLocaleString()}
                  </strong>
                </span>
              </div>
            );
          })}
        <hr />
        <div>Total : {currency.format(opening?.sum + sales)}</div>
        <div className="d-flex justify-content-between align-items-center">
          <h5 style={{ color: "red" }}>
            Expenses: {currency.format(expenses || 0)}
          </h5>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <h5>COH:</h5>
          <h5>
            <strong style={{ color: "green" }}>{currency.format(coh)}</strong>
          </h5>
        </div>
      </div>
    </MDBCol>
  );
};

export default Breakdown;
