import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import Generate from "./generate";
import {
  BROWSE,
  RESET,
  SetFILTERED,
} from "../../../../../services/redux/slices/commerce/catalog/menus";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon, MDBView } from "mdbreact";
import MenuCollapse from "./collapse";
import TableRowCount from "../../../../../components/pagination/rows";
import Pagination from "../../../../../components/pagination";
import Swal from "sweetalert2";
import Search from "../../../../../components/searchables/search";
import TableLoading from "../../../../../components/tableLoading";
import { fullName, MenusToExcel } from "../../../../../services/utilities";

const Menus = () => {
  const [menus, setMenus] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [searchKey, setSearchKey] = useState(""),
    [page, setPage] = useState(1),
    [totalPages, setTotalPages] = useState(1),
    [willCreate, setWillCreate] = useState(true),
    [visible, setVisible] = useState(false),
    { token, activePlatform, maxPage, auth } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading, filtered } = useSelector(
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

  // const handleGenerate = () => {
  //   setVisible(!visible);
  // };
  const handleExport = () => {
    MenusToExcel({
      array: collections,
      createdBy: fullName(auth.fullName),
    });
  };
  const handleChangePage = (isAdd) => {
    setPage((prev) => (isAdd ? prev + 1 : prev - 1));
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
          <div className="d-flex align-items-center justify-content-between">
            <Search
              collections={collections}
              setFiltered={(results) =>
                dispatch(
                  SetFILTERED(results.length > 0 ? results : collections)
                )
              }
              reset={() => dispatch(SetFILTERED(collections))}
              haveAction={false}
            />

            <MDBBtn
              onClick={handleCreate}
              disabled={isLoading}
              outline
              color="white"
              rounded
              size="sm"
              className="px-2 ml-3"
            >
              <MDBIcon icon="plus" className="mt-0" />
            </MDBBtn>
            <MDBBtn
              onClick={handleExport}
              disabled={isLoading}
              outline
              color="white"
              rounded
              size="sm"
              className="px-2"
              title="Export Menus"
            >
              <MDBIcon icon="file-export" />
            </MDBBtn>
          </div>
        </MDBView>
        <MDBCardBody className="pb-0">
          {!isLoading ? (
            <>
              <MenuCollapse
                menus={filtered}
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
                  setPage={handleChangePage}
                />
              </div>
            </>
          ) : (
            <TableLoading />
          )}
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
};

export default Menus;
