import { Cloudinary, FailedBanner } from "../index";
import { MDBAnimation, MDBProgress } from "mdbreact";
import "./index.css";
export default function Banner({
  company,
  branch,
  className = "print-header",
  onloaded = true, // set to true if banner is already loaded
  setOnloaded = () => {},
}) {
  return (
    <div className={className}>
      <img
        src={`${Cloudinary.getEndpoint()}/companies/${company}/${branch}/banner.png?v=${Date.now()}`}
        onError={(e) => (e.target.src = FailedBanner)}
        width="100%"
        onLoad={() => setOnloaded(true)}
        className={`${!onloaded ? "d-none" : ""} `}
        height="85px"
        alt={`${branch} Banner`}
      />
      {!onloaded && (
        <MDBAnimation type="flash" infinite delay={`100ms`} duration="3000ms">
          <MDBProgress
            animated
            color="light"
            value={3000}
            id="banner-printout-loading"
          ></MDBProgress>
        </MDBAnimation>
      )}
    </div>
  );
}
