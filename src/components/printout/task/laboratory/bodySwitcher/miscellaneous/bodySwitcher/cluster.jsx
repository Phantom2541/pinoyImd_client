import React from "react";
import { MDBCol } from "mdbreact";
import { Services } from "../../../../../../../services/fakeDb";

export default function Cluster({ task, fontSize }) {
  const { results } = task;
  const test = [68, 69, 70, 97, 131];
  const services = Object.keys(results)
    .filter((key) => test.includes(Number(key)))
    .map((key) => Services.find(key));

  // HIV : 68
  // Syphilis |RPR :69
  // HBsAg :70
  // HCV : 97
  // HAV :131

  return (
    <div className="pl-5 mb-5" style={{ fontSize: `${fontSize}rem` }}>
      <MDBCol>
        <h6>Results:</h6>
        <div>
          {services.map((service, i) => (
            <MDBCol size="12" className="offset-1" key={`cluster-${i}`}>
              {service?.name || service?.abbreviation}:&nbsp;
              <b
                style={{
                  color: results[service?.id] === "true" ? "red" : "black",
                }}
              >
                {results[service?.id] === "true" ? "REACTIVE" : "NON-REACTIVE"}
              </b>
            </MDBCol>
          ))}
        </div>
      </MDBCol>
    </div>
  );
}
