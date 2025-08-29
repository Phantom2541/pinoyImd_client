import { useEffect, useState } from "react";
import { MDBInput, MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { SetTASK } from "./../../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

const Aptt = () => {
  const { task } = useSelector(({ validator }) => validator),
    [data, setData] = useState([0, 0]),
    dispatch = useDispatch();

  useEffect(() => {
    const _aptt = !!task.aptt?.length ? task.aptt : [0, 0];
    setData(_aptt);
  }, [task]);

  const handleAptt = (e) => {
    const { name, value } = e.target;
    let aptt = [...(data || [])];
    if (name === "patient") {
      aptt[0] = parseFloat(value);
    } else {
      aptt[1] = parseFloat(value);
    }
    dispatch(SetTASK({ task: { ...task, aptt }, form: task?.form }));
  };
  return (
    <MDBTable align="middle" responsive small className="mt-n2">
      <MDBTableHead>
        <tr>
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
              style={{
                fontWeight: 500,
                color: data[0] > 39 ? "red" : data[0] < 24 ? "blue" : "black",
              }}
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
              style={{
                fontWeight: 500,
                color: data[1] > 39 ? "red" : data[1] < 24 ? "blue" : "black",
              }}
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
