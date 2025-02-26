import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody } from "mdbreact";
import TopHeader from "./header";
import CardTables from "./tables";
import Modal from "./modal";
import Pagination from "../../../../../../components/pagination";
import TableRowCount from "../../../../../../components/pagination/rows";

const Assurances = () => {
  const { collections } = useSelector(({ assurances }) => assurances),
    { maxPage } = useSelector(({ auth }) => auth),
    [totalPages, setTotalPages] = useState(1),
    [page, setPage] = useState(1),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [selected, setSelected] = useState({});

  const toggleModal = () => setShowModal(!showModal);

  useEffect(() => {
    if (collections.length > 0) {
      let totalPages = Math.floor(collections.length / maxPage);
      if (collections.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);
      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [collections, maxPage, page]);

  const handleCreate = () => {
    setWillCreate(true);
    setShowModal(true);
  };

  return (
    <>
      <MDBCard narrow className="pb-3">
        <TopHeader hasAction={true} handleCreate={handleCreate} />
        <MDBCardBody>
          <CardTables
            page={page}
            setSelected={setSelected}
            setWillCreate={setWillCreate}
            setShowModal={setShowModal}
          />
          <div className="d-flex justify-content-between align-items-center px-4">
            <TableRowCount />
            <Pagination total={totalPages} page={page} setPage={setPage} />
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

export default Assurances;
