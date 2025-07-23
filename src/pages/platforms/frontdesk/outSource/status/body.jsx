import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { Services as service } from "../../../../../services/fakeDb";
import { properFullname } from "../../../../../services/utilities";
import "./style.css";
// import Swal from "sweetalert2";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ onBoardings }) => onBoardings
    ),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current spage
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  console.log("activepage", activePage);
  console.log("max", maxPage);

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Vendor</th>
          <th>Name of patient</th>
          <th>Services</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { id, status, services, pid, client } = item;
          const safeServices = Array.isArray(services) ? services : [];

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td
                title={new Date(item?.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              >
                {new Date(item?.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td>{item?.vendor?.displayname}</td>
              <td>{properFullname(pid?.fullName)}</td>

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

              <td>
                <span className={`status status-${status?.toLowerCase()}`}>
                  {status}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
