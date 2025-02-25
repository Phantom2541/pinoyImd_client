import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DESTROY } from "../../../../../../../services/redux/slices/responsibilities/controls";
import { MDBCard, MDBCardBody } from "mdbreact";
import Swal from "sweetalert2";
import TopHeader from "./header";
import CardTables from "./tables";
import Modal from "./modal";
import Pagination from "../../../../../../../components/pagination";
import TableRowCount from "../../../../../../../components/pagination/rows";

const Controls = () => {
  const { collections, isLoading } = useSelector(({ controls }) => controls),
    { token, maxPage } = useSelector(({ auth }) => auth),
    [controls, setControls] = useState([]),
    [totalPages, setTotalPages] = useState(1),
    [page, setPage] = useState(1),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [selected, setSelected] = useState({}),
    dispatch = useDispatch();

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    if (controls.length > 0) {
      let totalPages = Math.floor(controls.length / maxPage);
      if (controls.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);
      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [controls.length, maxPage, page]);

  useEffect(() => {
    setControls(collections);
  }, [collections]);

  const handleCreate = () => {
    setWillCreate(true);
    setShowModal(true);
  };

  const handleEdit = (control) => {
    setSelected(control);
    setWillCreate(false);
    setShowModal(true);
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

  // const handleDepartmentChange = (e) => {
  //   setSelectedDepartment(e.target.value);
  //   setSelectedComponent(""); // Reset component when department changes
  // };

  // const handleComponentChange = (e) => {
  //   setSelectedComponent(e.target.value);
  // };

  return (
    <>
      <MDBCard narrow className="pb-3">
        <TopHeader hasAction={true} handleCreate={handleCreate} />

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
