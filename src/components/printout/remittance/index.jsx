import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./header";
import Body from "./body";
import { Banner } from "../../../services/utilities";

export default function Printout() {
  const { selected } = useSelector(({ remittances }) => remittances),
    [platform, setPlatform] = useState({ _id: "" });

  console.log("selected", selected);

  const { branch } = platform;

  return (
    <div style={{ backgroundColor: "white" }}>
      <div
        style={{
          width: "750px",
          height: "624px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "18px",
        }}
      >
        <Banner company={branch?.companyId.name} branch={branch?.name} />
        <Header />
        <Body />
      </div>
    </div>
  );
}
