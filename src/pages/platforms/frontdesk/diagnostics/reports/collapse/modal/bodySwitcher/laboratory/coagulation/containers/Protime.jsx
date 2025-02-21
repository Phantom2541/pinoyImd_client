import React, { useEffect, useState } from "react";
import { MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { SETPARAMS } from "../../../../../../../../../../redux/slices/task/forms";

const Protime = () => {
  const { theme } = useSelector(({ auth }) => auth),
    { params } = useSelector(({ task }) => task),
    [inr, setInr] = useState(),
    [percent, setPercent] = useState(),
    [pt, setPt] = useState([0, 0]),
    dispatch = useDispatch();

  useEffect(() => {
    const _pt = !!params.pt ? params.pt : [0, 0];
    setPt(_pt);
  }, [params]);

  useEffect(() => {
    if (
      !!params.pt &&
      params.pt[0] !== null &&
      !!params.pt &&
      params.pt[1] !== null
    ) {
      const _inr = params.pt[0] / params.pt[1];
      setInr(_inr.toFixed(2));
      const _per = (params.pt[1] / params.pt[0]) * 100;
      setPercent(_per.toFixed(2));
    }
  }, [params]);
  const handlePt = (e) => {
    const { name, value } = e.target;
    let _pt = [...pt];
    if (name === "patient") {
      _pt[0] = parseFloat(value);
    } else {
      _pt[1] = parseFloat(value);
    }
    dispatch(SETPARAMS({ ...params, pt: _pt }));
  };
  return (
    <MDBTable
      align="middle"
      hover
      responsive
      small
      color={theme.color}
      className="mt-2"
      striped
    >
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
              icon="user"
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
              icon="cog"
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
        <tr className="text-center" key={`coagulation-control`}>
          <td>INR</td>
          <td>
            <MDBInput
              label="INR"
              icon="cog"
              group
              step="0.01"
              className="mb-3 "
              value={inr}
              readonly
            />
          </td>
          <td>0.8-1.1 %</td>
        </tr>
        <tr>
          <td>%Activity</td>
          <td>
            <MDBInput
              label="INR"
              icon="cog"
              group
              step="0.01"
              className="mb-3 "
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
