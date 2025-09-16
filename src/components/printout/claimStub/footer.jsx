import { QRCodeCanvas } from "qrcode.react";
import { ENDPOINT, mobile } from "../../../services/utilities";

const Footer = ({ email, companyId = "", _id = "" }) => {
  const Hr = ({ className = "" }) => (
    <hr
      style={{
        border: "none",
        borderTop: "1px dashed #000",
        height: 0,
      }}
      className={`my-1 ${className}`}
    />
  );
  return (
    <>
      <div>
        I knowingly and voluntarily permit this Health Care Facility to perform
        the above services and agree to pay the specified amount
      </div>
      <div className="mt-2 text-left d-flex">
        Name<div className="w-100 border-bottom border-dark">:</div>
      </div>
      <div className="mt-2 text-left d-flex">
        Relationship<div className="w-100 border-bottom border-dark">:</div>
      </div>
      <br />
      <Hr className="mt-1" />
      <div className="mt-2">
        THIS SHALL SERVE AS YOUR ACKNOWLEDGEMENT RECEIPT AND IS VALID FOR
        <b> FIVE(5) </b>
        DAYS
      </div>
      <Hr />
      <div
        className="my-2"
        style={{
          width: "fit-content",
          height: "185px",
          border: "2px solid black",
          padding: "5px",
          margin: "auto",
        }}
      >
        <QRCodeCanvas
          value={`${ENDPOINT}/emr/portal/${companyId}/${_id}`}
          size={170}
        />
      </div>
      <h6>Scan this QR Code </h6>
      <h6 style={{ marginTop: "-0.7rem" }}>
        To activate your acount and check the transaction status
      </h6>
      <Hr />
      <div className="d-flex align-items-center justify-content-between">
        <h6>Email:</h6>
        <h6 style={{ fontSize: "13px" }}> {email} </h6>
      </div>
      <div className="d-flex align-items-center mt-n2 mb-n2 justify-content-between">
        <h6>Password:</h6>
        <h6 style={{ fontSize: "13px" }}>
          Birthday (format: <span className="fw-bold">YYYYMMDD</span>)
        </h6>
      </div>
      <Hr />
      <h6 className="font-weight-bold">PINOY-iMD </h6>
      <h6 style={{ marginTop: "-0.3rem" }}>Health within reached </h6>
      <h6 style={{ marginTop: "-0.2rem" }} className="text-nowrap text-left">
        Powered By: <strong>Techonowiz Solution Provider</strong>
      </h6>
      <h6 style={{ marginTop: "-0.4rem" }} className="text-left">
        Contact Number: <strong>{mobile("09350339777")}</strong>
      </h6>
    </>
  );
};

export default Footer;
