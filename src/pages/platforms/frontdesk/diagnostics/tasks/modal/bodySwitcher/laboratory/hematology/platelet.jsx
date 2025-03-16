import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPARAMS } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";

export default function Platelet() {
   const {apc} = useSelector(({validator}) => validator.task),
    dispatch = useDispatch();


  const handleChange = (e) =>
    dispatch(SetPARAMS({ key: "apc", value: parseFloat(e.target.value) }));


  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-1">Category</th>
          <th className="py-1">Result</th>
          <th className="py-1">Reference</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="py-1">Platelet Count</td>
          <td className="py-1">
            <input
              type="number"
              style={{
                color: apc < 150 || (apc > 400 && "red"),
              }}
              value={String(apc)}
              onChange={handleChange}
              className="w-100 text-center fw-bold"
            />
          </td>
          <td className="py-1">
            150-450 <sup>9</sup>/L
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
