import React from "react";
import { ENDPOINT, FailedBanner } from "../index";

export default function Banner({ company, branch }) {
  return (
    <img
      src={`${ENDPOINT}/public/companies/${company}/${branch}/banner.png`}
      onError={(e) => (e.target.src = FailedBanner)}
      width="100%"
      height="85px"
      alt={`${company}-${branch} Banner`}
    />
  );
}
