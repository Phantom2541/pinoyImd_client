import { useSelector } from "react-redux";
import Header from "./header";
import Body from "./body";
import { Banner } from "../../../services/utilities";
import { useEffect, useState } from "react";
import "./style.css";
export default function Printout() {
  const [remittance, setRemittance] = useState({});
  const { activePlatform, auth } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { name = "", companyId = {} } = branch;
  // const { companyId, name } = branch;

  useEffect(() => {
    const fakeDB = localStorage.getItem("remittance");
    if (fakeDB) {
      setRemittance(JSON.parse(fakeDB));
    }
  }, []);

  console.log("activePlatform", auth);

  return (
    // <div style={{ backgroundColor: "white" }}>
    <div
      style={{
        width: "750px",
        cursor: "default",
        fontFamily: "Helvetica, sans-serif",
        letterSpacing: "-0.5px",
        fontSize: "18px",
      }}
      className="remittance-container bg-white"
    >
      <Banner
        company={companyId.name}
        branch={name}
        className="remittance-banner"
      />
      <div className="remittance-header">
        <Header remittance={remittance} />
      </div>
      <div className="remittance-body">
        <Body remittance={remittance} />
        <div className="d-flex justify-content-between mt-5">
          <div style={{ borderTop: "1px solid black", width: "20rem" }}>
            <span className="text-center d-block">
              Signature over Printed Name of Collector
            </span>
          </div>
          <div style={{ borderTop: "1px solid black", width: "20rem" }}>
            <span className="text-center d-block">Date and time received</span>
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
}
