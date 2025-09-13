import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBIcon,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdbreact";
import { capitalize, fullName } from "../../../../services/utilities";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ appointments }) => appointments
    ),
    dispatch = useDispatch();

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
                  {capitalize(status)}
                </MDBBadge>
              </td>
              <td>{visitType}</td>
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
