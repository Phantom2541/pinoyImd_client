import React, { useEffect, useState } from "react";
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
import TableLoading from "../../../../../components/tableLoading";

export default function Sources() {
  const [vendors, setVendors] = useState([]),
    { token, onDuty, maxPage } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ providers }) => providers),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [showModal, setShowModal] = useState(false),
    [selected, setSelected] = useState({}),
    [willCreate, setWillCreate] = useState(true),
    [searchQuery, setSearchQuery] = useState(""),
    dispatch = useDispatch();

  // Initial Browse
  useEffect(() => {
    if ((token, activePlatform.branchId))
      -dispatch(BROWSE({ token, vendors: activePlatform.branchId }));
    console.log(activePlatform.branchId);
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

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

  // Toggle Modal
  const toggleModal = () => setShowModal(!showModal);

  // Handle Update
  const handleUpdate = (selected) => {
    setSelected(selected);
    setWillCreate(false);
    setShowModal(true);
  };

  // Handle Create
  const handleCreate = () => {
    setWillCreate(true);
    setSelected({});
    setShowModal(true);
  };

  // Handle Search
  const handleSearch = () => {
    const searchValue = document.getElementById("search")?.value.toLowerCase();
    setSearchQuery(searchValue);

    if (searchValue) {
      const filteredVendors = collections.filter((vendor) =>
        vendor.name.toLowerCase().includes(searchValue)
      );
      setVendors(filteredVendors);
    } else {
      setVendors(collections); // Reset vendors when search input is empty
    }
  };

  return (
    <>
      <MDBCard narrow className="pb-3">
        <TopHeader
          title="Company Source"
          handleCreate={handleCreate}
          handleSearch={handleSearch}
          didSearch={searchQuery !== ""}
        />
        <MDBCardBody>
          {isLoading ? (
            <TableLoading />
          ) : (
            <>
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
            </>
          )}
        </MDBCardBody>
      </MDBCard>

      {/* Modal Component */}
      <Modal
        selected={selected}
        show={showModal}
        toggle={toggleModal}
        willCreate={willCreate}
      />
    </>
  );
}
