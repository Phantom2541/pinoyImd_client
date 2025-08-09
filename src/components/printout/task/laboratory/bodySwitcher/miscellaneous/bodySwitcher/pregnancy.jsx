import { MDBCol } from "mdbreact";

export default function Pregnancy({ task, fontSize }) {
  const { results, data } = task;
  return (
    <div
      className="pl-5 mt-5 mb-5 offset-md-2"
      style={{ fontSize: `${fontSize}rem` }}
    >
      <MDBCol>
        {data.includes(67) && "PREGNANCY "}
        {data.includes(84) && "Fecal Occult Blood "}
        TEST:&nbsp;
        <b style={{ color: results ? "red" : "black" }}>
          {results ? "POSITIVE" : "NEGATIVE"}
        </b>
      </MDBCol>
    </div>
  );
}
