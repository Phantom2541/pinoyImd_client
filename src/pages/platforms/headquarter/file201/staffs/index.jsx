import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Access from "./acess";
import DataTable from "../../../../../components/dataTable";
import {
  capitalize,
  fullName,
  globalSearch,
  mobile,
} from "../../../../../services/utilities";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { RESET as ACCESS_RESET } from "../../../../../services/redux/slices/responsibilities/access";
import Modal from "./modal";

export default function Staff() {
  const [personnels, setPersonnels] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [showAccess, setShowAccess] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(({ personnels }) => personnels),
    { message, isSuccess } = useSelector(({ access }) => access),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && onDuty._id) {
      dispatch(BROWSE({ token, branchId: onDuty._id }));
    }

    return () => dispatch(RESET());
  }, [token, onDuty, dispatch]);

  //Set fetched data for mapping
  useEffect(() => {
    setPersonnels(collections);
  }, [collections]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);
  const toggleAccess = () => setShowAccess(!showAccess);

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

    return () => dispatch(ACCESS_RESET());
  }, [isSuccess, message, addToast, dispatch]);

  //Search function
  const handleSearch = async (willSearch, key) => {
    if (willSearch) {
      setPersonnels(globalSearch(collections, key));
    } else {
      setPersonnels(collections);
    }
  };

  const handleAccess = (selected) => {
    setSelected(selected);
    setShowAccess(true);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Personnels"
        array={personnels}
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
          {
            _icon: "user-shield",
            _function: handleAccess,
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
            _text: "Contract",
          },
          {
            _text: "Informations",
          },
          {
            _text: "Joined At",
          },
        ]}
        tableBodies={[
          {
            _key: "user",
            _format: (data) => (
              <strong>{capitalize(fullName(data.fullName))}</strong>
            ),
          },
          {
            _key: "employment",
            _format: (data) => (
              <>
                <p className="fw-bold mb-1">{data.designation}</p>
                <p className="mb-0">{data.soe.toUpperCase()}</p>
              </>
            ),
          },
          {
            _key: "user",
            _format: (data) => (
              <>
                <p className="fw-bold mb-1">{mobile(data.mobile)}</p>
                <p className="mb-0">{new Date(data.dob).toDateString()}</p>
              </>
            ),
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
      <Access selected={selected} show={showAccess} toggle={toggleAccess} />
    </>
  );
}
