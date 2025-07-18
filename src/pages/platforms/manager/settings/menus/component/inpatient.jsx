import { MDBInput, MDBRow, MDBCol } from "mdbreact";
import { Categories } from "../../../../../../services/fakeDb";

export default function Inpatient({ handleChange, handleValue }) {
  const fakeDB = localStorage.getItem("activePlatform");

  let inpatient = [];
  if (fakeDB) {
    inpatient = JSON.parse(fakeDB)?.branch?.companyId?.pc || [];
  }

  const allowedInpatients = Categories.filter(
    (c, index) => c.type === "inpatient" && inpatient.includes(index)
  );

  return (
    <>
      <MDBRow>
        {/* ✅ OPD/Walkin SRP */}
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="SRP (OPD/Walkin)"
            title="Standard Rate para sa OPD o Walk-in patients"
            value={handleValue("opd")}
            onChange={(e) => handleChange("opd", e.target.value)}
          />
        </MDBCol>

        {/* ✅ Dynamic Inpatient Fields */}
        {allowedInpatients.map(({ name, abbr }, i) => (
          <MDBCol md="4" key={abbr}>
            <MDBInput
              type="number"
              label={name}
              title={`SRP para sa mga pasyente sa ${name}`}
              value={handleValue(abbr)}
              onChange={(e) => handleChange(abbr, e.target.value)}
            />
          </MDBCol>
        ))}
      </MDBRow>
    </>
  );
}
