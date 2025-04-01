import React, { useEffect, useState } from "react";
import { MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

const Protime = ({ task, setTask }) => {
  const [inr, setInr] = useState(),
    [percent, setPercent] = useState(),
    [pt, setPt] = useState([0, 0]);

  useEffect(() => {
    const _pt = !!task.pt ? task.pt : [0, 0];
    setPt(_pt);
  }, [task]);

  useEffect(() => {
    if (!!task.pt && task.pt[0] !== null && !!task.pt && task.pt[1] !== null) {
      const _inr = task.pt[0] / task.pt[1];
      setInr(_inr.toFixed(2));
      const _per = (task.pt[1] / task.pt[0]) * 100;
      setPercent(_per.toFixed(2));
    }
  }, [task]);
  const handlePt = (e) => {
    const { name, value } = e.target;
    let _pt = [...pt];
    if (name === "patient") {
      _pt[0] = parseFloat(value);
    } else {
      _pt[1] = parseFloat(value);
    }
    setTask({
      ...task,
      pt: _pt,
    });
  };
  return (
    <MDBTable align="middle" hover responsive small className="mt-2" striped>
      <MDBTableHead>
        <tr className="text-center border">
          <th>Name</th>
          <th>Results</th>
          <th style={{ width: 200 }}>Reference</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr className="text-center" key={`coagulation-patient`}>
          <td>Patient</td>
          <td>
            <MDBInput
              label="Patient"
              // icon="user"
              group
              type="number"
              className="mb-3 "
              name="patient"
              value={pt[0]}
              onChange={handlePt}
            />
          </td>
          <td>11.0-13.0 sec.</td>
        </tr>
        <tr className="text-center" key={`coagulation-control`}>
          <td>Control</td>
          <td>
            <MDBInput
              label="Control"
              // icon="cog"
              group
              type="number"
              name="control"
              className="mb-3 "
              value={pt[1]}
              onChange={handlePt}
            />
          </td>
          <td>10.7-14.1 sec. </td>
        </tr>
        <tr className="text-center" key={`coagulation-INR`}>
          <td>INR</td>
          <td>
            <MDBInput
              label="INR"
              // icon="cog"
              group
              step="0.01"
              className="mb-3 "
              value={inr}
              readOnly
            />
          </td>
          <td>0.8-1.1 %</td>
        </tr>
        <tr key={`coagulation-Activity`}>
          <td>%Activity</td>
          <td>
            <MDBInput
              label="INR"
              // icon="cog"
              group
              step="0.01"
              className="mb-3 "
              value={`${percent} %`}
              readOnly
            />
          </td>
          <td></td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
};

export default Protime;
