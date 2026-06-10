import React from "react";
import { MDBBtn, MDBIcon } from "mdbreact";

export default function CompanyRegistrationGuide() {
  const steps = [
    {
      text: (
        <>
          Fill out the official{" "}
          <MDBBtn
            tag="a"
            href="https://docs.google.com/forms/d/e/1FAIpQLScMkupUeOtrszuL7MMkEQO0M3S1cKmO3t2m9bRIAymFDkyk4w/viewform"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            size="sm"
            className="mb-0"
          >
            <MDBIcon icon="external-link-alt" className="mr-2" />
            Open Google Form
          </MDBBtn>
        </>
      ),
    },
    {
      text: "Message us (TechnoWiz / Agent) after completing the registration.",
    },
    {
      text: "Wait for confirmation that your company has been successfully registered.",
    },
  ];

  return (
    <>
      <h3 className="mt-3">Step 1: Company Registration</h3>

      <ul>
        {steps.map(({ text }, index) => (
          <li key={index} className="mb-2">
            ✅ {text}
          </li>
        ))}
      </ul>
    </>
  );
}
