import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  SetEDIT,
  DESTROY,
} from "../../../../../services/redux/slices/market/mentainance";
import Swal from "sweetalert2";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage } = useSelector(
      ({ mentainance }) => mentainance
    ),
    dispatch = useDispatch();

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  const handleUpdate = (item) => {
    dispatch(SetEDIT(item));
    console.log("item", item);
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
      dispatch(DESTROY({ token, data: { _id } }));
    });
  };
  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Machine</th>
          <th>Engineer</th>
          <th>Purpose</th>
          <th>Recommendation</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, machineId, engineer, purpose, recommendations } = item;

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>

              <td>
                {machineId?.brand} {machineId?.model}
              </td>
              <td>{engineer}</td>
              <td>{purpose}</td>
              <td>{recommendations}</td>

              <td>
                <button
                  onClick={() => handleUpdate(item)}
                  className="btn btn-sm btn-primary"
                >
                  update
                </button>
                <button
                  onClick={() => handleDelete(_id)}
                  className="btn btn-sm btn-danger"
                >
                  delete
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
