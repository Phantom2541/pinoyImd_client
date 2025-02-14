import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { useToasts } from "react-toast-notifications";
import Modal from "./modal";
import DataTable from "../../../../../components/dataTable";
import {
  capitalize,
  fullName,
  globalSearch,
} from "../../../../../services/utilities";
import { MDBBadge, MDBIcon } from "mdbreact";
import { Roles } from "../../../../../services/fakeDb";

export default function Staff() {
  const [staffs, setStaffs] = useState([]),
    [selected, setSelected] = useState({}),
    [showModal, setShowModal] = useState(false),
    [willCreate, setWillCreate] = useState(true),
    { token, onDuty } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ personnels }) => personnels
    ),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Initial Browse
  useEffect(() => {
    if (token && onDuty._id) dispatch(BROWSE({ token, branchId: onDuty._id }));

    return () => dispatch(RESET());
  }, [token, dispatch, onDuty]);

  //Set fetched data for mapping
  useEffect(() => {
    setStaffs(collections);
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
  const handleRemoved = (selected) => {
    alert(selected);
    console.log(selected);
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
    if (willSearch) return setStaffs(globalSearch(collections, key));

    setStaffs(collections);
  };

  return (
    <>
      <DataTable
        isLoading={isLoading}
        title="staffs"
        array={staffs}
        actions={[
          {
            _icon: "plus",
            _function: handleCreate,
            _disabledOnSearch: true,
          },
          {
            _icon: "trash",
            _function: handleRemoved,
            _title: "removed",
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
          {
            _icon: "pencil-alt",
            _title: "Edit",
            _function: handleUpdate,
            _haveSelect: true,
            _allowMultiple: false,
            _shouldReset: true,
          },
        ]}
        tableHeads={[
          {
            _text: "Company ID",
          },
          {
            _text: "Name",
          },
          {
            _text: "Position",
          },
          {
            _text: "Access Platforms",
          },
          {
            _text: "Status of Employment",
          },
          {
            _text: "Has Schedule",
          },
          {
            _text: "Status",
          },
        ]}
        tableBodies={[
          {
            _key: "id",
            _format: (data) => <strong>{data}</strong>,
          },
          {
            _key: "user",
            _format: (data) => (
              <>
                <h6>
                  {
                    <MDBIcon
                      icon={data.isMale ? "male" : "female"}
                      style={{ color: data.isMale ? "blue" : "pink" }}
                    />
                  }
                  <strong className="ml-2">
                    {capitalize(fullName(data.fullName))}
                  </strong>
                </h6>
              </>
            ),
          },
          {
            _key: "employment",
            _format: (data) => {
              const designation = Roles.find(
                (role) => role.id === Number(data.designation)
              );

              return <strong>{designation?.display_name}</strong>;
            },
          },
          {
            _key: "access",
            _format: (data) =>
              data.map((access, index) => (
                <MDBBadge
                  key={`${index}-platform`}
                  className="mx-1 text-uppercase pt-1"
                  pill
                  color="primary"
                >
                  {access.platform}
                </MDBBadge>
              )),
          },
          {
            _key: "employment",
            _format: (data) => (
              <strong> {data?.soe?.toUpperCase() || ""}</strong>
            ),
          },
          {
            _key: "hasSchedule",
            _isEmpty: true,
            _format: (data) => <strong>{data}</strong>,
          },
          {
            _key: "status",
            _format: (data) => <strong>{data.toUpperCase()}</strong>,
          },
        ]}
        handleSearch={handleSearch}
      />
      <Modal
        selected={selected}
        willCreate={willCreate}
        show={showModal}
        toggle={toggleModal}
        users={staffs}
      />
    </>
  );
}
