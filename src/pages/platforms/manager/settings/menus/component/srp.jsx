import { MDBInput, MDBRow, MDBCol } from "mdbreact";
import { useSelector } from "react-redux";
import { Categories } from "../../../../../../services/fakeDb";

export default function SRP({ handleChange, handleValue }) {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { pc = [] } = branch;
  const srpIndexs = [2, 3, 4];
  const foundIndexs = [...pc].filter((pk) => srpIndexs.includes(pk));
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
