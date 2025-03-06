import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  DESTROY,
  RESET,
} from "../../../../services/redux/slices/assets/companies";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../components/dataTable";
import {
  capitalize,
  fullName,
  globalSearch,
} from "../../../../services/utilities";
import Swal from "sweetalert2";

export default function SACompany() {
  //Super Admin Company
  const [companies, setCompanies] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ companies }) => companies
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Initial Browse
  useEffect(() => {
    if (token && activePlatform && activePlatform?.branchId) {
      dispatch(BROWSE({ token }));
    }
    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  //Set fetched data for mapping
  useEffect(() => {
    setCompanies(collections);
  }, [collections]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Trigger for update
  const handleUpdate = (selected) => {
    const currentDate = new Date();
    const pastDate = new Date(selected.createdAt);
    const timeDifference = currentDate - pastDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference > 60) {
      addToast(
        "It has been completed for 60 days, thus it can no longer be updated.d!",
        {
          appearance: "warning",
          autoDismiss: true, // Set to true if you want the toast to automatically dismiss
        }
      );
    } else {
      setSelected(selected);
      if (willCreate) {
        setWillCreate(false);
      }
      setShowModal(true);
    }
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
    if (willSearch) return setCompanies(globalSearch(collections, key));

    setCompanies(collections);
  };

  const handleDestroy = (data) => {
    const currentDate = new Date();
    const pastDate = new Date(data.createdAt);
    const timeDifference = currentDate - pastDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference > 60) {
      addToast(
        "It has been completed for 60 days, thus it can no longer be deleted!",
        {
          appearance: "warning",
          autoDismiss: true, // Set to true if you want the toast to automatically dismiss
        }
      );
    }
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
        title="companies"
        array={companies}
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
            _text: "Sub Name",
          },
          {
            _text: "Category",
          },
          {
            _text: "Chief Executive Officer",
          },
        ]}
        tableBodies={[
          {
            _key: "name",
            _format: (data) => data,
          },
          {
            _key: "subName",
            _format: (data) => data,
          },
          {
            _key: "category",
            _format: (data) => data,
          },
          {
            _key: "ceo",
            _format: (data) => capitalize(fullName(data?.fullName)),
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
