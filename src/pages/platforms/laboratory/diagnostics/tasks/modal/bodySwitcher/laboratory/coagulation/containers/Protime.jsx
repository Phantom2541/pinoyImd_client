import React, { useEffect, useState } from "react";
import { MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { SetTASK } from "./../../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Protime = () => {
  const { theme } = useSelector(({ auth }) => auth),
    { task } = useSelector(({ validator }) => validator),
    [inr, setInr] = useState(0),
    [percent, setPercent] = useState(0),
    [pt, setPt] = useState([0, 0]),
    dispatch = useDispatch();

  useEffect(() => {
    const _pt = !!task.pt ? task.pt : [0, 0];
    setPt(_pt);
  }, [task]);

  useEffect(() => {
    if (!!task.pt && task.pt[0] > 0 && task.pt[1] > 0) {
      const _inr = task.pt[0] / task.pt[1];
      setInr(_inr.toFixed(2));

      const _per = (task.pt[1] / task.pt[0]) * 100;
      setPercent(_per.toFixed(2));
    } else {
      setInr(0);
      setPercent(0);
    }
  }, [task]);

  const handlePt = (e) => {
    const { name, value } = e.target;
    let _pt = [...(pt || [])];
    if (name === "patient") {
      _pt[0] = parseFloat(value);
    } else {
      _pt[1] = parseFloat(value);
    }
    dispatch(SetTASK({ task: { ...task, pt: _pt }, form: task.form }));
  };
  return (
    <MDBTable align="middle" responsive small>
      <MDBTableHead>
        <tr>
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
              icon="user"
              group
              type="number"
              name="patient"
              value={pt[0]}
              style={{
                fontWeight: 500,
                color: pt[0] > 13 ? "red" : pt[0] < 11 ? "blue" : "black",
              }}
              onChange={handlePt}
            />
          </td>
          <td>11.0-13.0 sec.</td>
        </tr>
        <tr className="text-center" key={`coagulation-control`}>
          <td>Control</td>
          <td className="py-0">
            <MDBInput
              label="Control"
              icon="cog"
              group
              style={{
                fontWeight: 500,
                color: pt[1] > 14.1 ? "red" : pt[1] < 10.7 ? "blue" : "black",
              }}
              type="number"
              name="control"
              value={pt[1]}
              onChange={handlePt}
            />
          </td>
          <td>10.7-14.1 sec. </td>
        </tr>
        <tr className="text-center" key={`coagulation-control`}>
          <td>INR</td>
          <td className="py-0">
            <MDBInput
              label="INR"
              icon="cog"
              group
              style={{
                fontWeight: 500,
                color: inr > 1.1 ? "red" : inr < 0.8 ? "blue" : "black",
              }}
              step="0.01"
              value={inr}
              readonly
            />
          </td>
          <td>0.8-1.1 %</td>
        </tr>
        <tr>
          <td>%Activity</td>
          <td className="py-0">
            <MDBInput
              label="%Activity"
              icon="cog"
              style={{
                fontWeight: 500,
              }}
              group
              step="0.01"
              value={`${percent} %`}
              readonly
            />
          </td>
          <td></td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
};

export default Protime;
