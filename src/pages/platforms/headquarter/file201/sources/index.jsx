import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/source";

import { MDBCard, MDBCardBody } from "mdbreact";
import Modal from "./modal";
import CardTables from "./tables";
import TopHeader from "../../../../../components/topHeader";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";

export default function Sources() {
  const [vendors, setVendors] = useState([]),
    { token, onDuty, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ sources }) => sources),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [showModal, setShowModal] = useState(false),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if ((token, activePlatform.branchId))
      dispatch(BROWSE({ token, vendors: activePlatform.branchId }));
    console.log(activePlatform.branchId);
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform.branchId]);

  useEffect(() => {
    if (vendors.length > 0) {
      let totalPages = Math.floor(vendors.length / maxPage);
      if (vendors.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [vendors, page, maxPage]);

  //Set fetched data for mapping
  useEffect(() => {
    //console.log(collections);
    setVendors(collections);
  }, [collections]);

  // for modal
  const toggleModal = () => setShowModal(!showModal);

  // for update
  const handleUpdate = (selected) => {
    setSelected(selected);
    setWillCreate(false);
    setShowModal(true);
  };

  // for create
  const handleCreate = () => {
    setWillCreate(true);
    setShowModal(true);
  };

  return (
    <>
      <MDBCard narrow className="pb-3">
        <TopHeader title="Company Source" />

        <MDBCardBody>
          <CardTables
            vendors={vendors}
            page={page}
            setSelected={setSelected}
            setWillCreate={setWillCreate}
            setShowModal={setShowModal}
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
        selected={selected}
        show={showModal}
        toggle={toggleModal}
        willCreate={willCreate}
      />
    </>
  );
}
