import { useEffect, useState } from "react";
import { MDBAlert } from "mdbreact";
import { formColor } from "../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import { useSelector } from "react-redux";
import CountDown from "./countDown";

const Body = () => {
  const { result, preferences } = useSelector(({ results }) => results),
    [resultType, setResultType] = useState(""),
    [task, setTask] = useState({});

  const { diagnostic = {} } = result;
  const handleChange = (type) => {
    const _result = diagnostic[type];
    const { packages } = _result;
    const _packages =
      packages && typeof packages === "object"
        ? Array.isArray(packages)
          ? packages
          : Object.keys(packages).map((k) => Number(k))
        : packages
        ? [packages]
        : [];

    const services = preferences.filter(({ id }) => _packages.includes(id));
    console.log("services", services);
    console.log("_packages", _packages);
    console.log("preferences", preferences);

    const _task = {
      ..._result,
      form: type,
      patient: result.customerId,
      generateHealthyClient: [
        "Urinalysis",
        "Parasitology",
        "Xray",
        "Ultrasound",
      ].includes(type)
        ? true
        : false,
      services,
    };

    setResultType(type);
    setTask(_task);
  };
  return (
    <div className="mx-2">
      <h5 style={{ fontWeight: 600 }}>Ric Darrel A. Pajarillaga</h5>
      <h5 style={{ marginTop: "-0.5rem", fontSize: "1rem" }}>
        <span>Proccess Time:</span>
        <span style={{ fontWeight: 500 }} className="ml-2">
          10:30 AM
        </span>
      </h5>
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ marginTop: "-0.3rem" }}
      >
        <h5 style={{ fontSize: "0.9rem" }}>Smart Care</h5>
        <h5 style={{ fontSize: "0.9rem" }}>General Tinio</h5>
      </div>
      {/* <div className="d-flex aling-items-center justify-content-between">
        <span className="mt-1" style={{ fontWeight: 400 }}>
          Results Type:
        </span>
        <select
          className="form-control"
          style={{ width: "72%", height: "2rem" }}
          value={resultType}
          onChange={({ target }) => handleChange(target.value)}
        >
          {Object.keys(diagnostic)?.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div> */}
      {/* <MDBAlert
        color={formColor("hematology")}
        className="text-uppercase text-center py-0 mb-1 my-4 p-1"
      >
        <h5 style={{ letterSpacing: "10px" }} className="mb-0 fw-bold">
          hematology
        </h5>
      </MDBAlert> */}
      <CountDown />
      {/* <BodySwitcher task={task} /> */}
    </div>
  );
};

export default Body;
