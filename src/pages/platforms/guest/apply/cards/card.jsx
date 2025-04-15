import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBView,
  MDBMask,
  MDBCardText,
  MDBIcon,
  MDBCol,
  MDBBtn,
} from "mdbreact";
import { PresetUser, ENDPOINT } from "../../../../../services/utilities";

import ApplicationModal from "./modal";

export default function CompanyCard({ company }) {
  const [visibility, setVisibility] = useState(false),
    [didHover, setDidHover] = useState(false);

  return (
    <MDBCol md="3">
      <MDBCard
        narrow
        style={{ marginTop: "44px" }}
        onMouseOver={() => setDidHover(true)}
        onMouseOut={() => setDidHover(false)}
        onClick={() => setVisibility(true)}
      >
        <MDBView waves cascade hover rounded>
          <img
            src={`${ENDPOINT}/public/credentials/${company?.name}/logo.jpg`}
            className="mx-auto bg-transparent"
            style={{ height: "8rem", width: "70%" }}
            onError={(e) => (e.target.src = PresetUser)}
          />
          <MDBMask overlay="white-slight" tag="a" />
        </MDBView>
        <MDBBtn
          floating
          tag="a"
          size="sm"
          className="ml-auto mr-4"
          action
          color="info"
          onClick={() => setVisibility(true)}
        >
          <MDBIcon icon="chevron-right" />
        </MDBBtn>
        <MDBCardBody cascade>
          <h5
            className="mt-1"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              display: "block",
            }}
          >
            <MDBIcon icon="building" /> {company.subName}
          </h5>
          <h4
            className="card-title text-ellipsis"
            style={{
              whiteSpace: "nowrap",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              display: "block",
            }}
          >
            {company?.name}
          </h4>
          <MDBCardText>
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
            suscipit laboriosam, nisi ut aliquid ex ea commodi.
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
      {/* <MDBCard
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
      </MDBCard> */}
      <ApplicationModal
        company={company}
        visibility={visibility}
        setVisibility={setVisibility}
      />
    </MDBCol>
  );
}
