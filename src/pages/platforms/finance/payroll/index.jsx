import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BROWSE,
  RESET,
} from "../../../../services/redux/slices/responsibilities/payroll";

import { MDBCard, MDBCardBody } from "mdbreact";
// import Modal from "./modal";
import CardTables from "./tables";
import TopHeader from "../../../../components/topHeader";
import Pagination from "../../../../components/pagination";
import TableRowCount from "../../../../components/pagination/rows";

export default function Payroll() {
  const [payrolls, setPayrolls] = useState([]),
    // { token, activePlatform, branchId} = useSelector(({ auth }) => auth),
    { token, auth, branchId } = useSelector(({ auth }) => auth),
    { activePlatform } = auth,
    { collections, isLoading } = useSelector(({ payrolls }) => payrolls),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [showModal, setShowModal] = useState(false),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    dispatch = useDispatch();
    
//  console.log(payrolls);
  //Initial Browse
  useEffect(() => {
    if ((token)) dispatch(BROWSE({ token, branchId:activePlatform.branchId }));
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);
 console.log(branchId);

  //Set fetched data for mapping
  useEffect(() => {
    console.log(collections);
    setPayrolls(collections);
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
            payrolls={payrolls}
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
      {/* <Modal
        selected={selected}
        show={showModal}
        toggle={toggleModal}
        willCreate={willCreate}
      /> */}
    </>
  );
}
