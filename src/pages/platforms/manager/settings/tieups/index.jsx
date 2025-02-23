import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TIEUPS,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import { globalSearch } from "../../../../../services/utilities";
// mobile;
export default function Index() {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    [tieups, setTieups] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ providers }) => providers
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(TIEUPS({ data: { branch: activePlatform?.branchId }, token }));

    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  //Set fetched data for mapping
  useEffect(() => {
    setTieups(collections);
  }, [activePlatform, collections]);

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

  //Search function
  const handleSearch = async (willSearch, key) => {
    if (willSearch) return setTieups(globalSearch(collections, key));

    setTieups(collections);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Company Tieups"
        array={tieups}
        actions={[
          {
            _icon: "plus",
            _function: handleCreate,
            _disabledOnSearch: true,
          },
          {
            _icon: "pencil-alt",
            _function: handleUpdate,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Company Name",
          },
          {
            _text: "Branch",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
          },
          {
            _key: "subName",
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
      />
    </>
  );
}
