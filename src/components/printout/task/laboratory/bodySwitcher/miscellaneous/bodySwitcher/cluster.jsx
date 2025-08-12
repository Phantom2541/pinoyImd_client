import { MDBCol } from "mdbreact";
import { Services } from "../../../../../../../services/fakeDb";

// HIV : 68
// Syphilis |RPR :69
// HBsAg :70
// HCV : 97
// HAV :131
const test = [68, 69, 70, 97, 131];

export default function Cluster({ task, fontSize }) {
  const { results } = task;
  const services = Object.keys(results)
    .filter((key) => test.includes(Number(key)))
    .map((key) => Services.find(key));

  return (
    <div className="pl-5 mb-5" style={{ fontSize: `${fontSize}rem` }}>
      <MDBCol>
        <h6>Results :</h6>
        <div>
          {services.map((service, i) => (
            <MDBCol size="12" className="offset-1" key={`cluster-${i}`}>
              {service?.name || service?.abbreviation}:&nbsp;
              <b
                style={{
                  color: results[service?.id] ? "red" : "black",
                }}
              >
                {results[service?.id] ? "REACTIVE" : "NON-REACTIVE"}
              </b>
            </MDBCol>
          ))}
        </div>
      </MDBCol>
    </div>
  );
}
