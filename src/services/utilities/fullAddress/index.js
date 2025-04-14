import React from "react";

const fullAddress = (address, isComplete = true) => {
  if (typeof address !== "object") return <i>Datatype mismatch</i>;

  const { region, province, city, barangay, street } = address;

  if (isComplete)
    return `${street && `${street},`} ${
      barangay && `${barangay},`
    } ${city}, ${province}, ${region}`.replace(/^\s+|\s+$/gm, "");

  return `${street && `${street}, `}${
    barangay && `${barangay}, `
  }${city}, ${region}`.replace(/^\s+|\s+$/gm, "");
};
const billingAddress = (address) => {
  if (typeof address !== "object") return <i>Datatype mismatch</i>;
  const { province, city, barangay } = address;
  return `${barangay} - ${city}, ${province}`;
};

export { billingAddress, fullAddress };
