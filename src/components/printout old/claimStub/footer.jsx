import React from "react";
import { Developer } from "../../../services/fakeDb";

const Hr = () => (
  <hr
    style={{
      border: "none",
      borderTop: "1px dashed #000",
      height: 0,
    }}
    className="my-1"
  />
);

const Footer = () => {
  return (
    <>
      <Hr />
      <br />
      <div className="mt-2">
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
      <Hr />
      <div className="mt-2">
        THIS SHALL SERVE AS YOUR ACKNOWLEDGEMENT RECEIPT AND IS VALID FOR
        <b> FIVE(5) </b>
        DAYS
      </div>
      <img width={75} src={Developer.icon} alt="Developer Icon" />
    </>
  );
};

export default Footer;
