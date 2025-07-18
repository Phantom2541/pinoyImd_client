import { useDispatch, useSelector } from "react-redux";
import { MDBBadge, MDBTable } from "mdbreact";
import { Services as service } from "../../../../../services/fakeDb";
import "./style.css";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ onBoardings }) => onBoardings
    ),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Company</th>
          <th>Services</th>
          <th>Schedule</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { branchId, services, schedule, status, remarks } = item;
          const safeServices = Array.isArray(services) ? services : [];

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>{branchId?.displayname}</td>
              <td>
                {safeServices.map((id, i) => {
                  const s = service.find(id);
                  return (
                    <span
                      key={id}
                      title={s?.name || `No name found for: ${id}`}
                    >
                      {s?.abbreviation || `No abbr found for (${id})`}
                      {i < safeServices.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </td>
              <td
                title={new Date(schedule).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              >
                <h6>{schedule}</h6>
                <MDBBadge
                  className={`text-uppercase status-badge status-${status?.toLowerCase()}`}
                >
                  {status}
                </MDBBadge>
              </td>
              <td>{remarks}</td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
