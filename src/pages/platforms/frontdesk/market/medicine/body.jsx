import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { Input } from "../../../../../components/customizable";
import {
  SetEDIT,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/market/medicines";
import Swal from "sweetalert2";

const Body = () => {
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
      ({ medicines }) => medicines
    ),
    [selected, setSelected] = useState({}),
    dispatch = useDispatch();

  const handleUpdate = () => {
    const { id, key, value, old } = selected;
    if (value !== old) {
      console.log("Updating:", { id, [key]: value });
    }
    setSelected({});
  };

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

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
      // if (result.isConfirmed) dispatch(DESTROY({ token, data: { _id } }));
    });
  };
  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Service</th>
          <th>Abbreviation</th>
          <th>Specimen</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, name, abbreviation, specimen } = item;
          // const isSelected = selected.id === id;
          return (
            <tr key={_id}>
              <td>{index + startIndex + 1}</td>

              <td>{specimen}</td>
              <td>
                <button
                  // onclick={() => handleUpdate(items)}
                  className="btn btn-primary"
                >
                  UPDATE
                </button>
                <button
                  onClick={() => handleDelete(_id)}
                  className="btn btn-danger"
                >
                  DELETE
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
