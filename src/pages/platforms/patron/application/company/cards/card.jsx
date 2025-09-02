import { useState } from "react";
import { MDBMask, MDBIcon, MDBCol } from "mdbreact";
import { PresetUser, ENDPOINT } from "../../../../../../services/utilities";
import ApplicationModal from "./modal";
import BgRemover from "../../../../../../components/images/bgRemover";

import StarRating from "../star";
import "./../style.css";

export default function CompanyCard({ company }) {
  const [visibility, setVisibility] = useState(false);
  return (
    <MDBCol md="3">
      <div
        className="application-card"
        style={{
          marginTop: "40px",
          filter: `grayscale(${
            company?.branches?.some(({ isHiring }) => isHiring) ? "0" : "100%"
          })`,
        }}
        onClick={() => setVisibility(true)}
      >
        <div
          className="application-card-image-wrapper"
          // onClick={() => {
          //   if (company?.branches?.some(({ isHiring }) => isHiring)) {
          //     setVisibility(true);
          //   }
          // }}
        >
          <BgRemover
            className="application-card-image"
            src={`${ENDPOINT}/public/companies/${company?.name}/profile/logo.png`}
            alt={company?.name}
            fallback={PresetUser}
          />
          <MDBMask overlay="white-slight" tag="a" />
        </div>
        {company?.branches?.some(({ isHiring }) => isHiring) && (
          <label className="application-card-joinButton">🚀 Join Us Now</label>
        )}
        <div className="application-card-body">
          <span className="application-card-companyName text-primary">
            {company?.name.toLowerCase()}
          </span>
          <span className="application-card-subName">
            <MDBIcon icon="clinic-medical" />{" "}
            {company.subName.toLowerCase() || "—"}
          </span>

          <span className="application-card-tagline">
            "{company.tagline || "Your Health, Our Priority."}"
          </span>
          <span className="application-card-description">
            {company.description ||
              "is a modern, patient-centered diagnostic facility dedicated to providing accurate, timely, and affordable laboratory services. Established with the vision of advancing healthcare diagnostics in the community, Smartcare Laboratory combines expert medical technologists with state-of-the-art equipment to deliver reliable results that healthcare providers and patients can trust. From routine tests to specialized diagnostics, our commitment is to uphold the highest standards in quality, safety, and efficiency. At Smartcare, we believe that better diagnostics lead to better decisions—and ultimately, better care."}
          </span>
          <div className="application-card-rating">
            <StarRating rating={3.5} />
          </div>
        </div>
      </div>
      <ApplicationModal
        company={company}
        visibility={visibility}
        setVisibility={setVisibility}
      />
    </MDBCol>
  );
}
