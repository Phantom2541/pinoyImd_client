import React from "react";
import { Services } from "../../../services/fakeDb";
export const Legend = ({ packages }) => {
  return (
    <div>
      {Services.whereIn(packages).map((service, index) => (
        <span key={index} className="mr-2">
          {service.abbreviation}
        </span>
      ))}
    </div>
  );
};
