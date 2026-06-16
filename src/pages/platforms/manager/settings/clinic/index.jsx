import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBContainer,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import {
  BROWSE,
  DESTROY,
  RESET,
  UPDATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicInfo";
import { SearchUser } from "../../../../../components/searchables";
import {
  globalSearch,
  properFullname,
} from "../../../../../services/utilities";
import ClinicModal from "./modal";

const formatTime = (time = {}) => {
  const hour = Number(time?.hour);
  const min = Number(time?.min);

  if (Number.isNaN(hour) || Number.isNaN(min)) return "";

  const normalizedHour = hour % 12 || 12;
  const paddedMin = String(min).padStart(2, "0");
  const period = hour >= 12 ? "PM" : "AM";

  return `${normalizedHour}:${paddedMin} ${period}`;
};

const renderScheduleSummary = (schedules = []) => {
  if (!Array.isArray(schedules) || !schedules.length) {
    return <span className="text-muted">No schedule</span>;
  }

  return (
    <div>
      {schedules.slice(0, 2).map((schedule, index) => {
        const days = Array.isArray(schedule?.days)
          ? schedule.days.join(", ")
          : "";
        const start = formatTime(schedule?.start);
        const end = formatTime(schedule?.end);
        const location =
          schedule?.location?.room ||
          schedule?.location?.building ||
          schedule?.location?.address ||
          "";

        return (
          <div key={`${days}-${start}-${end}-${index}`} className="mb-1">
            <div>
              <strong>{days || "No day set"}</strong>
            </div>
            <small className="text-muted">
              {[start && end ? `${start} - ${end}` : "", location]
                .filter(Boolean)
                .join(" | ") || "No time set"}
            </small>
          </div>
        );
      })}
      {schedules.length > 2 && (
        <small className="text-info">
          +{schedules.length - 2} more schedule(s)
        </small>
      )}
    </div>
  );
};

const getSecretaryId = (secretary = null) =>
  secretary?._id || secretary?.value || secretary?.contactId?._id || secretary;

const getSecretaryName = (secretary = null) =>
  properFullname(
    secretary?.fullName ||
      secretary?.user?.fullName ||
      secretary?.contactId?.fullName,
  );

const Index = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { collections, isLoading, isSuccess, message } = useSelector(
    ({ clinicInfo }) => clinicInfo,
  );
  const [clinics, setClinics] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [willCreate, setWillCreate] = useState(true);
  const [inlineSecretaryClinicId, setInlineSecretaryClinicId] = useState("");

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(
        BROWSE({
          token,
          params: { branchId: activePlatform?.branchId },
        }),
      );
    }

    return () => dispatch(RESET());
  }, [activePlatform, dispatch, token]);

  const mappedClinics = useMemo(
    () =>
      (collections || []).map((clinic) => {
        const physician =
          clinic?.physician ||
          clinic?.physicianId ||
          (clinic?.userId
            ? {
                _id: clinic?.physicianId?._id,
                user: clinic.userId,
                fullName: clinic?.userId?.fullName,
              }
            : null);
        const physicianName = properFullname(
          physician?.user?.fullName ||
            physician?.fullName ||
            physician?.ghost?.fullName ||
            physician?.ghostName,
        );
        const secretarySource = Array.isArray(clinic?.secretaries)
          ? clinic.secretaries
          : clinic?.contactPerson?.contactId
            ? [clinic.contactPerson.contactId]
            : [];
        const secretaries = secretarySource.filter(Boolean);
        const secretaryNames = secretaries
          .map((secretary) => getSecretaryName(secretary))
          .filter(Boolean);

        return {
          ...clinic,
          physician,
          secretaries,
          physicianName,
          secretaryNames,
        };
      }),
    [collections],
  );

  useEffect(() => {
    setClinics(mappedClinics);
  }, [mappedClinics]);

  useEffect(() => {
    if (!inlineSecretaryClinicId) return;

    const timer = window.setTimeout(() => {
      const input = document.querySelector(
        `[data-secretary-search="${inlineSecretaryClinicId}"] input`,
      );

      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [inlineSecretaryClinicId]);

  useEffect(() => {
    if (!message) return;

    addToast(message, {
      appearance: isSuccess ? "success" : "error",
    });

    return () => dispatch(RESET());
  }, [addToast, dispatch, isSuccess, message]);

  const toggleModal = () => setShowModal((state) => !state);

  const handleCreate = () => {
    setSelected(null);
    setWillCreate(true);
    setShowModal(true);
  };

  const handleEdit = (clinic) => {
    setSelected(clinic);
    setWillCreate(false);
    setShowModal(true);
  };

  const handleDelete = async (clinic) => {
    const result = await Swal.fire({
      title: "Delete Clinic?",
      text: `This will remove ${clinic?.title || "this clinic"} from the list.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(DESTROY({ token, data: { id: clinic?._id } }));
    }
  };

  const handleSearch = (event) => {
    const keyword = event.target.value;

    if (!keyword) return setClinics(mappedClinics);

    setClinics(globalSearch(mappedClinics, keyword));
  };

  const buildClinicPayload = (clinic, secretaries) => ({
    _id: clinic?._id,
    title: clinic?.title || "",
    code: clinic?.code || "",
    status: clinic?.status || "draft",
    description: clinic?.description || "",
    remarks: clinic?.remarks || "",
    branchId: clinic?.branchId?._id || clinic?.branchId || activePlatform?.branchId,
    physicianId: clinic?.physicianId?._id || clinic?.physician?._id || clinic?.physicianId,
    ...(clinic?.userId?._id || clinic?.userId
      ? { userId: clinic?.userId?._id || clinic?.userId }
      : {}),
    secretaries: secretaries.map((item) => getSecretaryId(item)).filter(Boolean),
    schedules: clinic?.schedules || [],
    specialization:
      clinic?.specialization || clinic?.specializations?.[0] || "",
    specializations: clinic?.specializations || [],
  });

  const handleInlineSecretarySelect = (clinic, user) => {
    const nextSecretaries = (clinic?.secretaries || []).some(
      (item) => String(getSecretaryId(item)) === String(user?._id),
    )
      ? clinic.secretaries || []
      : [...(clinic?.secretaries || []), user];

    dispatch(
      UPDATE({
        token,
        data: buildClinicPayload(clinic, nextSecretaries),
      }),
    );
    setInlineSecretaryClinicId("");
  };

  const handleInlineSecretaryRemove = (clinic, secretaryId) => {
    const nextSecretaries = (clinic?.secretaries || []).filter(
      (item) => String(getSecretaryId(item)) !== String(secretaryId),
    );

    dispatch(
      UPDATE({
        token,
        data: buildClinicPayload(clinic, nextSecretaries),
      }),
    );
  };

  const title = useMemo(
    () => `${clinics.length} Clinic Records`,
    [clinics.length],
  );

  return (
    <MDBContainer fluid>
      <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
        <MDBCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Clinic Management</h4>
            <small className="text-muted">{title}</small>
          </div>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control mr-2"
              placeholder="Search clinic"
              onChange={handleSearch}
              style={{ minWidth: "220px" }}
            />
            <MDBBtn color="info" rounded size="sm" onClick={handleCreate}>
              <MDBIcon icon="plus" className="mr-1" />
              Create Clinic
            </MDBBtn>
          </div>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBTable responsive hover>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>Clinic</th>
                <th>Specialization</th>
                <th>Schedules</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {!isLoading && clinics.length > 0 ? (
                clinics.map((clinic, index) => {
                  return (
                    <tr key={clinic?._id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{clinic?.title || "Untitled Clinic"}</strong>
                        <div>
                          <small className="text-muted">
                            Physician:{" "}
                            {clinic?.physicianName || "Unassigned Physician"}
                          </small>
                        </div>
                        <div
                          className="mt-2 border rounded px-2 py-2"
                          style={{
                            background:
                              inlineSecretaryClinicId === clinic?._id
                                ? "#eef8ff"
                                : "#f8fbff",
                            borderColor:
                              inlineSecretaryClinicId === clinic?._id
                                ? "#90caf9"
                                : "#d9ecff",
                            outline: "none",
                          }}
                          tabIndex={0}
                          onFocus={() => setInlineSecretaryClinicId(clinic?._id)}
                          onClick={() => setInlineSecretaryClinicId(clinic?._id)}
                        >
                          <small className="text-muted d-block">
                            Secretary
                          </small>
                          {!!clinic?.secretaries?.length ? (
                            <div className="mt-2">
                              {(clinic?.secretaries || []).map((secretary) => {
                                const secretaryId = getSecretaryId(secretary);
                                return (
                                  <div
                                    key={secretaryId}
                                    className="d-flex justify-content-between align-items-center border rounded px-2 py-1 mb-1"
                                    style={{ background: "#fff", gap: "0.5rem" }}
                                  >
                                    <small className="mb-0">
                                      {getSecretaryName(secretary) ||
                                        "Unnamed user"}
                                    </small>
                                    <MDBBtn
                                      size="sm"
                                      rounded
                                      color="danger"
                                      className="px-2 py-1 mb-0"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleInlineSecretaryRemove(
                                          clinic,
                                          secretaryId,
                                        );
                                      }}
                                    >
                                      <MDBIcon icon="times" />
                                    </MDBBtn>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <small className="text-muted d-block mt-1">
                              No tagged secretary yet
                            </small>
                          )}
                          {inlineSecretaryClinicId === clinic?._id && (
                            <div
                              className="mt-2"
                              data-secretary-search={clinic?._id}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <SearchUser
                                setPatient={(user) =>
                                  handleInlineSecretarySelect(clinic, user)
                                }
                                excludes={clinic?.secretaries || []}
                                excludeKey="_id"
                                notFoundMessage="No secretary user found."
                                allowRegister={false}
                              />
                              <div className="mt-2">
                                <small className="text-muted">
                                  Search a user to tag or retag secretary.
                                </small>
                              </div>
                              <MDBBtn
                                size="sm"
                                rounded
                                color="secondary"
                                className="mt-2 px-2"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setInlineSecretaryClinicId("");
                                }}
                              >
                                Done
                              </MDBBtn>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {clinic?.specialization ||
                          clinic?.specializations?.join(", ") ||
                          "-"}
                      </td>
                      <td>{renderScheduleSummary(clinic?.schedules)}</td>
                      <td>
                        <MDBBadge color="info">
                          {clinic?.status || "draft"}
                        </MDBBadge>
                      </td>
                      <td>
                        <MDBBtn
                          size="sm"
                          rounded
                          color="info"
                          className="mr-2 px-2"
                          onClick={() => handleEdit(clinic)}
                        >
                          <MDBIcon icon="pencil-alt" />
                        </MDBBtn>
                        <MDBBtn
                          size="sm"
                          rounded
                          color="danger"
                          className="px-2"
                          onClick={() => handleDelete(clinic)}
                        >
                          <MDBIcon icon="trash" />
                        </MDBBtn>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    {isLoading
                      ? "Loading clinics..."
                      : "No clinic records found."}
                  </td>
                </tr>
              )}
            </MDBTableBody>
          </MDBTable>
        </MDBCardBody>
      </MDBCard>

      <ClinicModal
        selected={selected}
        show={showModal}
        toggle={toggleModal}
        willCreate={willCreate}
      />
    </MDBContainer>
  );
};

export default Index;
