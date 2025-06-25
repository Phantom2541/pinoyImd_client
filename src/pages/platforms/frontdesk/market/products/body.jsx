import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
import Swal from "sweetalert2";

import {
  SetEDIT,
  DESTROY,
} from "../../../../../services/redux/slices/market/products";

const Body = () => {
  const { filtered, activePage, maxPage } = useSelector(
      ({ products }) => products
    ),
    [selected, setSelected] = useState({});

  console.log("filteredzzzz", filtered);

  //THIS IS NOT NESSECARY(?) SAID BY MELUIN. the two lines under these are called by dispatch
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  //DONT FORGET REALLY IMPORTANT  ( ALEARDY ON LINE  18)
  //const dispatch = useDispatch();

  //note here for this function (MADE BY MELUIN) MY NOTE: THIS IS THE DISPATCH AND THE USESELECTOR. USERSELECTOR IS THE REDUX STORE AND IT GETS THE DATA FROM THE REDUX STORE PLS REMEMBER IM LOSING IT HERE
  const { collections } = useSelector(({ products }) => products),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  console.log("collections", collections);

  // let it go, let it go, dont use this code anymore~
  const handleUpdate = () => {
    const { _id, key, value } = selected;
    console.log("selected", { _id, [key]: value });

    // dispatch here to update the selected item (said template so here ya go (taken from header))
    //NOTE TO SELF: THERE IS NO DISPATCH YET (NVM THERE IS ON LINE 14)

    setSelected({}); //idk what this is yet: SIR SAID SMTH ABT THIS ASK MELUIN FOR MORE INFORMATION
  };

  // let it go, let it go, dont use this code anymore~
  const handleSelected = (data) => {
    const { _id, ...val } = data; // template note: on handling data from collection, please use _id
    const [key] = Object.keys(val);
    const value = val[key];

    console.log("data", data);

    console.log("selected", { _id, key, value });

    // template note: If already selected, toggle off
    if (selected?._id === _id) {
      setSelected({});
    } else {
      setSelected({ _id, key, value, old: val[key] });
    }
  };
  // let it go, let it go, dont use this code anymore~ (the code above is the template code)

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered?.slice(startIndex, endIndex); // Get only items for the active page

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this! if you want to you will be not so sigmaballs",
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

  const handleModal = (item) => dispatch(SetEDIT(item));
  console.log("paginatedData", paginatedData);
  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>name</th>
          <th>Soob Name</th>
          <th>Barcode</th>
          <th>Actions button</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData &&
          paginatedData?.map((item, index) => {
            const { _id, name, subname, barcode } = item;
            const isSelected = selected._id === _id;
            return (
              <tr key={index}>
                <td key={index}>{index + startIndex + 1}</td>
                <td>
                  <strong>{name}</strong>
                </td>
                <td>
                  <strong>{subname}</strong>
                </td>
                <td>
                  <strong>{barcode}</strong>
                </td>

                <td>
                  <MDBBtn color="primary" onClick={() => handleModal(item)}>
                    EDIT
                  </MDBBtn>

                  <MDBBtn color="secondary" onClick={() => handleDelete(_id)}>
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
