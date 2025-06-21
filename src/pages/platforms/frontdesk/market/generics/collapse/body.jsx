import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "../../../../../../components/searchables";
import {
  DESTROY,
  SetEDIT,
  SetCREATE,
  SetFILTER,
} from "../../../../../../services/redux/slices/market/medicines";
import Swal from "sweetalert2";

export default function Collapsable({ generics, brands }) {
  const { token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const handleUpdate = (generics, item) => {
    dispatch(SetEDIT(generics, item));
  };

  const handleAdd = (item) => {
    dispatch(SetCREATE(item));
  };

  const handleDelete = (brands) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) dispatch(DESTROY({ token, data: { brands } }));
    });
  };
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Form</th>
          <th>Pack</th>
          <th>Size</th>
          <th>Purpose</th>
          <th>Status</th>
          <th clasName="d-flex align-item-center">
            Action
            <Search
              collections={brands}
              SetFiltered={(items) => dispatch(SetFILTER(items))}
              placeHolder="Search Medicines"
              HaveAction={true}
              reset={() => dispatch(SetFILTER(brands))}
              hideButton={false}
              handleAdd={(item) => handleAdd(item)}
            ></Search>
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {brands?.map((brand, index) => {
          const { subname, packages, purpose, status } = brand,
            { pack, size } = packages;

          const formattedPack = pack
            ? `${pack.v} ${pack.u} / ${pack.q} ${pack.b}`
            : "";
          return (
            <tr key={index}>
              <td>{++index}</td>
              <td>{subname}</td>
              <td>{formattedPack}</td>
              <td>{size}</td>

              <td>{purpose}</td>
              <td>{status}</td>
              <td>
                <button
                  onClick={() => handleUpdate({ generics, brand })}
                  className="btn btn-success"
                  style={{ borderRadius: "10px", padding: "3.5px 10px" }}
                >
                  UPDATE
                </button>
                <button
                  onClick={() => handleDelete(brands)}
                  className="btn btn-danger"
                  style={{ borderRadius: "10px", padding: "3.5px 10px" }}
                >
                  DELETE
                </button>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
