import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdbreact";
import { UPDATE } from "../../../../services/redux/slices/diagnostics/clinic/appointments";
import { capitalize, fullName } from "../../../../services/utilities";
import { EditableSelect } from "../../../../components/customizable";
import visitTypes from "./visitTypes";
const Body = () => {
  const { filtered, activePage, maxPage, formSubmitted, isSuccess } =
      useSelector(({ appointments }) => appointments),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleUpdate = (data) => {
    console.log("userdata", data);

    dispatch(UPDATE({ token, data }));
  };
  // Pagination
  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>No.</th>
          <th>Patient</th>
          <th>Visit Type</th>
          <th className="text-center">Laboratory</th>
          <th className="text-center">Radiology</th>
          <th className="text-center" title="electronic Medical Records">
            eMR
          </th>
          <th title="Vital Sign">VS</th>
          <th>Remarks</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {paginatedData.map((item, index) => {
          const {
            patient,
            remarks,
            status,
            hasLab,
            hasRadiology,
            qn,
            visitType,
            ehr,
            consultation,
            _id,
          } = item;
          return (
            <tr key={index}>
              <td>{qn}</td>
              <td>
                {fullName(patient?.fullName)}{" "}
                <MDBBadge
                  color={status === "confirmed" ? "success" : "info"}
                  className="ml-2"
                >
                  <EditableSelect
                    preValue={status}
                    keyForText="status"
                    keyForValue="status"
                    isEditable
                    collections={["draft", "confirmed", "cancelled"]}
                    fieldData={{
                      _id,
                      status: status,
                    }}
                    onSave={handleUpdate}
                    formSubmitted={formSubmitted}
                    isSuccess={isSuccess}
                  />
                </MDBBadge>
              </td>
              <td>
                <EditableSelect
                  preValue={visitType}
                  keyForText="visitType"
                  // keyForValue="visitType"
                  isEditable
                  collections={visitTypes}
                  fieldData={{
                    _id,
                    status: visitType,
                  }}
                  onSave={handleUpdate}
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                />
              </td>
              <td className="text-center">
                <MDBIcon
                  size="lg"
                  icon={hasLab ? "check" : "times"}
                  style={{ color: hasLab ? "green" : "black" }}
                />
              </td>
              <td className="text-center">
                <MDBIcon
                  size="lg"
                  icon={hasRadiology ? "check" : "times"}
                  style={{ color: hasRadiology ? "green" : "black" }}
                />
              </td>
              <td>{ehr ? "yes" : "no"}</td>
              <td>{consultation ? "yes" : "no"} </td>
              <td>{remarks}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Body;
