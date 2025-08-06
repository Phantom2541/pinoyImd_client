import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
// import { Input } from "../../../../../components/customizable";
import {
  SetEDIT,
  DESTROY,
} from "../../../../../services/redux/slices/market/productsGenerics";

const Body = () => {
  //THIS IS NOT NESSECARY(?) SAID BY MELUIN. the two lines under these are called by dispatch
  // const [showModal, setShowModal] = useState(false);
  // const [modalData, setModalData] = useState(null);

  //DONT FORGET REALLY IMPORTANT  ( ALEARDY ON LINE  18)
  //const dispatch = useDispatch();

  //note here for this function (MADE BY MELUIN) MY NOTE: THIS IS THE DISPATCH AND THE USESELECTOR. USERSELECTOR IS THE REDUX STORE AND IT GETS THE DATA FROM THE REDUX STORE PLS REMEMBER IM LOSING IT HERE
  const { collections } = useSelector(
      ({ productsGenerics }) => productsGenerics
    ),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  console.log("collections", collections);

  //THIS IS ... asky tommy abou this???(idk reeall ejhaoefoifhPHPEIFHPOEHPO4ihjf)
  const { filtered, activePage, maxPage } = useSelector(
      ({ productsGenerics }) => productsGenerics
    ),
    [selected, setSelected] = useState({}); // so this bassically is the selected item and its properties. useState({});  means nothing is selected

  // let it go, let it go, dont use this code anymore~
  // const handleUpdate = () => {
  //   const { _id, key, value } = selected;
  //   console.log("selected", { _id, [key]: value });

  //   // dispatch here to update the selected item (said template so here ya go (taken from header))
  //   //NOTE TO SELF: THERE IS NO DISPATCH YET (NVM THERE IS ON LINE 14)

  //   setSelected({}); //idk what this is yet: SIR SAID SMTH ABT THIS ASK MELUIN FOR MORE INFORMATION
  // };

  // // let it go, let it go, dont use this code anymore~
  // const handleSelected = (data) => {
  //   const { _id, ...val } = data; // template note: on handling data from collection, please use _id
  //   const [key] = Object.keys(val);
  //   const value = val[key];

  //   console.log("data", data);

  //   console.log("selected", { _id, key, value });

  //   // template note: If already selected, toggle off
  //   if (selected?._id === _id) {
  //     setSelected({});
  //   } else {
  //     setSelected({ _id, key, value, old: val[key] });
  //   }
  // };
  // let it go, let it go, dont use this code anymore~ (the code above is the template code)

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  const handleModal = (item) => dispatch(SetEDIT(item));

  return (
    <MDBTable responsive hover bordered>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Section</th>
          <th>Expense</th>
          <th>Action Man</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, name, section, expense } = item;
          // const isSelected = selected._id === _id;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <strong>{name}</strong>
              </td>
              <td>
                <strong>{section}</strong>
              </td>
              <td>
                <strong>{expense}</strong>
              </td>

              <td>
                <MDBBtn color="primary" onClick={() => handleModal(item)}>
                  EDIT
                </MDBBtn>

                <MDBBtn
                  color="secondary"
                  onClick={() => dispatch(DESTROY({ data: { _id }, token }))}
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
