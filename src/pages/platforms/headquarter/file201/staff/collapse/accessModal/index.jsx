import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBModalFooter,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import { fullName } from "../../../../../../../services/utilities";
import { Access } from "../../../../../../../services/fakeDb";
import { UPDATE_ACCESS } from "../../../../../../../services/redux/slices/assets/persons/personnels";
import Table from "./table";

/**
 * AccessModal component manages user access roles through a modal interface.
 * It displays available roles and existing access, allowing users to add or
 * remove roles for a selected user. The changes can be saved and sent to the
 * backend for processing. The component supports searching for roles,
 * drag-and-drop functionality for managing roles, and visual feedback for
 * the current state of access changes.
 *
 * @param {boolean} show - Controls the visibility of the modal.
 * @param {function} toggle - Function to toggle the modal's visibility.
 * @param {object} selected - Contains user and their current access data.
 */

export default function AccessModal({ show, toggle, selected }) {
  const { auth, activePlatform, token } = useSelector(({ auth }) => auth),
    [existingAccess, setExistingAccess] = useState([]),
    [roles, setRoles] = useState([]),
    [search, setSearch] = useState([]),
    [accessChanges, setAccessChanges] = useState({
      deleted: [],
      added: [],
    }), // para malaman kung ano yung bagong inadd or dinelete na access para yun yung isesend sa back end
    [duplicateRoles, setDuplicateRoles] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const { access = [], user = {} } = selected || {};

  const handleSetRoles = useCallback((_roles) => {
    setRoles(_roles);
    setDuplicateRoles(_roles);
  }, []);

  const removeDuplicate = useCallback((_existingAccess) => {
    return Access.collections.filter((c) =>
      _existingAccess?.every(
        (existAcc) =>
          existAcc.platform.toUpperCase() !== c.platform.toUpperCase()
      )
    );
  }, []);

  useEffect(() => {
    // remove existing access in collections of roles
    if (show) {
      const _roles = removeDuplicate(selected.access);
      setExistingAccess(selected.access);
      handleSetRoles(_roles);
    }
    setAccessChanges({ deleted: [], added: [] });
  }, [show, selected, handleSetRoles, removeDuplicate]);

  const handleSubmit = () => {
    const { added, deleted } = accessChanges;
    if (added.length === 0 && deleted.length === 0) {
      toggle();
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE_ACCESS({ data: { accessChanges, staffID: selected._id }, token })
    );
    toggle();
  };

  const handleAccessChanges = (role, isDelete = false) => {
    const isExist = access.some(({ _id }) => _id === role?._id);
    const { deleted, added } = accessChanges;
    const _addedRoles = [...added];
    const _deletedRoles = [...deleted];
    const roleID = role?._id || role?.id;

    const getIndex = (array) =>
      array.findIndex(
        ({ _id = "", id = "" }) => String(_id || id) === String(roleID)
      );
    const index = getIndex(isDelete ? _addedRoles : _deletedRoles);

    if (index > -1) {
      isDelete ? _addedRoles.splice(index, 1) : _deletedRoles.splice(index, 1);
    }

    if (isDelete && isExist) _deletedRoles.push(role);
    if (!isDelete && !isExist)
      _addedRoles.push({
        platform: role.platform,
        approvedBy: auth._id,
        branchId: activePlatform.branchId,
        userId: user._id,
        id: roleID,
        status: true,
      });

    setAccessChanges({
      ...accessChanges,
      added: _addedRoles,
      deleted: _deletedRoles,
    });
  };

  const RESET_ROLES = (_existingAccess = existingAccess) => {
    const _roles = removeDuplicate(_existingAccess);
    setRoles(_roles);
    setSearch("");
  };

  const handleADD = (role = {}) => {
    const _roles = [...roles];
    const _existingAccess = [...existingAccess];
    const index = _roles.findIndex(({ id }) => id === role.id);
    _roles.splice(index, 1);
    _existingAccess.unshift({ ...role, platform: role.name, new: true });

    setExistingAccess(_existingAccess);
    handleAccessChanges(role, false);

    if (_roles.length === 0) {
      RESET_ROLES(_existingAccess);
    } else {
      setRoles(_roles);
    }
  };

  const getIndexOfRoleDeleted = (collections = [], item = {}) => {
    const { platform = "" } = item;
    const deletedRoleName = platform;
    return collections.findIndex(({ platform = "" }) => {
      return platform === deletedRoleName;
    });
  };

  const handleDelete = (item) => {
    const nameOfDeletedRole = item?.platform;
    const _roles = [...roles];
    const _existingAccess = [...existingAccess];
    const indexOfAccess = getIndexOfRoleDeleted(_existingAccess, item);
    _roles.unshift({
      ...item,
      platForm: nameOfDeletedRole,
      name: nameOfDeletedRole,
    });
    _existingAccess.splice(indexOfAccess, 1);
    handleSetRoles(_roles);
    setExistingAccess(_existingAccess);
    handleAccessChanges(item, true);
  };

  const handleSearch = (searchValue) => {
    if (!searchValue) return RESET_ROLES();

    const _roles = [...duplicateRoles];
    const searchResults = _roles.filter(({ name = "", platform = "" }) => {
      const roleName = name || platform;
      return roleName.toLowerCase().includes(searchValue.toLowerCase());
    });
    setRoles(searchResults);
    setSearch(searchValue);
  };

  const [hasDrag, setHasDrag] = useState(false);

  const handleDragStart = (e, role, isAdd = true, dragTo = "Access") => {
    setHasDrag(true);
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ role, isAdd, dragTo })
    );

    const dragPreview = document.createElement("div");
    dragPreview.textContent = role.platform;
    Object.assign(dragPreview.style, {
      position: "absolute",
      top: "0",
      left: "0",
      padding: "8px 12px",
      background: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "6px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      fontSize: "1rem",
      fontWeight: "500",
      color: "#333",
      whiteSpace: "nowrap", // Prevents text from breaking
      pointerEvents: "none", // Prevents accidental interaction
      transform: "translate(-50%, -50%)", // Centers on cursor
    });

    document.body.appendChild(dragPreview);

    // Set as drag image
    e.dataTransfer.setDragImage(dragPreview, 10, 10);

    setTimeout(() => {
      if (dragPreview.parentNode) {
        dragPreview.parentNode.removeChild(dragPreview);
      }
    }, 0);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, dropTo = "Tag Access") => {
    event.preventDefault();
    const data = event.dataTransfer.getData("application/json");
    if (!data) return "unknown role";
    const { role, isAdd, dragTo } = JSON.parse(data);
    if (dragTo === dropTo) return "No changes";
    if (isAdd) {
      handleADD(role);
    } else {
      handleDelete(role);
    }
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      size="xl"
      style={{ overFlow: "auto" }}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="universal-access" className="mr-2" />
        <small> {`${fullName(user.fullName) || ""} `}</small>
      </MDBModalHeader>
      <MDBModalBody>
        <MDBRow>
          <MDBCol md="6">
            <Table
              search={search}
              collections={roles}
              handleAction={handleADD}
              handleSearch={handleSearch}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              tableName="Access"
              handleDrop={handleDrop}
              hasDrag={hasDrag}
            />
          </MDBCol>
          <MDBCol md="6">
            <Table
              collections={existingAccess}
              tableName="Tag Access"
              isTag={true}
              handleAction={handleDelete}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              hasDrag={hasDrag}
            />
          </MDBCol>
        </MDBRow>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn
          onClick={handleSubmit}
          color="info"
          // disabled={existingAccess.length === 0}
        >
          Save Changes
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
}
