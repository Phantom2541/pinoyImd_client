import { MDBCol } from "mdbreact";

export default function Troupe({ task, fontSize }) {
  const { method, kit, lot, expiry } = task.troupe;

  return (
    <MDBCol
      size="12"
      style={{
        fontSize: `${fontSize}rem`,
      }}
    >
      Method : <b> {method} </b> <br />
      Kit : <b>{kit}</b> <br />
      Lot Number :<b> {lot}</b> <br />
      Expiration Date : <b>{expiry}</b>
    </MDBCol>
  );
}
