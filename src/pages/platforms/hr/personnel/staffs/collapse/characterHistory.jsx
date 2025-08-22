import { capitalize, orderBy } from "lodash";
import { dateFormat } from "./../../../../../../services/utilities";

const CharacterHistory = ({ remarks }) => {
  return (
    <div
      className="bg-white w-100 text-dark"
      style={{
        borderLeft: "2px solid #ccc",
        width: "100%",
      }}
    >
      {orderBy(remarks, ["createdAt"], ["desc"]).map(
        ({ method: type, createdAt, title, reason }, i) => (
          <div
            key={`breakdown-${type}-${i}`}
            style={{ position: "relative", marginBottom: "12px" }}
          >
            <div style={{ position: "relative" }}>
              <span
                className="bg-danger ml-1"
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
              <small className="text- ml-1">{capitalize(title)}</small>
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

            <div
              style={{
                fontSize: "0.85rem",
                color: "#555",
                marginLeft: "10px",
                marginTop: "4px",
              }}
            >
              <strong>{reason}</strong> <br />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default CharacterHistory;
