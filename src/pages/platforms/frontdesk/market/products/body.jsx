import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
import { DESTROY, SetEDIT } from "../../../../../services/redux/slices/market/products";
import Swal from "sweetalert2";


const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(({ products }) => products),
    dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "THIS IS INEVITABLE!! ",
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

  console.log("filteredzzz", filtered);
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
          <th>Is Consumes</th>
          <th>Actions</th>
          
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
        const { _id, name, subname, isConsumable } = item;

          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td><b>{name}</b></td>
              <td><b>{subname}</b></td>
              <td><b>{isConsumable ? "Yes" : "No"}</b></td>
              <td>
                <MDBBtn
                  color="warning"
                  size="sm"
                  onClick={()=> dispatch(SetEDIT(item))}
                >UPDATEZ</MDBBtn>

                <MDBBtn
                  color="red"
                  size="sm"
                onClick={() => handleDelete(_id)}
                >DELETEZ</MDBBtn>


              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
