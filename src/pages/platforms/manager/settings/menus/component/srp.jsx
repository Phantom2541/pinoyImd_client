import { MDBInput, MDBRow, MDBCol } from "mdbreact";
import { Categories } from "../../../../../../services/fakeDb";

export default function SRP({ handleChange, handleValue }) {
  const fakeDB = localStorage.getItem("activePlatform");

  let categories = [];
  if (fakeDB) {
    categories = JSON.parse(fakeDB)?.branch?.companyId?.pc || [];
  }

  const srpIndexs = [2, 3, 4, 5]; // Emergency Room, Charity Ward, Private Ward, Suite Room
  const foundIndexs = categories.filter((pk) => srpIndexs.includes(pk));

  return (
    <>
      <MDBRow>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="SRP ( OPD/Walkin ) "
            value={handleValue("opd")}
            onChange={(e) => handleChange("opd", e.target.value)}
          />
        </MDBCol>

        {categories.map((pk) => {
          const category = Categories[pk];
          if (!category) return null;

          const { name, abbr } = category;

          return (
            <MDBCol md="4" key={pk}>
              <MDBInput
                type="number"
                label={`${name}${foundIndexs.includes(pk) ? " (SRP)" : ""}`}
                value={handleValue(abbr)}
                onChange={(e) => handleChange(abbr, e.target.value)}
              />
            </MDBCol>
          );
        })}
      </MDBRow>
    </>
  );
}
