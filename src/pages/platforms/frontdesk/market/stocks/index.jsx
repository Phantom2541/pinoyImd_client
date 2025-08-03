import React from "react";
import Header from "./header";
import Cards from "./cards";
import "./style.css";
import collections from "./collections";

export default function Stocks() {
  return (
    <div
      className="d-flex justify-content-center align-items-center flex-column"
      style={{
        maxWidth: "77%",
        margin: "0 auto",
        gap: "10px",
        minWidth: "1040px",
      }}
    >
      <Header />

      <Cards collections={collections} />
    </div>
  );
}
