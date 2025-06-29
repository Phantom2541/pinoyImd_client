import { MDBCol, MDBRow } from "mdbreact";
import React, { useEffect, useState } from "react";
import {
  Banner,
  dateFormat,
  fullName,
  getAge,
} from "../../../services/utilities";
import { useSelector } from "react-redux";

const RequestOutSource = () => {
  const { auth, activePlatform } = useSelector(({ auth }) => auth),
    [request, setRequest] = useState({}),
    { branch = {} } = activePlatform,
    { name, companyId } = branch;
  useEffect(() => {
    const _request = JSON.parse(localStorage.getItem("outsource_request"));
    setRequest(_request);
  }, []);

  const {
    deal = {},
    outsources = [],
    sentOut = {},
    isRad = false,
  } = request || {};
  const { customerId = {}, ssx, patientNo = 1 } = deal;
  // Patient No. = index of deal
  // Case No. = deal _id
  return (
    <div
      className="mx-1"
      style={{
        width: "5.8in",
        cursor: "default",
        fontFamily: "Helvetica, sans-serif",
        letterSpacing: "-0.5px",
        fontSize: "16px !important",
      }}
    >
      <MDBRow>
        <MDBCol>
          <Banner company={companyId?.name} branch={name} />
          <div style={{ border: "2px solid black", minHeight: "20rem" }}>
            <div
              style={{
                background: "black",
                height: "1.4rem",
              }}
              className="d-flex align-items-center justify-content-center"
            >
              <h5
                className="text-white"
                style={{ fontSize: "1rem", marginTop: "0.6rem" }}
              >
                {isRad ? "OFFICIAL READING" : "SEND OUT"}
              </h5>
            </div>
            <div
              className="d-flex align-items-center  justify-content-between p-1"
              style={{ borderBottom: "1px solid black", height: "1.7rem" }}
            >
              <div className="d-flex align-items-center mt-1">
                <h6 className="font-weight-bold mr-1">Name:</h6>
                <h6>{fullName(customerId?.fullName, true)}</h6>
              </div>

              <div>
                <div className="d-flex align-items-center mt-1">
                  <h6 className="font-weight-bold mr-1">Gender:</h6>
                  <h6>{customerId?.isMale ? "Male" : "Female"}</h6>
                </div>
              </div>
            </div>
            <div
              className="d-flex align-items-center justify-content-between p-1"
              style={{ borderBottom: "1px solid black", height: "1.7rem" }}
            >
              <div>
                <div className="d-flex align-items-center mt-1 mr-3">
                  <h6 className="font-weight-bold mr-1">Birthday:</h6>
                  <h6>{dateFormat(customerId?.dob)}</h6>
                </div>
              </div>
              <div>
                <div className="d-flex align-items-center mt-1">
                  <h6 className="font-weight-bold mr-1">Age:</h6>
                  <h6>{getAge(customerId?.dob)}</h6>
                </div>
              </div>
            </div>
            <div
              className="d-flex align-items-center  justify-content-between p-1"
              style={{ borderBottom: "1px solid black", height: "1.7rem" }}
            >
              <div className="d-flex align-items-center mt-1">
                <h6 className="font-weight-bold mr-1">Case No.:</h6>
                <h6>{deal?._id}</h6>
              </div>
              <div className="d-flex align-items-center mt-1">
                <h6 className="font-weight-bold mr-1">Patient No.:</h6>
                <h6>{patientNo}</h6>
              </div>
            </div>
            <div
              className="d-flex align-items-center  justify-content-between p-1"
              style={{ borderBottom: "1px solid black", height: "1.7rem" }}
            >
              <div className="d-flex align-items-center mt-1">
                <h6 className="font-weight-bold mr-1">SSX:</h6>
                <h6>{ssx ? ssx : ""}</h6>
              </div>
              {!isRad && (
                <div className="d-flex align-items-center mt-1">
                  <h6 className="font-weight-bold mr-1">Sent out lab:</h6>
                  <h6>{sentOut?.displayname || sentOut?.name}</h6>
                </div>
              )}
            </div>
            <div
              style={{
                background: "black",
                height: "1.4rem",
              }}
              className="d-flex align-items-center justify-content-center"
            ></div>
            <table style={{ marginTop: "-0.4rem" }} className="w-100">
              <thead>
                <tr>
                  <th className="fw-bold text-center  py-2">SERVICES</th>
                </tr>
              </thead>
              <tbody>
                {outsources?.map((outsource, index) => (
                  <tr
                    style={{
                      borderBottom: "1px solid black",
                      borderTop: "1px solid black",
                    }}
                    key={index}
                  >
                    <td style={{ fontWeight: "bold" }}>
                      {index + 1}.{" "}
                      <strong className="ml-3">{outsource.name}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center mt-2">
            <h6>Generated by:</h6>
            <h6 className="ml-1 fw-bold" style={{ alignItems: "baseline" }}>
              {fullName(auth?.fullName)}
            </h6>
          </div>
          <div className="d-flex align-items-center">
            <h6>Date Created:</h6>
            <h6 className="fw-bold ml-1">
              {new Date().toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </h6>
          </div>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

export default RequestOutSource;
