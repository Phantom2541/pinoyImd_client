import React, { useEffect, useState } from "react";
import { MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { SETPARAMS } from "../../../../../../../../../../redux/slices/task/forms";

const Aptt = () => {
  const { theme } = useSelector(({ auth }) => auth),
    { params } = useSelector(({ task }) => task),
    [data, setData] = useState([0, 0]),
    dispatch = useDispatch();

  useEffect(() => {
    const _aptt = !!params.aptt?.length ? params.aptt : [0, 0];
    setData(_aptt);
  }, [params]);

  const handleAptt = (e) => {
    const { name, value } = e.target;
    let aptt = [...data];
    if (name === "patient") {
      aptt[0] = parseFloat(value);
    } else {
      aptt[1] = parseFloat(value);
    }
    dispatch(SETPARAMS({ ...params, aptt }));
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
          <th>Reference</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr className="text-center">
          <td>Patient</td>
          <td>
            <MDBInput
              label="Patient"
              icon="user"
              group
              type="number"
              name="patient"
              value={data[0]}
              className="mb-3 "
              onChange={handleAptt}
            />
          </td>
          <td>24-39 sec.</td>
        </tr>
        <tr className="text-center">
          <td>Control</td>
          <td>
            <MDBInput
              label="Control"
              icon="cog"
              group
              type="number"
              name="control"
              value={data[1]}
              className="mb-3 "
              onChange={handleAptt}
            />
          </td>
          <td>24-39 sec.</td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
};

export default Aptt;
