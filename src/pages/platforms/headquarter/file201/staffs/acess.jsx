import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBadge,
} from "mdbreact";
import DataTable from "../../../../../components/dataTable";
import { capitalize } from "../../../../../services/utilities";
import { Sidebars } from "../../../../../services/fakeDb";
import {
  UPDATE,
  SAVE,
  CUSTOMRESET,
} from "../../../../../services/redux/slices/responsibilities/access";
import { UPDATEACCESS } from "../../../../../services/redux/slices/assets/persons/personnels";
import Swal from "sweetalert2";
import { useToasts } from "react-toast-notifications";

export default function Access({ show, toggle, selected }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, onDuty, auth } = useSelector(({ auth }) => auth),
    { collections, isSuccess, message } = useSelector(({ access }) => access),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // used to update access once its success
  useEffect(() => {
    if (isSuccess && collections.length > 0 && selected._id) {
      const isNew = message === "Access Added Successfully.";
      dispatch(UPDATEACCESS({ _id: selected._id, access: collections, isNew }));
      setTimeout(() => dispatch(CUSTOMRESET()), 1000);
      toggle();
    }
  }, [dispatch, collections, isSuccess, selected, toggle, message]);

  const handleAddAccess = async () => {
    const inputOptions = {};

    Object.keys(Sidebars).map(key => (inputOptions[key] = key));

    const { value: platform } = await Swal.fire({
      title: "Select a Platform",
      input: "select",
      inputOptions,
      inputPlaceholder: "Select a platform",
    });

    if (platform) {
      const isExisting = selected?.access?.find(
        _access => _access.platform === platform
      );

      if (isExisting) {
        return addToast("Platform already accessible.", {
          appearance: "info",
        });
      }

      dispatch(
        SAVE({
          token,
          data: {
            platform,
            branchId: onDuty?._id,
            userId: selected?.user?._id,
            approvedBy: auth._id,
          },
        })
      );
    }
  };

  const handleAccessToggle = selected => {
    const payload = selected.map(item => ({
      _id: item._id,
      status: !item.status,
    }));

    dispatch(UPDATE({ token, data: payload }));
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop={true} size="xl">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-shield" className="mr-2" />
        Configure Access
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <DataTable
          isLoading={isLoading}
          title="Access"
          array={selected.access || []}
          actions={[
            {
              _icon: "plus",
              _function: handleAddAccess,
              _disabledOnSearch: true,
              _shouldReset: true,
            },
            {
              _icon: "sync-alt",
              _function: handleAccessToggle,
              _haveSelect: true,
              _allowMultiple: true,
              _shouldReset: true,
            },
          ]}
          tableHeads={[
            {
              _text: "Platform",
            },
            {
              _text: "Status",
            },
          ]}
          tableBodies={[
            {
              _key: "platform",
              _format: data => <strong>{capitalize(data)}</strong>,
            },
            {
              _key: "status",
              _format: (_, item) => {
                const { status } = item;

                return (
                  <MDBBadge color={status ? "success" : "danger"}>
                    {status ? "Active" : "Inactive"}
                  </MDBBadge>
                );
              },
            },
          ]}
          disableSearch={true}
        />
      </MDBModalBody>
    </MDBModal>
  );
}
