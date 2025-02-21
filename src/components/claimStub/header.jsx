import React from "react";
import { useSelector } from "react-redux";

export default function Header({ date, saleId }) {
  const { company, activePlatform } = useSelector(({ auth }) => auth);
  console.log("activePlatform", activePlatform);

  return (
    <>
      <h4
        onClick={() => {
          window.print();
          window.close();
        }}
        style={{ marginBottom: -5 }}
        className="fw-bold"
      >
        {company?.name}
      </h4>
      <h6 className="mb-0">{company?.subName}</h6>

      <p className="mb-0">
        <small>{activePlatform?.branch?.name} Branch</small>
      </p>
      <small className="fw-bold">
        {new Date(date).toDateString()}, {new Date(date).toLocaleTimeString()}
      </small>

      <div
        style={{
          border: "1px dashed #000",
          borderRadius: "5px",
          padding: "10px",
          position: "relative",
          marginTop: "7.5px",
        }}
      >
        <small
          style={{
            position: "absolute",
            fontWeight: "bold",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#eee",
            padding: "0 7.5px",
          }}
        >
          Transaction ID
        </small>
        {saleId}
      </div>
    </>
  );
}
