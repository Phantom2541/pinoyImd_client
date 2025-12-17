import { useEffect, useState } from "react";
import { MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { SetTASK } from "./../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Protime = () => {
  // const { theme } = useSelector(({ auth }) => auth),
  const { task } = useSelector(({ validator }) => validator),
    [pt, setPt] = useState([0, 0]),
    dispatch = useDispatch();

  useEffect(() => {
    const _pt = !!task.pt ? task.pt : [0, 0];
    setPt(_pt);
  }, [task]);

  const computeINR_ACTIVE = (pt) => {
    const _pt = [...pt];
    const _inr = pt[0] / pt[1];
    const _per = (pt[1] / pt[0]) * 100;
    _pt[2] = _inr.toFixed(2);
    _pt[3] = _per.toFixed(2);
    return _pt;
  };

  const handlePt = (e) => {
    const { name, value } = e.target;
    let _pt = [...(pt || [])];
    const numValue = parseFloat(value) || 0; // ✅ fallback sa 0 kapag empty

    if (name === "patient") {
      _pt[0] = numValue;
      _pt = computeINR_ACTIVE(_pt);
    } else if (name === "control") {
      _pt[1] = numValue;
      _pt = computeINR_ACTIVE(_pt);
    } else if (name === "inr") {
      _pt[2] = numValue;
    } else {
      _pt[3] = numValue;
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
              type="number"
              style={{
                fontWeight: 500,
                color: pt[2] > 1.1 ? "red" : pt[2] < 0.8 ? "blue" : "black",
              }}
              step="0.01"
              name="inr"
              value={pt[2]}
              onChange={handlePt}
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
              type="number"
              style={{
                fontWeight: 500,
              }}
              group
              step="0.01"
              value={pt[3]}
              onChange={handlePt}
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
