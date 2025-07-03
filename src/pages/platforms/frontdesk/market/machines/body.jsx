import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBIcon, MDBTable } from "mdbreact";
import {
  SetEDIT,
  DESTROY,
} from "../../../../../services/redux/slices/market/machines";
import Swal from "sweetalert2";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ machines }) => machines
    ),
    dispatch = useDispatch();

  console.log("SHOWING BODY", filtered);

  const { token } = useSelector(({ auth }) => auth);

  const handleDelete = (item) => {
    Swal.fire({
      title: `Delete "${item.model} ${item.brand}"?`,
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

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Serial No.</th>
          <th>Accuqired</th>
          <th className="text-center">LIS Capable</th>
          <th>Status</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const {
            _id,
            model,
            brand,
            serial,
            accuqired,
            status,
            price,
            lisCapable = false,
            section = "",
          } = item;

          return (
            <tr key={_id}>
              <td>{index + startIndex + 1}</td>
              <td>
                <b>
                  <h6>{model}</h6>
                  <small className="mt-n1 d-block">{brand}</small>
                </b>
              </td>
              <td>
                <b>{serial}</b>
              </td>
              <td>
                <b>{accuqired}</b>
              </td>
              <td className="text-center">
                {lisCapable ? (
                  <>
                    <MDBIcon icon="check" className="mr-2 text-success" />
                    {section}
                  </>
                ) : (
                  <MDBIcon icon="times" className="text-danger" />
                )}
              </td>
              <td>
                <b>{status}</b>
              </td>
              <td>
                <b>{price}</b>
              </td>

              <td>
                <MDBBtn
                  size="sm"
                  color="blue"
                  onClick={() => dispatch(SetEDIT(item))}
                >
                  Update
                </MDBBtn>

                <MDBBtn
                  size="sm"
                  color="danger"
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
