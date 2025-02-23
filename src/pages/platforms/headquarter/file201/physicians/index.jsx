import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TIEUPS,
  RESET,
  DESTROY,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import {
  globalSearch,
  properFullname,
  getGenderIcon,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
// mobile;
export default function Physicians() {
  const { activePlatform, token } = useSelector(({ auth }) => auth),
    [tieups, setTieups] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [name, setName] = useState(""),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ physicians }) => physicians
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    //console.log(activePlatform);

    if (token && activePlatform?.branchId)
      dispatch(TIEUPS({ key: { branch: activePlatform?.branchId }, token }));

    return () => dispatch(RESET());
  }, [token, activePlatform, dispatch]);

  //Set fetched data for mapping
  useEffect(() => {
    setTieups(collections);
  }, [collections]);

  //Modal toggle
  const toggleModal = () => setShowModal(!showModal);

  //Trigger for update
  const handleDelete = (selected) => {
    setSelected(selected);
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
        dispatch(DESTROY({ token, data: { id: selected._id } }));
      }
    });
  };

  //Trigger for create
  const handleCreate = async () => {
    const { value: fullname } = await Swal.fire({
      title: "Input Physician Fullname",
      input: "text",
      inputLabel: "Physician Fullname",
      inputPlaceholder: "Lastname, Firstname y Middlename",
    });
    if (fullname) {
      setName(fullname);
      setShowModal(true);
    }
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
    if (willSearch) return setTieups(globalSearch(collections.tieups, key));

    setTieups(collections);
  };
  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Affiliated Physsician"
        array={tieups}
        actions={[
          {
            _icon: "tag",
            _function: handleCreate,
            _disabledOnSearch: true,
          },
          {
            _icon: "times",
            _title: "Untag",
            _function: handleDelete,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Physicians",
          },
          {
            _text: "Specialization",
          },
        ]}
        tableBodies={[
          {
            _key: "user",
            _format: (data) => (
              <strong>
                {getGenderIcon(data?.isMale)}
                {String(properFullname(data?.fullName, true)).toUpperCase()}
              </strong>
            ),
          },
          {
            _key: "specialization",
            _isEmpty: true,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal
        selected={selected}
        name={name}
        show={showModal}
        toggle={toggleModal}
      />
    </>
  );
}
