import { useState } from "react";
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
import ApplicationModal from "./modal";
import StarRating from "../star";

export default function CompanyCard({ company }) {
  const [visibility, setVisibility] = useState(false);
  return (
    <MDBCol md="3">
      <MDBCard
        narrow
        style={{
          marginTop: "44px",
          filter: `grayscale(${
            company?.branches?.some(({ isHiring }) => isHiring) ? "0" : "100%"
          })`,
        }}
      >
        <MDBView
          waves
          cascade
          hover
          rounded
          className="custom-mdbview mx-auto"
          onClick={() => {
            if (company?.branches?.some(({ isHiring }) => isHiring)) {
              setVisibility(true);
            }
          }}
        >
          <img
            src={`${ENDPOINT}/public/companies/${company?.name}/logo.png`}
            alt={company?.name}
            className="mx-auto bg-transparent"
            style={{ height: "7rem", width: "90%" }}
            onError={(e) => (e.target.src = PresetUser)}
          />
          <MDBMask overlay="white-slight" tag="a" />
        </MDBView>
        {company?.branches?.some(({ isHiring }) => isHiring) && (
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
          <h6 style={{ marginTop: "-0.4rem" }}>
            "{company.tagline || "Your Health, Our Priority."}"
          </h6>
          <MDBCardText className="ellipsis">
            {company.description ||
              "is a modern, patient-centered diagnostic facility dedicated to providing accurate, timely, and affordable laboratory services. Established with the vision of advancing healthcare diagnostics in the community, Smartcare Laboratory combines expert medical technologists with state-of-the-art equipment to deliver reliable results that healthcare providers and patients can trust. From routine tests to specialized diagnostics, our commitment is to uphold the highest standards in quality, safety, and efficiency. At Smartcare, we believe that better diagnostics lead to better decisions—and ultimately, better care."}
          </MDBCardText>
          <StarRating rating={3.5} />
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
