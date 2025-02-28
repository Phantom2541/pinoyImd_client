import React from "react";
import { MDBBadge } from "mdbreact";
import { Services } from "../../../services/fakeDb";

const PackageBadges = ({ packages }) => {
  return (
    <div>
      {packages.map((pkg, index) => {
        const service = Services[pkg.key];
        return (
          <MDBBadge key={index} color="primary">
            {service ? service.name : "Unknown Service"}
          </MDBBadge>
        );
      })}
    </div>
  );
};

export default PackageBadges;
