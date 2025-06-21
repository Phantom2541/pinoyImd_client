import { MDBCol } from "mdbreact";
const types = ["A", "B", "O", "AB"];
export default function BloodTyping({ task, fontSize }) {
  const { results } = task;
  const aboType = types[results?.bt];
  return (
    <div style={{ fontSize: `${fontSize}rem` }}>
      <MDBCol>
        <h6>BLOOD TYPING :</h6>
        <div className="mb-3">
          <MDBCol size="11">
            FORWARD :&nbsp;
            <strong>
              <b>"{aboType}"</b>
            </strong>
          </MDBCol>
          <MDBCol size="11">
            REVERSE :&nbsp;
            <strong>
              <b>"{aboType}"</b>
            </strong>
          </MDBCol>
        </div>
        <div>
          <MDBCol size="11">
            RH :&nbsp;
            <b style={{ color: results?.rh ? "red" : "black" }}>
              {results?.rh ? "POSITIVE" : "NEGATIVE"}
            </b>
          </MDBCol>
        </div>
      </MDBCol>
    </div>
  );
}
