import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
  DESTROY,
} from "../../../../services/redux/slices/assets/branches";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../components/dataTable";
import { globalSearch } from "../../../../services/utilities";
import Swal from "sweetalert2";

export default function SABranches() {
  const [branches, setBranches] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ branches }) => branches
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Initial Browse
  useEffect(() => {
    if (token && onDuty && onDuty._id) {
      dispatch(BROWSE({ token }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, onDuty]);

  //Set fetched data for mapping
  useEffect(() => {
    setBranches(collections);
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
    if (willSearch) return setBranches(globalSearch(collections, key));

    setBranches(collections);
  };

  const handleAddress = (address) => {
    if (typeof address === "object") {
      const { city, barangay, province } = address;
      return barangay + "," + city + "," + province;
    } else {
      return "-";
    }
  };

  const handleDestroy = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { id: data._id } }));
      }
    });
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Branches"
        array={branches}
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
            _icon: "trash",
            _function: handleDestroy,
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
            _text: "Email",
          },
          {
            _text: "Mobile",
          },
          {
            _text: "Address",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
            _format: (data) => data,
          },
          {
            _key: "contacts",
            _format: (data) => data.email,
          },
          {
            _key: "contacts",
            _format: (data) => data.mobile,
          },
          {
            _key: "address",
            _format: (data) => handleAddress(data),
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
