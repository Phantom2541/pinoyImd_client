import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
    ({ admission }) => admission
  );
  const dispatch = useDispatch();

  const [data, setData] = useState({
    admissionTime: "",
    admissionType: "",
    physician: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <MDBTable responsive hover>
      <tbody>
        <tr>
          <td className="pr-4 py-2 font-medium">Admission Date/Time</td>
          <td>
            <input
              className="w-full"
              type="datetime-local"
              name="admissionTime"
              value={data.admissionTime}
              onChange={onChange}
            />
          </td>
        </tr>
        <tr>
          <td className="pr-4 py-2 font-medium">Type of Admission</td>
          <td>
            <select
              className="w-full"
              name="admissionType"
              value={data.admissionType}
              onChange={onChange}
            >
              <option value="">Select Type</option>
              <option value="emergency">Emergency</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </td>
        </tr>
        <tr>
          <td className="pr-4 py-2 font-medium">Attending Physician</td>
          <td>
            <input
              className="w-full"
              type="text"
              name="physician"
              value={data.physician}
              onChange={onChange}
            />
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default Body;
