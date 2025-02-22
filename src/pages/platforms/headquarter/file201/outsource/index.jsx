import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";
import { MDBCard, MDBCardBody } from "mdbreact";
import Modal from "./modal";
import CardTables from "./tables";
import TopHeader from "../../../../../components/topHeader";
import Pagination from "../../../../../components/pagination";
import TableRowCount from "../../../../../components/pagination/rows";

export default function Sources() {
  const [vendors, setVendors] = useState([]),
    { token, onDuty, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ providers }) => providers),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [showModal, setShowModal] = useState(false),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [didSearch, setSearchKey] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && onDuty._id)
      dispatch(BROWSE({ token, key: { clients: "650fda4617d20470229e2c8d" } }));
    return () => dispatch(RESET());
  }, [token, dispatch, onDuty._id]);

  useEffect(() => {
    if (vendors.length > 0) {
      let totalPages = Math.ceil(vendors.length / maxPage);
      setTotalPages(totalPages);
      if (page > totalPages) setPage(totalPages);
    }
  }, [vendors, page, maxPage]);

  useEffect(() => {
    setVendors(collections);
  }, [collections]);

  const toggleModal = () => setShowModal(!showModal);

  const handleUpdate = (selected) => {
    setSelected(selected);
    setWillCreate(false);
    setShowModal(true);
  };

  const handleCreate = () => {
    setWillCreate(true);
    setSelected({});
    setShowModal(true);
  };

  const handleSearch = () => {
    const searchInput = document.getElementById("search");
    const searchValue = searchInput?.value.toLowerCase().trim();

    if (!searchValue) {
      setSearchKey("");
      setVendors(collections);
      return;
    }

    setSearchKey(searchValue);
    const filteredVendors = collections.filter((vendor) =>
      vendor.name.toLowerCase().includes(searchValue)
    );
    setVendors(filteredVendors);
  };

  return (
    <>
      <MDBCard narrow className="pb-3">
        <TopHeader
          title="Company Outsource"
          searchKey={didSearch}
          handleSearch={handleSearch}
          handleCreate={handleCreate}
        />

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
