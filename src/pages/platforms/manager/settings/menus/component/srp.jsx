import { MDBInput, MDBRow, MDBCol } from "mdbreact";
import { Categories } from "../../../../../../services/fakeDb";

export default function SRP({ handleChange, handleValue }) {
  const fakeDB = localStorage.getItem("activePlatform");
  var categories = [];
  if (fakeDB) {
    categories = JSON.parse(fakeDB)?.branch?.companyId?.pc;
  }
  const srpIndexs = [2, 3, 4, 5]; //Emergency Room,Charity Ward,Private Ward,Suite Room
  const foundIndexs = [...categories]
    .filter((pk) => srpIndexs.includes(pk))
    .sort((a, b) => a - b);
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
        {foundIndexs.map((pk) => {
          const { name, abbr } = Categories[pk];
          return (
            <MDBCol md="4" key={pk}>
              <MDBInput
                type="number"
                label={name}
                value={handleValue(abbr)}
                onChange={(e) => handleChange(abbr, e.target.value)}
              />
            </MDBCol>
          );
        })}

        {/* <MDBCol md="6">
          <MDBInput
            type="number"
            label="Promo"
            value={handleValue("promo")}
            onChange={(e) => handleChange("promo", e.target.value)}
          />
        </MDBCol> */}
      </MDBRow>
    </>
  );
}
