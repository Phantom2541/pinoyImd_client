import { Services } from "../../../../services/fakeDb";
import { MDBRow, MDBCol } from "mdbreact";

const Miscellaneous = ({ data = [] }) => {
  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      {data.map((test, index) => (
        <MDBRow key={index}>
          <MDBCol md="7">
            <span>{Services.find(test)?.abbreviation}</span>
          </MDBCol>
          <MDBCol md="4">
            <span
              style={{
                borderBottom: "1px dotted black",
                display: "inline-block", // Ensures it's treated like a block-level element
                width: "100%", // Make sure it occupies the available width
              }}
            ></span>
          </MDBCol>
        </MDBRow>
      ))}
    </div>
  );
};

export default Miscellaneous;
