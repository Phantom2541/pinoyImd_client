import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import CardTables from "./tables";
import Modal from "./modal";
import Pagination from "../../../../../../components/pagination";
import TableRowCount from "./../../../../../../components/pagination/rows";

const Controls = () => {
  const { collections, isLoading } = useSelector(({ controls }) => controls),
    { maxPage } = useSelector(({ auth }) => auth),
    [controls, setControls] = useState([]),
    [totalPages, setTotalPages] = useState(1),
    [page, setPage] = useState(1),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [selected, setSelected] = useState({});

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

  return (
    <>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <TopHeader
          hasAction={true}
          onCreate={handleCreate}
          setSelected={setSelected}
        />

        <MDBCardBody>
          <CardTables controls={controls} page={page} handleEdit={handleEdit} />
        </MDBCardBody>

        <div className="mb-auto d-flex justify-content-between align-items-center px-4">
          <TableRowCount />
          <Pagination
            isLoading={isLoading}
            total={totalPages}
            page={page}
            setPage={setPage}
          />
        </div>
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
