import { MDBInput, MDBRow, MDBCol } from "mdbreact";

export default function Contracts({ handleChange, handleValue }) {
  return (
    <MDBRow>
      <MDBCol md="6">
        <MDBInput
          type="number"
          label="Subcontract"
          title="Para sa mga co-lab na paminsan-minsan lang nagpapadala sa iyo kapag may kailangan lang (per-need basis)"
          value={handleValue("sbc")}
          onChange={(e) => handleChange("sbc", e.target.value)}
        />
      </MDBCol>

      <MDBCol md="6">
        <MDBInput
          type="number"
          label="Special Subcontract"
          title="Para sa co-lab na laging nagpapadala sayo ng tests na hindi nila kaya — regular partner ka na nila"
          value={handleValue("ssc")}
          onChange={(e) => handleChange("ssc", e.target.value)}
        />
      </MDBCol>
    </MDBRow>
  );
}
