import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import DataTable from "../../../../../components/dataTable";
import {
  capitalize,
  fullName,
  globalSearch,
} from "../../../../../services/utilities";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import Modal from "./modal";
import { Roles } from "../../../../../services/fakeDb";

export default function Vouchers() {
  const [employees, setEmployees] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    [selected, setSelected] = useState({}),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ personnels }) => personnels
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if ((token, activePlatform?.branchId))
      dispatch(BROWSE({ token, branchId: activePlatform?.branchId }));

    return () => dispatch(RESET());
  }, [token, dispatch, activePlatform]);

  //Set fetched data for mapping
  useEffect(() => {
    setEmployees(collections);
  }, [collections]);

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
    if (willSearch) return setEmployees(globalSearch(collections, key));
    setEmployees(collections);
  };
  const toggleModal = () => setShowModal(!showModal);
  const handleUpdate = (selected) => {
    setSelected(selected);
    if (willCreate) {
      setWillCreate(false);
    }
    setShowModal(true);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="Employees"
        array={employees}
        actions={[
          {
            _icon: "plus",
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
            _text: "Designation",
          },
          {
            _text: "Company ID",
          },
          {
            _text: "Status",
          },
        ]}
        tableBodies={[
          {
            _key: "user",
            _format: (data) => (
              <h6>
                <strong>{capitalize(fullName(data.fullName))}</strong>
              </h6>
            ),
          },
          {
            _key: "employment",
            _format: (data) => {
              const designation = Roles.findById(
                (role) => role.id === Number(data.designation)
              );

              return <strong> {designation?.display_name}</strong>;
            },
          },
          {
            _key: "id",
            _format: (data) => <strong>{data}</strong>,
          },

          {
            _key: "status",
            _format: (data) => <strong>{data}</strong>,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
        users={employees}
      />
    </>
  );
}
