import { useSelector } from "react-redux";
import Header from "./header";
import Body from "./body";
import { Banner } from "../../../services/utilities";
import { useEffect, useState } from "react";
import "./style.css";
export default function Printout() {
  const [remittance, setRemittance] = useState({});
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { name = "", companyId = {} } = branch;
  // const { companyId, name } = branch;

  useEffect(() => {
    const fakeDB = localStorage.getItem("remittance");
    if (fakeDB) {
      setRemittance(JSON.parse(fakeDB));
    }
  }, []);

  const Printout = ({ isCashier }) => {
    return (
      <div
        style={{
          width: "500px",
          cursor: "default",
          fontFamily: "Helvetica, sans-serif",
          letterSpacing: "-0.5px",
          fontSize: "18px",
        }}
        className="remittance-container bg-white mr-2"
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
            <div style={{ borderTop: "1px solid black", width: "18rem" }}>
              <span
                className="text-center d-block"
                style={{ fontSize: "0.9rem" }}
              >
                Signature over Printed Name
              </span>
            </div>
            <div
              style={{ borderTop: "1px solid black", width: "10rem" }}
              className="ml-2"
            >
              <span
                className="text-center d-block"
                style={{ fontSize: "0.9rem" }}
              >
                Date and time received
              </span>
            </div>
          </div>
          <small
            className="mt-2 ml-2 d-block  text-center"
            style={{ fontSize: "1.2rem" }}
          >
            <i>{isCashier ? "Cashier" : "Collector"} Copy</i>
          </small>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex">
      <Printout isCashier />
      <Printout />
    </div>
  );
}
