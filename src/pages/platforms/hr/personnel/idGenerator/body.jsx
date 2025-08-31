import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { Cloudinary } from "../../../../../services/utilities";
import { TOGGLE } from "../../../../../services/redux/slices/assets/persons/personnels";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ personnels }) => personnels
    ),
    dispatch = useDispatch();

  const handleSelected = (index) => dispatch(TOGGLE(index + startIndex));

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
          <th>Avatar</th>
          <th>Name</th>
          <th>Position</th>
          <th>Guardian</th>
          <th>Phone</th>
          <th>Signature</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((staff, index) => {
          const { front, back } = staff;
          
          const { img, emp, empID, position, department } = front;
          const { address, guardian, pn, signature } = back;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <img
                  src={`${Cloudinary.getEndpoint()}/${img}`}
                  alt=""
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
              <td>
                <div className="d-flex flex-column">
                  <h4>{emp}</h4>
                  {empID}
                </div>
              </td>
              <td>
                <h5>{position}</h5>
                {department}
              </td>
              <td>
                <h5>{guardian}</h5>
                {address}
              </td>

              {/* <td>
                {isSelected && selected.key === "abbreviation" ? (
                  <div style={{ width: "13rem" }}>
                    <Input
                      _key={"value"}
                      className="mt-2 form-control form-control-sm"
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, val) =>
                        setSelected({ ...selected, [key]: val })
                      }
                      handleCheck={() => handleUpdate()}
                      handleClose={() => setSelected({})}
                    />
                  </div>
                ) : (
                  <strong onClick={() => handleSelected({ id, abbreviation })}>
                    {abbreviation}
                  </strong>
                )}
              </td> */}
              <td>{pn}</td>
              <td>
                <img
                  src={`${Cloudinary.getEndpoint()}/${signature}`}
                  alt=""
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    rounded
                    onClick={() => handleSelected(index)}
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
