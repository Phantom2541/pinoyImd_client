import { CLOUDINARY_ENDPOINT, FailedBanner } from "../index";

export default function Banner({
  company,
  branch,
  className = "print-header",
}) {
  return (
    <div className={className}>
      <img
        src={`${CLOUDINARY_ENDPOINT}companies/${company}/${branch}/banner.png?v=${Date.now()}`}
        onError={(e) => (e.target.src = FailedBanner)}
        width="100%"
        height="85px"
        alt={`${branch} Banner`}
      />
    </div>
  );
}
