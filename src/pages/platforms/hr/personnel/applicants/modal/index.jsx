import { useCallback, useEffect, useState } from "react";
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
  MDBTypography,
} from "mdbreact";

import { Access, Policy } from "../../../../../../services/fakeDb";
import { UPDATE_ACCESS } from "../../../../../../services/redux/slices/assets/persons/personnels";
import {
  ToggleAccessModal,
  UPDATE,
  RESET,
} from "../../../../../../services/redux/slices/assets/persons/applicants";
import Bucket from "./bucket";
import Swal from "sweetalert2";
import { fullName } from "../../../../../../services/utilities";

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

export default function AccessModal() {
  const { auth, activePlatform, token } = useSelector(({ auth }) => auth),
    {
      showAccessModal: show,
      selected,
      formSubmitted,
      isSuccess,
    } = useSelector(({ applicants }) => applicants),
    [clusters, setClusters] = useState([]),
    [roles, setRoles] = useState([]),
    [search, setSearch] = useState([]),
    [soe, setSoe] = useState(""),
    [duplicateRoles, setDuplicateRoles] = useState([]), //the purpose of this is for searching....
    dispatch = useDispatch();

  const { user = {}, contract } = selected || {};

  const toggle = useCallback(() => {
    dispatch(ToggleAccessModal());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && !formSubmitted && show) {
      toggle();
      dispatch(RESET());
      Swal.fire({
        title: "Success!",
        text: "Successfully approved applicant.",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  }, [isSuccess, formSubmitted, show, toggle, dispatch]);

  const handleSetRoles = useCallback((_roles) => {
    setRoles(_roles);
    setDuplicateRoles(_roles);
  }, []);

  const removeDuplicate = useCallback((_existingAccess) => {
    return Access.getByCategory(activePlatform?.branch?.category).filter((c) =>
      _existingAccess?.every(
        (existAcc) =>
          existAcc.platform.toUpperCase() !== c.platform.toUpperCase()
      )
    );
  }, []);

  useEffect(() => {
    if (show) {
      setClusters([]);
      handleSetRoles(Access.collections);
    }
  }, [handleSetRoles, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { branch } = selected;
    dispatch(
      UPDATE_ACCESS({
        data: { accessChanges: { added: clusters }, staffID: selected._id },
        token,
      })
    );
    dispatch(
      UPDATE({
        token,
        data: {
          _id: selected._id,
          branch,
          status: "active",
          contract: { ...contract, soe },
        },
      })
    );
  };

  const RESET_ROLES = (_existingAccess = clusters) => {
    const _roles = removeDuplicate(_existingAccess);
    setRoles(_roles);
    setSearch("");
  };
  const handleADD = (role = {}) => {
    const _roles = [...roles];
    const _existingAccess = [...clusters];
    const index = _roles.findIndex(({ id }) => id === role.id);
    _roles.splice(index, 1);
    _existingAccess.unshift({
      ...role,
      status: true,
      platform: role.platform,
      approvedBy: auth._id,
      branchId: activePlatform.branchId,
      userId: user._id,
    });

    setClusters(_existingAccess);

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
    const _existingAccess = [...clusters];
    const indexOfAccess = getIndexOfRoleDeleted(_existingAccess, item);
    _roles.unshift({
      ...item,
      platForm: nameOfDeletedRole,
      name: nameOfDeletedRole,
    });
    _existingAccess.splice(indexOfAccess, 1);
    handleSetRoles(_roles);
    setClusters(_existingAccess);
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
      size="lg"
      style={{ overFlow: "auto" }}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <h6>
          <MDBIcon icon="universal-access" className="mr-2" />
          {`${fullName(user.fullName) || ""} `}
        </h6>
        <h5
          style={{
            marginTop: "-0.5rem",
            marginLeft: "1.5rem",
            marginBottom: "-0.7rem",
          }}
        >
          {Policy.getPositions(contract?.designation)}
        </h5>
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <select
            className="form-control mb-3"
            label="Status of employment"
            required
            value={soe}
            onChange={({ target }) => setSoe(target.value)}
          >
            <option value="" disabled>
              Select status of employment
            </option>
            <option value="Contractual">Contractual</option>
            <option value="Reliever">Reliever</option>
            <option value="Permanent">Permanent</option>
            <option value="Honorarium">Honorarium</option>
          </select>
          <MDBTypography noteTitle="Description: " note noteColor="warning">
            Drag and drop roles between 'Access' and 'Tag Access' for easy
            management.
          </MDBTypography>

          <MDBRow>
            <MDBCol md="6">
              <Bucket
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
              <Bucket
                collections={clusters}
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
            type="submit"
            color="info"
            disabled={formSubmitted || clusters.length === 0}
          >
            Approve {formSubmitted && <MDBIcon icon="spinner" pulse />}
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
}
