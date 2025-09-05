import { MDBCol } from "mdbreact";

export default function Category({ task }) {
  const { specimen } = task;
  //console.log(task);
  return (
    <MDBCol
      style={{
        fontSize: "20px",
      }}
    >
      <b> {specimen} </b> OGTT
    </MDBCol>
  );
}
