import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  SetEDIT,
  DESTROY,
} from "../../.././../../services/redux/slices/market/machines";
import Swal from "sweetalert2";
import { currency } from "../../../../../services/utilities";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage } = useSelector(
      ({ machines }) => machines
    ),
    dispatch = useDispatch();

  console.log("filtered", filtered);
  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page
  const handleUpdate = (item) => {
    dispatch(SetEDIT(item));
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
        console.log("handleDelete id", _id);
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Brand</th>
          <th>Model</th>
          <th>Serial no.</th>
          <th>Acquired</th>
          <th>Status</th>
          <th>Price</th>
          <th>Warranty</th>
          <th title="Preventive maintenance">PM</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const {
            _id,
            brand,
            model,
            serial,
            accuqired,
            status,
            warranty,
            price,
            pm,
          } = item;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>

              <td>{brand}</td>
              <td>{model}</td>
              <td>{serial}</td>
              <td style={{ textTransform: "capitalize" }}>{accuqired}</td>
              <td style={{ textTransform: "capitalize" }}>{status}</td>
              <td>{currency(price)}</td>
              <td>{warranty}</td>
              <td>{`${pm.value} ${pm.unit}`}</td>
              <td>
                <button
                  onClick={() => handleUpdate(item)}
                  className="btn btn-sm btn-primary"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(_id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
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
