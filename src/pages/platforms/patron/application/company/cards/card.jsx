import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBView,
  MDBMask,
  MDBCardText,
  MDBIcon,
  MDBCol,
  MDBBtn,
} from "mdbreact";
import { PresetUser, ENDPOINT } from "../../../../../../services/utilities";
import joinNow from "../../../../../../assets/joinNow.png";
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
      >
        <MDBView waves cascade hover rounded className="custom-mdbview mx-auto">
          <img
            src={`${ENDPOINT}/public/companies/${company?.name}/logo.jpg`}
            alt={company?.name}
            className="mx-auto bg-transparent"
            style={{ height: "8rem", width: "100%" }}
            onError={(e) => (e.target.src = PresetUser)}
          />
          <MDBMask overlay="white-slight" tag="a" />
        </MDBView>
        {company.isHiring && (
          <MDBBtn
            floating
            tag="a"
            size="sm"
            className="ml-auto d-flex align-items-center justify-content-center"
            action
            color="danger"
            style={{
              width: "2.4rem",
              height: "2.4rem",
              fontSize: "0.5rem",
              fontWeight: 600,
            }}
            onClick={() => setVisibility(true)}
          >
            Join Us Now!
          </MDBBtn>
        )}
        <MDBCardBody cascade style={{ marginTop: "-0.5rem" }}>
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
            <MDBIcon icon="building" className="grey-text" /> {company.subName}
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
          <MDBCardText className="ellipsis">
            {company.description ||
              "is a modern, patient-centered diagnostic facility dedicated to providing accurate, timely, and affordable laboratory services. Established with the vision of advancing healthcare diagnostics in the community, Smartcare Laboratory combines expert medical technologists with state-of-the-art equipment to deliver reliable results that healthcare providers and patients can trust. From routine tests to specialized diagnostics, our commitment is to uphold the highest standards in quality, safety, and efficiency. At Smartcare, we believe that better diagnostics lead to better decisions—and ultimately, better care."}
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
