import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
import {
  SetEDIT,
  DESTROY,
} from "./../../../../services/redux/slices/market/attendances";
import Swal from "sweetalert2";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ attendances }) => attendances
    ),
    dispatch = useDispatch();

  const { token } = useSelector(({ auth }) => auth);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You Might Want To Reconsider Your Decision",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ data: { _id }, token }));
      }
    });
  };

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>IN</th>
          <th>OUT</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, in: inVal, out, status } = item;

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <b>{inVal}</b>
              </td>
              <td>
                <b>{out}</b>
              </td>
              <td>
                <b>{status}</b>
              </td>
              <td>
                <MDBBtn
                  color="info"
                  size="sm"
                  rounded
                  onClick={() => dispatch(SetEDIT(item))}
                >
                  UPDATE
                </MDBBtn>

                <MDBBtn
                  color="danger"
                  size="sm"
                  rounded
                  onClick={() => handleDelete(_id)}
                >
                  DELETE
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
