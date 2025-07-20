import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { SetEDIT } from "../../../../../services/redux/slices/reusable/table";
import { RESET } from "../../../../../services/redux/slices/assets/companies";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ services }) => services
    ),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Branch</th>
          <th>Patient Name</th>
          <th>Age / Development</th>
          <th>Technician</th>
          <th>Requested Procedure</th>
          <th>Remarks</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { id } = item;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>

              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    color="danger"
                    size="sm"
                    rounded
                    onClick={() => dispatch(RESET(id))}
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    rounded
                    onClick={() => dispatch(SetEDIT(item))}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
