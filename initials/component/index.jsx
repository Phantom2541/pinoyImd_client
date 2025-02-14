import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE, RESET } from "../../../../../services/redux/slices/roles";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import { globalSearch } from "../../../../../services/utilities";

export default function Users() {
  const [roles, setRoles] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ roles }) => roles
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token) dispatch(BROWSE(token));

    return () => dispatch(RESET());
  }, [token, dispatch]);

  //Set fetched data for mapping
  useEffect(() => {
    setRoles(collections);
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

  //Search function
  const handleSearch = async (willSearch, key) => {
    if (willSearch) return setRoles(globalSearch(collections, key));

    setRoles(collections);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Roles"
        array={roles}
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
            _text: "Name",
          },
          {
            _text: "Updated At",
          },
          {
            _text: "Created At",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
          },
          {
            _key: "updatedAt",
            _format: (data) => new Date(data).toLocaleString(),
          },
          {
            _key: "createdAt",
            _format: (data) => new Date(data).toLocaleString(),
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
