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
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ sources }) => sources),
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

  const toggleModal = () => setShowModal(!showModal);

  // Handale Update
  const handleUpdate = (selected) => {
    setSelected(selected);
    setWillCreate(false);
    setShowModal(true);
  };

  // Handale Create
  const handleCreate = () => {
    setWillCreate(true);
    setShowModal(true);
  };

  return (
    <>
      <MDBCard narrow className="pb-3">
        <TopHeader title="Vendors" />

        <MDBCardBody>
          <CardTables vendors={vendors} page={page} />

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
