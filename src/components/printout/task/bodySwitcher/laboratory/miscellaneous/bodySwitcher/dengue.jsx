import React from "react";
import { MDBCol } from "mdbreact";

export default function Dengue({ task, fontSize }) {
  //console.log("task", task);
  const { ns1, igg, igm } = task?.results;
  return (
    <div className="offset-1" style={{ fontSize: `${fontSize}rem` }}>
      <MDBCol>
        <h6>
          {task.packages.includes(77) && "DENGUE SCREENING"}
          {task.packages.includes(120) && "TYPHOID ANTIBODY"}
          RESULTS :
        </h6>
        <div>
          <MDBCol size="11" className="offset-1 ">
            {task.packages.includes(77) && (
              <>
                NS1 Antigen:&nbsp;
                <b style={{ color: ns1 ? "red" : "black" }}>
                  {ns1 ? "POSITIVE" : "NEGATIVE"}
                </b>
                <br />
                Antibody :
                <br />
              </>
            )}
            <MDBCol md="11" className="offset-1">
              IgG:&nbsp;
              <b style={{ color: igg ? "red" : "black" }}>
                {igg ? "POSITIVE" : "NEGATIVE"}
              </b>
              <br />
              IgM:&nbsp;
              <b style={{ color: igm ? "red" : "black" }}>
                {igm ? "POSITIVE" : "NEGATIVE"}
              </b>
            </MDBCol>
          </MDBCol>
        </div>
      </MDBCol>
    </div>
  );
}
