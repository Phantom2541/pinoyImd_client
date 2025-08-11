import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import { SetEDIT, TOGGLE } from "../../../../services/redux/slices/reusable/table";
import { DESTROY } from "../../../../services/redux/slices/market/products";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(({ products }) => products);
  const dispatch = useDispatch();

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <MDBTable responsive hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.map((item, index) => {
          const { _id, name, price, category } = item;
          return (
            <tr key={_id}>
              <td>{startIndex + index + 1}</td>
              <td>{name}</td>
              <td>{price}</td>
              <td>{category}</td>
              <td>
                <MDBBtnGroup>
                  <MDBBtn
                    color="danger"
                    size="sm"
                    rounded
                    onClick={() => dispatch(DESTROY({ data: { _id } }))}
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                  <MDBBtn
                    color="primary"
                    size="sm"
                    rounded
                    onClick={() => {
                      dispatch(SetEDIT(item));
                      dispatch(TOGGLE());
                    }}
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
