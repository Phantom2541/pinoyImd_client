import { MDBCol } from "mdbreact";

export default function Category({ task }) {
  const { specimen = "", results = "" } = task;
  return (
    <MDBCol
      size="12"
      className="ml-5"
      style={{
        marginLeft: 20,
        fontSize: "20px",
      }}
    >
      <b> {specimen} </b>
      OGTT{" "}
      <b>
        {results.ogtt === "0"
          ? "25"
          : results.ogtt === "1"
          ? "50"
          : results.ogtt === "2"
          ? "75"
          : "100"}{" "}
        mg
      </b>
    </MDBCol>
  );
}
