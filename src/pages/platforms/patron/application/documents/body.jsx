import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import { Policy } from "../../../../../services/fakeDb";
import { capitalize } from "lodash";
import { employment } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import { UPDATE } from "../../../../../services/redux/slices/assets/persons/applicants";
const Body = () => {
  const { collections, activePage, maxPage } = useSelector(
    ({ personnels }) => personnels
  );
  const { token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const reApply = (data) => {
    Swal.fire({
      title: "Do you want to re-apply on this company?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "yes",
      denyButtonText: `edit details`,
      denyButtonColor: "orange",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        dispatch(
          UPDATE({ token, data: { _id: data._id, status: "petition" } })
        );
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = collections.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <MDBTable responsive hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Company</th>
          <th>Branch </th>
          <th>Position</th>
          <th title="Status of Employment">SOE</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((app, index) => {
          const {
            branch = {},
            contract = {},
            status,
            remarks: history = [],
          } = app;
          const { name, companyId } = branch;
          const { soe, designation } = contract;
          const haveReason =
            employment.needReason(status) || status === "denied";
          const remarks = history[history?.length - 1]?.reason || "";
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <h5>{companyId?.name}</h5>
                <small className="mt-n2 d-block">{companyId?.subName}</small>
              </td>
              <td>{name} </td>
              <td>{Policy.getPositions(designation)}</td>
              <td>{soe || "-"}</td>
              <td>
                <span
                  className="rounded-circle shadow-sm mr-2"
                  style={{
                    backgroundColor: haveReason ? " #dc3545" : "#ffc107",
                    width: "0.65rem",
                    height: "0.65rem",
                    display: "inline-block",
                    position: "relative",
                    top: "0",
                    boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
                  }}
                ></span>
                <span style={{ fontWeight: 500 }}>{capitalize(status)}</span>
                {haveReason && <span className="d-block mt-n1">{remarks}</span>}
              </td>
              <td>
                <button
                  style={{
                    color: "white",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    textTransform: "capitalize",
                    border: "none",
                  }}
                  className="bg-primary"
                  onClick={() => reApply(app)}
                >
                  Re-apply
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
