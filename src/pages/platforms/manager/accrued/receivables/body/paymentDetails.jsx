import { orderBy, sortBy } from "lodash";
import { dateFormat } from "../../../../../../services/utilities";

const PaymentDetails = ({ payments, imageSrc = () => {} }) => {
  return (
    <div
      className="bg-white w-100"
      style={{
        borderLeft: "2px solid #ccc",
        paddingLeft: "15px",
      }}
    >
      {orderBy(payments, ["createdAt"], ["desc"]).map(
        ({ method: type, amount, chequeNo, clearDate, createdAt }, i) => (
          <div
            key={`breakdown-${type}-${i}`}
            style={{ position: "relative", marginBottom: "12px" }}
          >
            <div style={{ position: "relative" }}>
              <span
                className="bg-primary"
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
                src={imageSrc(type)}
                alt={`no-image-${type}`}
                className="mr-2"
                style={{ height: "0.8rem" }}
              />
              ₱{amount.toLocaleString()}
              <span
                style={{
                  float: "right",
                  fontSize: "0.75rem",
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
