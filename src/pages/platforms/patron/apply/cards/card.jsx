import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCol,
} from "mdbreact";
import { PresetUser, ENDPOINT } from "../../../../../services/utilities";

import ApplicationModal from "./modal";

export default function CompanyCard({ company }) {
  const [visibility, setVisibility] = useState(false),
    [didHover, setDidHover] = useState(false);

  return (
    <MDBCol size="4" className="mb-4">
      <MDBCard
        onMouseOver={() => setDidHover(true)}
        onMouseOut={() => setDidHover(false)}
        onClick={() => setVisibility(true)}
        className={`h-100 cursor-pointershadow-${didHover ? 5 : 1}`}
      >
        <MDBCardBody className="text-center">
          <MDBCardImage
            src={`${ENDPOINT}/public/credentials/${company?.name}/logo.jpg`}
            className="mb-3 img-thumbnail bg-transparent"
            style={{ height: 200, width: "auto" }}
            onError={(e) => (e.target.src = PresetUser)}
          />
          <MDBCardTitle>{company?.name}</MDBCardTitle>
          <label>{company.subName}</label>
        </MDBCardBody>
      </MDBCard>
      <ApplicationModal
        company={company}
        visibility={visibility}
        setVisibility={setVisibility}
      />
    </MDBCol>
  );
}
