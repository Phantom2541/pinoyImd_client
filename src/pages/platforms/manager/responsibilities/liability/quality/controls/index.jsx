import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET,
  BROWSE,
  DESTROY,
} from "../../../../../../../services/redux/slices/responsibilities/controls";
import { MDBCard, MDBCardBody } from "mdbreact";
import Swal from "sweetalert2";
import Modal from "./modal";

import CardTables from "./tables";
import TopHeader from "../../../../../../../components/topHeader";
import Pagination from "../../../../../../../components/pagination";
import TableRowCount from "../../../../../../../components/pagination/rows";
import { globalSearch } from "../../../../../../../services/utilities";
const Controls = () => {
  const { collections, isLoading } = useSelector(({ controls }) => controls),
    { token, activePlatform, maxPage } = useSelector(({ auth }) => auth),
    [controls, setControls] = useState([]),
    [totalPages, setTotalPages] = useState(1),
    [page, setPage] = useState(1),
    dispatch = useDispatch(),
    // for Modal
    [showModal, setShowModal] = useState(false),
    [selected, setSelected] = useState({}),
    // for Create
    [willCreate, setWillCreate] = useState(true);

  const handleSearch = () => {
    const searchValue = document.getElementById("search").value;
    const results = globalSearch(controls, searchValue);
    console.log(results);
    setControls(results);
  };

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          params: {
            branchId: "637097f0535529a3a57e933e",
            year: 2023,
            month: 6,
          },
        })
      );
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    if (controls.length > 0) {
      let totalPages = Math.floor(controls.length / maxPage);
      if (controls.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [controls, page, maxPage]);

  //Set fetched data for mapping
  useEffect(() => {
    setControls(collections);
  }, [collections]);

  // Handale Create
  const handleCreate = () => {
    setWillCreate(true);
    setShowModal(true);
  };

  const handleEdit = (control) => {
    setWillCreate(false);
    setShowModal(true);
    setSelected(control);
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
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };

  return (
    <>
      <MDBCard narrow className="pb-3">
        <TopHeader
          title="Controls"
          handleSearch={handleSearch}
          handleCreate={handleCreate}
          hasAction={true}
        />

        <MDBCardBody>
          <CardTables
            controls={controls}
            page={page}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
          <div className="d-flex justify-content-between align-items-center px-4">
            <TableRowCount />
            <Pagination
              isLoading={isLoading}
              total={totalPages}
              page={page}
              setPage={setPage}
            />
          </div>
        </MDBCardBody>
      </MDBCard>
      <Modal
        show={showModal}
        toggle={toggleModal}
        willCreate={willCreate}
        selected={selected}
      />
    </>
  );
};

export default Controls;
