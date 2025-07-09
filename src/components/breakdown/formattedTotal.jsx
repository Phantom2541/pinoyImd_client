import React from "react";
import { currency } from "../../services/utilities";

const FormattedTotal = ({
  style = {},
  className = "",
  title,
  value,
  coh = false,
  _key = "",
}) => {
  return (
    <div
      className={`d-flex align-items-center justify-content-between ${className}`}
      key={_key || title}
    >
      <h5
        className="mb-0 text-right text-nowrap"
        style={{ fontWeight: 400, ...style }}
      >
        {title}:
      </h5>
      {!coh && (
        <div
          style={{
            flexGrow: 1,
            borderBottom: "1px dashed #999",
            margin: "0 10px",
          }}
        />
      )}
      <h5
        className="mb-0 text-right text-nowrap"
        style={{ fontWeight: 400, ...style }}
      >
        {currency.format(value)}
      </h5>
    </div>
  );
};

export default FormattedTotal;
