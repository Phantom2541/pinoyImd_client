import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MACHINES,
  RESET,
} from "../../../../../services/redux/slices/assets/procurements";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import { globalSearch } from "../../../../../services/utilities";

export default function Procurments() {
  const [machines, setMachines] = useState([]),
    [showModal, setShowModal] = useState(false),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ procurements }) => procurements
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?.branchId)
      dispatch(
        MACHINES({
          token,
          key: {
            branch: activePlatform?.branchId,
          },
        })
      );

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);
  //Set fetched data for mapping
  useEffect(() => {
    setMachines(collections);
  }, [collections]);
  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Trigger for update
  // const handleUpdate = (selected) => {
  //   setSelected(selected);
  //   if (willCreate) {
  //     setWillCreate(false);
  //   }
  //   setShowModal(true);
  // };

  //Trigger for create
  // const handleCreate = () => {
  //   if (!willCreate) {
  //     setWillCreate(true);
  //   }
  //   setShowModal(true);
  // };

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
    if (willSearch) return setMachines(globalSearch(collections, key));

    setMachines(collections);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="machines"
        array={machines}
        actions={
          [
            // {
            //   _icon: "plus",
            //   _function: handleCreate,
            //   _disabledOnSearch: true,
            // },
            // {
            //   _icon: "pencil-alt",
            //   _function: handleUpdate,
            //   _haveSelect: true,
            //   _allowMultiple: false,
            //   _shouldReset: true,
            // },
          ]
        }
        tableHeads={[
          {
            _text: "Brand",
          },
          {
            _text: "Model",
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
            _key: "brand",
            _format: (data) => <strong>{data}</strong>,
          },
          {
            _key: "model",
            _format: (data) => <strong>{data}</strong>,
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
      <Modal show={showModal} toggle={toggleModal} />
    </>
  );
}
