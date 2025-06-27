import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable, MDBBadge } from "mdbreact";
import Swal from "sweetalert2";
import {
  SetSELECTED,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (hotlines) => {
    dispatch(SetSELECTED(hotlines));
    //console.log("SetSelected service :", service);
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Number</th>
          <th>Address</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((hotlines, index) => {
          const { _id, abbr, displayname, number, address } = hotlines;
          return (
            <tr key={`${index}-${_id}`}>
              <td key={index}>{index + startIndex + 1}</td>
              <td style={{ fontWeight: 400 }}>
                <div>{displayname}</div>

                <div className="text-muted">
                  {abbr ? (
                    // If not editing, show the abbreviation as a badge
                    <MDBBadge
                      title="Click me to update"
                      className="cursor-pointer"
                    >
                      {abbr}
                    </MDBBadge>
                  ) : (
                    <p className="mb-0">No abbreviation</p>
                  )}
                </div>
              </td>
              <td>{number} </td>
              <td>{address}</td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(hotlines)}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleDelete(hotlines._id)}
                    size="sm"
                    rounded
                    color="danger"
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
