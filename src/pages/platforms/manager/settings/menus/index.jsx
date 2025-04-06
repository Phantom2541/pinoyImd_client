import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import Generate from "./generate";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/commerce/catalog/menus";
import { globalSearch } from "../../../../../services/utilities";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBView } from "mdbreact";
import MenuCollapse from "./collapse";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import Swal from "sweetalert2";

export default function Menus() {
  const [menus, setMenus] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [searchKey, setSearchKey] = useState(""),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [willCreate, setWillCreate] = useState(true),
    [visible, setVisible] = useState(false),
    { token, activePlatform, maxPage } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ menus }) => menus
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (menus.length > 0) {
      let totalPages = Math.floor(menus.length / maxPage);
      if (menus.length % maxPage > 0) totalPages += 1;
      setTotalPages(totalPages);

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [menus, page, maxPage]);

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));
    }

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections && visible !== false) {
      Swal.fire({
        title: "Newly registered company",
        text: "It seems that your company is newly registered, you need to create menus",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Remind me later",
        confirmButtonText: "Yes, continue",
      }).then((result) => {
        if (result.isConfirmed) {
          setVisible(true);
        }
      });
    }

    return () => setMenus(collections);
  }, [collections, visible, isSuccess]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  const handleUpdate = (selected) => {
    setSelected(selected);
    if (willCreate) setWillCreate(false);
    setShowModal(true);
  };

  const handleCreate = () => {
    if (!willCreate) setWillCreate(true);
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

  const handleSearch = async () => {
    const { value: search, isConfirmed } = await Swal.fire({
      title: "What are you looking for?",
      text: "Provide a keyword and we will find it for you.",
      icon: "question",
      input: "text",
      inputValue: searchKey || "",
      confirmButtonText: "Search",
      showCancelButton: true,
      cancelButtonText: "Clear Search",
      inputValidator: (value) => {
        if (!value && !searchKey) return "You need to write something!";
      },
    });

    if (isConfirmed && search) {
      const value = search.toUpperCase();
      setSearchKey(value);
      setMenus(globalSearch(collections, value));
    } else if (!isConfirmed && searchKey) {
      // Clear the search
      setSearchKey("");
      setMenus(collections);
    }
  };

  const handleGenerate = () => {
    setVisible(!visible);
  };

  return (
    <>
      <MDBCard narrow>
        <MDBView
          cascade
          className="gradient-card-header blue-gradient narrower py-2 mx-4 mb-3 d-flex justify-content-between align-items-center"
        >
          <span className="white-text mx-3">
            {menus.length}&nbsp;
            {searchKey ? `Matches with ${searchKey}` : "Available Menus"}
          </span>
          <div className="text-right">
            <MDBBtn
              onClick={handleSearch}
              disabled={isLoading}
              outline
              color="white"
              rounded
              size="sm"
              className="px-2"
            >
              <MDBIcon icon="search" className="mt-0" />
            </MDBBtn>
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
            <MDBBtn
              onClick={handleGenerate}
              disabled={isLoading}
              outline
              title="Generate"
              color="white"
              rounded
              size="sm"
              className="px-2"
            >
              <MDBIcon icon="arrow-down" className="mt-0" />
            </MDBBtn>
          </div>
        </MDBView>
        <MDBCardBody className="pb-0">
          <MenuCollapse
            menus={menus}
            page={page}
            resetSearch={resetSearch}
            searchKey={searchKey}
            handleUpdate={handleUpdate}
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
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
      />
      <Generate visible={visible} setVisible={setVisible} />
    </>
  );
}
