import React, { useState, useEffect } from "react";
import Header from "./header";
import Body from "./body";
import { Banner } from "../../../services/utilities";

const Printout = ({ resecos, platform, header }) => {
  const { branch } = platform;
  const { month, year, source } = header;

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
      <div
        style={{
          width: "1050px",
          height: "624px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "18px",
        }}
      >
        <>
          <Banner company={branch?.companyId.name} branch={branch?.name} />
          <Header vendor={source} month={month} year={year} />
          <Body />
        </>
      </div>
    </div>
  );
};

export default function ResecoPrintout() {
  const [resecos, setResecos] = useState({ _id: "" }),
    [platform, setPlatform] = useState({ _id: "" }),
    [header, setHeader] = useState({});

  useEffect(() => {
    setResecos(JSON.parse(localStorage.getItem("resecos")));
    setPlatform(JSON.parse(localStorage.getItem("activePlatform")));
    setHeader(JSON.parse(localStorage.getItem("header")));
  }, []);

  if (resecos?.lenght !== 0)
    return <Printout resecos={resecos} platform={platform} header={header} />;

  return <div>Task is Empty</div>;
}
