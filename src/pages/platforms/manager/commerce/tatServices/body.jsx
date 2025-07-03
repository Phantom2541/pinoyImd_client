import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { DESTROY } from "../../../../../services/redux/slices/assets/branches";
import { SetActivePlatform } from "../../../../../services/redux/slices/assets/persons/auth";
import Swal from "sweetalert2";

const Body = () => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage, collections } = useSelector(
      ({ branches }) => branches
    ),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  const handleDelete = (item) => {
    const { department, section, _id } = item;
    const { branch } = activePlatform;
    const _tat = [...collections];
    const index = _tat.findIndex((i) => i?._id === _id);
    _tat.splice(index, 1);
    // const _tat = collections.filter(
    //   (item) => item.department !== department && item.section !== section
    // );
    Swal.fire({
      title: `Delete ${department} ${section} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Create a new array excluding the item at index
        // const updatedTat = _tat.filter((_, i) => i !== indexToDelete);

        dispatch(DESTROY({ token, data: { _id: branch._id, tat: _tat } })).then(
          () => {
            dispatch(SetActivePlatform({ data: _tat }));
          }
        );
      }
    });
  };

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Department</th>
          <th>Section</th>
          <th>Expected Time</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, department, section, expectedAt } = item;

          return (
            <tr key={_id || index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                {department === "RAD"
                  ? "Radiology"
                  : department === "LAB"
                  ? "Laboratory"
                  : department}
              </td>
              <td>{section}</td>
              <td>{expectedAt}</td>

              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    color="danger"
                    size="sm"
                    rounded
                    onClick={() => handleDelete(item)}
                  >
                    <MDBIcon icon="trash" />
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
