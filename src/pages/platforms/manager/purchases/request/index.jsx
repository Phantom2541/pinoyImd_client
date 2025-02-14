import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/companies";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import { globalSearch } from "../../../../../services/utilities";

export default function Users() {
  const [companies, setCompanies] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ companies }) => companies
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  console.log(collections);

  //Initial Browse
  useEffect(() => {
    if (token) dispatch(BROWSE(token));

    return () => dispatch(RESET());
  }, [token, dispatch]);

  //Set fetched data for mapping
  useEffect(() => {
    setCompanies(collections);
  }, [collections]);
  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Trigger for update
  //Trigger for create
  const handleCreate = () => {
    setWillCreate(true);
    setSelected();
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
    if (willSearch) return setCompanies(globalSearch(collections, key));

    setCompanies(collections);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Companies"
        array={companies}
        actions={[
          {
            _icon: "plus",
            _function: handleCreate,
            _disabledOnSearch: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Name",
          },
          {
            _text: "Category",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
          },
          {
            _key: "category",
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
