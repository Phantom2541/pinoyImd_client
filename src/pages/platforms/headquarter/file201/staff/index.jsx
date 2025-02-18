import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
// import Modal from "./modal";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
// import { globalSearch } from "../../../../../services/utilities";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBView } from "mdbreact";
import MenuCollapse from "./collapse";
import TableLoading from "../../../../../components/tableLoading";
// import TableRowCount from "../../../../../components/pagination/rows";
// import Pagination from "../../../../../components/pagination";

export default function Staffs() {
  const [staffs, setStaffs] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [searchKey, setSearchKey] = useState(""),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [willCreate, setWillCreate] = useState(true),
    [visible, setVisible] = useState(false),
    { token, onDuty, maxPage } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ personnels }) => personnels
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (staffs.length > 0) {
      let totalPages = Math.floor(staffs.length / maxPage);
      if (staffs.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [staffs, page, maxPage]);

  //Initial Browse
  useEffect(() => {
    if (token && onDuty._id) dispatch(BROWSE({ token, branchId: onDuty._id }));
    return () => dispatch(RESET());
  }, [token, dispatch, onDuty]);

  console.log(onDuty.id);

  //Set fetched data for mapping
  useEffect(() => {
    setStaffs(collections);
  }, [collections]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Trigger for update
  const handleUpdate = (selected) => {
    setSelected(selected);
    if (willCreate) {
      setWillCreate(false);
    }
    setShowModal(true);
  };

  //Trigger for create
  const handleCreate = () => {
    if (!willCreate) {
      setWillCreate(true);
    }
    setShowModal(true);
  };

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const resetSearch = () => setSearchKey("");

  //Search function
  // const handleSearch = async () => {
  //   if (searchKey) {
  //     setSearchKey("");
  //     setStaffs(collections);
  //   } else {
  //     const { value: search } = await Swal.fire({
  //       title: "What are you looking for?",
  //       text: "Provide a keyword and we will find it for you.",
  //       icon: "question",
  //       input: "text",
  //       confirmButtonText: "Search",
  //       inputValidator: (value) => {
  //         if (!value) {
  //           return "You need to write something!";
  //         }
  //       },
  //     });

  //     if (search) {
  //       const value = search.toUpperCase();

  //       setSearchKey(value);
  //       setStaffs(globalSearch(collections, value));
  //     }
  //   }
  // };

  return (
    <>
      <MDBCard narrow>
        <MDBView
          cascade
          className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
        >
          <span className="white-text mx-3">{staffs.length} Staffs</span>
          <div className="text-right">
            {/* <MDBBtn
              onClick={handleSearch}
              disabled={isLoading}
              outline
              color="white"
              rounded
              size="sm"
              className="px-2"
            >
              <MDBIcon icon={searchKey ? "times" : "search"} className="mt-0" />
            </MDBBtn> */}
            <MDBBtn
              onClick={handleCreate}
              disabled={isLoading}
              outline
              color="white"
              rounded
              size="sm"
              className="px-2"
            >
              <MDBIcon icon="plus" className="mt-0" />
            </MDBBtn>
          </div>
        </MDBView>
        <MDBCardBody className="pb-0">
          {isLoading ? (
            <TableLoading />
          ) : (
            <>
              <MenuCollapse
                staffs={staffs}
                page={page}
                resetSearch={resetSearch}
                searchKey={searchKey}
                handleUpdate={handleUpdate}
              />
              <div className="d-flex justify-content-between align-items-center px-4">
                {/* <TableRowCount /> */}

                {/* <Pagination
              isLoading={isLoading}
              total={totalPages}
              page={page}
              setPage={setPage}
            /> */}
              </div>
            </>
          )}
        </MDBCardBody>
      </MDBCard>
      {/* <Modal
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
      /> */}
    </>
  );
}
