import React from "react";
import FormattedTotal from "./formattedTotal";

const Breakdown = ({ deal }) => {
  const { opening = {}, sales: gross = 0, breakdown = {}, expenses = 0 } = deal;
  const { cash, ...rest } = breakdown;
  const nonCash = Object.entries(rest);
  const net = (opening.sum || 0) + cash - expenses;
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {gross > 0 && <FormattedTotal value={gross} title="Sales" />}

      {nonCash.length > 0 && (
        <>
          <div
            className="d-flex align-items-center"
            style={{ marginBottom: "-6px" }}
          >
            <h5 style={{ whiteSpace: "nowrap", fontWeight: 400 }}>Non-Cash:</h5>
          </div>
          {nonCash.map(([key, value], idx) => (
            <FormattedTotal
              _key={idx}
              className="ml-2"
              style={{ color: "green", fontSize: "1.1rem" }}
              value={value}
              title={key}
            />
          ))}
        </>
      )}

      {[
        { label: "Cash Sales:", value: breakdown?.cash },
        {
          label: " Add: FC",
          value: opening.sum,
          title: "Floating Cash",
        },
        { label: "Expenses", value: expenses, color: "red" },
      ]
        .filter(({ value }) => value > 0)
        .map(({ label, value, color }, idx) => (
          <FormattedTotal
            title={label}
            value={value}
            style={{ color }}
            _key={idx}
          />
        ))}

      <div
        className="my-1"
        style={{
          borderTop: "1px dashed #999",
        }}
      ></div>

      <FormattedTotal
        title={"COH"}
        value={net}
        style={{ color: "green", fontWeight: "bold" }}
        coh
      />
    </div>
  );
};

export default Breakdown;
