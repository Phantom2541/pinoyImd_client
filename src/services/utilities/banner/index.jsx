import { Cloudinary, FailedBanner } from "../index";
import { MDBAnimation, MDBProgress } from "mdbreact";
import "./index.css";
import { useEffect } from "react";
export default function Banner({
  company,
  branch,
  bid = "",
  className = "print-header",
  onloaded = true, // set to true if banner is already loaded
  setOnloaded = () => {},
}) {
  const bannerSrc = `${Cloudinary.getEndpoint()}/${bid}/companies/${company}/${branch}/banner.png`;

  useEffect(() => {
    const img = new Image();
    img.src = bannerSrc;
    img
      .decode()
      .then(() => {
        setOnloaded(true);
      })
      .catch(() => {
        setOnloaded(true);
      });
  }, [setOnloaded, bannerSrc]);

  return (
    <div className={className}>
      {onloaded && (
        <img
          src={bannerSrc}
          onError={(e) => (e.target.src = FailedBanner)}
          width="100%"
          height="85px"
          alt={`${branch} Banner`}
        />
      )}
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
