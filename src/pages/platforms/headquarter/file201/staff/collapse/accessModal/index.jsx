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
import { Roles } from "../../../../../../../services/fakeDb";
import { UPDATE_ACCESS } from "../../../../../../../services/redux/slices/assets/persons/personnels";
import Table from "./table";

export default function AccessModal({ show, toggle, selected }) {
  const { auth, onDuty, token } = useSelector(({ auth }) => auth),
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
    return Roles.collections.filter((c) =>
      _existingAccess?.every((existAcc) => existAcc.platform !== c.name)
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
        platform: role.name,
        approvedBy: auth._id,
        branchId: onDuty._id,
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
    const { name = "", platform = "" } = item;
    const deletedRoleName = name || platform;
    return collections.findIndex(({ platform = "", name = "" }) => {
      const _name = platform || name;
      return _name === deletedRoleName;
    });
  };

  const handleDelete = (item) => {
    const nameOfDeletedRole = item?.name || item?.platform;
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
            />
          </MDBCol>
          <MDBCol md="6">
            <Table
              collections={existingAccess}
              isTag={true}
              handleAction={handleDelete}
            />
          </MDBCol>
        </MDBRow>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn
          onClick={handleSubmit}
          color="info"
          disabled={existingAccess.length === 0}
        >
          Save Changes
        </MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  );
}
