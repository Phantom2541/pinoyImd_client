import {
  dateFormat,
  paymentMethod,
} from "../../../../../../../services/utilities";

const PaymentDetails = ({ deal = {} }) => {
  const imageSrc = (type) => paymentMethod.getImage(type).img;
  const { payment, amount, refNo = {}, cash = 0 } = deal;

  const arrangePayment = () => {
    if (payment === "mixed") {
      const _cash = amount - refNo?.amount;
      return [
        { method: "mixed", amount: refNo?.amount },
        ...(_cash > 0
          ? [
              { method: "cash", amount: _cash },
              { method: "tendered", amount: cash },
            ]
          : []),
      ];
    }

    return [
      { method: payment, amount },
      { method: "tendered", amount },
    ];
  };
  return (
    <div
      className="bg-white w-100"
      style={{
        borderLeft: "2px solid #ccc",
        paddingLeft: "15px",
      }}
    >
      {arrangePayment().map(
        ({ method: type, amount, chequeNo, clearDate, createdAt }, i) => (
          <div
            key={`breakdown-${type}-${i}`}
            style={{
              position: "relative",
              marginBottom: "8px",
            }}
          >
            <div style={{ position: "relative", fontWeight: 700 }}>
              <span
                className={i === 0 ? "bg-primary" : "bg-info"}
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  position: "absolute",
                  left: "-18px",
                  top: "3px",
                }}
              ></span>
              <img
                src={imageSrc(type === "mixed" ? "voucher" : type)}
                alt={`no-image-${type}`}
                className="mr-2"
                style={{
                  width: type === "gcash" ? "2.5rem" : "2.3rem",
                  height: type === "tendered" ? "1.5rem" : "1.2rem",
                  objectFit: "contain", // o "scale-down"
                }}
              />
              <span
                style={{ fontSize: type === "tendered" ? "0.6rem" : "0.85rem" }}
              >
                ₱{amount.toLocaleString()}
              </span>
              <span
                style={{
                  float: "right",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "#888",
                }}
              >
                {dateFormat(createdAt)}
              </span>
            </div>

            {type.toLowerCase() === "cheque" && (
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#555",
                  marginLeft: "10px",
                  marginTop: "4px",
                }}
              >
                Cheque No: <strong>{chequeNo}</strong> <br />
                Clearing: <strong>{dateFormat(clearDate)}</strong>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default PaymentDetails;
