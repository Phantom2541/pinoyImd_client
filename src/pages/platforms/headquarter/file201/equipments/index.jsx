import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
  DESTROY,
} from "../../../../../services/redux/slices/assets/procurements";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import { globalSearch } from "../../../../../services/utilities";
import Swal from "sweetalert2";

export default function Equipments() {
  const [equipments, setEquipments] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ procurements }) => procurements
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && activePlatform?._id)
      dispatch(BROWSE({ token, key: { branchId: activePlatform?.branchId } }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  //Set fetched data for mapping
  useEffect(() => {
    const newArray =
      collections?.length > 0 &&
      collections.map((collection) => {
        return {
          ...collection,
          machines: { brand: collection.brand, model: collection.model },
        };
      });

    setEquipments(newArray);
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
    if (willSearch) return setEquipments(globalSearch(collections, key));

    setEquipments(collections);
  };

  const handleDelete = (data) => {
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
        title="equipments"
        array={equipments}
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
            _function: handleDelete,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Category",
          },
          {
            _text: "Brand/Model",
          },
          {
            _text: "Serial #",
          },
          {
            _text: "Mortgage",
          },
          {
            _text: "Accuqired",
          },
          {
            _text: "Price",
          },
          {
            _text: "Status",
          },
        ]}
        tableBodies={[
          {
            _key: "category",
            _format: (data) => (
              <h6>
                <strong>{data}</strong>
              </h6>
            ),
          },
          {
            _style: { whiteSpace: "nowrap" },
            _key: "machines",
            _format: (data) => (
              <>
                <h6>
                  <strong>{data.brand}</strong>
                </h6>
                <strong>{data.model}</strong>
              </>
            ),
          },
          {
            _key: "serial",
            _format: (data) => <strong>{data}</strong>,
          },
          {
            _isEmpty: true,
            _key: "mortgage",
            _format: (data) => <h6>{data && `${data} years(s)`}</h6>,
          },
          {
            _key: "accuqired",
            _format: (data) => <strong>{data}</strong>,
          },
          {
            _key: "price",
            _format: (data) => <h6>₱ {data}</h6>,
          },
          {
            _key: "status",
            _format: (data) => (
              <h6>
                <strong>{data}</strong>
              </h6>
            ),
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
