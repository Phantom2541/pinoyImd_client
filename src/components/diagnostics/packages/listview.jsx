import React from "react";
import { Services } from "../../../../../services/fakeDb";

const PackageList = ({ packages }) => {
  return (
    <div>
      {packages.map((pkg, index) => {
        const service = Services[pkg.key];
        return (
          <span key={index}>{service ? service.name : "Unknown Service"}</span>
        );
      })}
    </div>
  );
};

export default PackageList;
