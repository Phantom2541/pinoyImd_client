import { useState } from "react";
import { MDBAlert, MDBTypography } from "mdbreact";
import { formColor } from "../../../../services/utilities";
import BodySwitcher from "./bodySwitcher";
import { useDispatch, useSelector } from "react-redux";
import CountDown from "./countDown";
import Header from "./header";
import { SetACTIVE_TYPE } from "../../../../services/redux/slices/emr/portal";
import "./style.css";
import Loading from "./loading";
const Body = () => {
  const {
      result,
      preferences,
      isResultAvailable = false,
      isResultReady = false,
      hasRender = false,
      activeType = "",
      rendered,
      isLoading = false,
    } = useSelector(({ portal }) => portal),
    [task, setTask] = useState({}),
    dispatch = useDispatch();
  const { diagnostic = {}, department = [] } = result;
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

    setTask(_task);
    dispatch(SetACTIVE_TYPE(type));
  };

  console.log("rendered", rendered);
  const getDepartment = () => {
    switch (department[0]) {
      case "LAB":
        return "laboratory";

      default:
        return "radiology";
    }
  };
  return (
    <div className="mx-2">
      <Header />
      {isResultAvailable && (
        <>
          <div className="d-flex aling-items-center justify-content-between">
            <span className="mt-1" style={{ fontWeight: 400 }}>
              Services Type:
            </span>
            <select
              className="form-control"
              style={{ width: "70%", height: "2rem" }}
              value={activeType}
              onChange={({ target }) => handleChange(target.value)}
            >
              {Object.keys(diagnostic)?.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <div className="my-4">
            <MDBAlert
              color={formColor(activeType)}
              className="text-uppercase text-center py-0 mb-1 p-1"
            >
              <h5 style={{ letterSpacing: "10px" }} className="mb-0 fw-bold">
                {activeType}
              </h5>
            </MDBAlert>
            {!isResultReady && (
              <span className="text-primary">
                Processing of your requested services is still ongoing.
              </span>
            )}
          </div>
        </>
      )}
      {isLoading ? (
        <div style={{ width: "100%" }}>
          <Loading loadingFor="body" />
        </div>
      ) : (
        <>
          {isResultReady ? (
            <BodySwitcher task={task} />
          ) : !hasRender ? (
            <MDBTypography
              note
              noteTitle="Note: "
              className="mt-5"
              noteColor="danger"
            >
              Please proceed to the {getDepartment()}
            </MDBTypography>
          ) : (
            <CountDown />
          )}
        </>
      )}
    </div>
  );
};

export default Body;
