import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "../../../../../services/redux/slices/market/products";
import Swal from "sweetalert2";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ products }) => products
    ),
    dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);

  const handleDelete = (item) => {
    Swal.fire({
      title: `Delete "${item.name}"?`,
      text: "This process cannot be reverted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ data: { _id: item._id }, token }));
      }
    });
  };

  // Pagination: Calculate the start and end index for the current page
  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);
  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>SubName</th>
          <th>Consumable</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { name, subname, isConsumable } = item;

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <b>{name}</b>
              </td>
              <td>
                <b>{subname}</b>
              </td>
              <td>
                <b>{isConsumable ? "✔" : "✘"}</b>
              </td>
              <td>
                <MDBBtn
                  color="blue"
                  size="sm"
                  onClick={() => dispatch(SetEDIT(item))}
                >
                  Update
                </MDBBtn>

                <MDBBtn
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(item)}
                >
                  Delete
                </MDBBtn>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
