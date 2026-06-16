import { useEffect, useMemo, useState } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBRow,
  MDBStep,
  MDBStepper,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useToasts } from "react-toast-notifications";
import { SearchUser } from "../../../../../components/searchables";
import Information from "../../../physician/dashboard/register/information";
import Schedule from "../../../physician/dashboard/register/schedule";
import { BROWSE as BROWSE_PHYSICIANS } from "../../../../../services/redux/slices/assets/persons/physicians";
import { BROWSE as BROWSE_USERS } from "../../../../../services/redux/slices/assets/persons/users";
import {
  RESET,
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicInfo";
import { properFullname } from "../../../../../services/utilities";

const defaultForm = {
  title: "",
  code: "",
  status: "draft",
  specialization: "",
  description: "",
  remarks: "",
  secretaries: [],
  schedules: [],
};

const getPhysicianName = (physician = null) => {
  if (!physician) return "";
  return properFullname(
    physician?.user?.fullName ||
      physician?.fullName ||
      physician?.ghost?.fullName ||
      physician?.ghostName
  );
};

const getSecretaryId = (secretary = null) =>
  secretary?._id || secretary?.value || secretary;

const getSecretaryName = (secretary = null) =>
  properFullname(
    secretary?.fullName ||
      secretary?.user?.fullName ||
      secretary?.contactId?.fullName
  );

export default function ClinicModal({
  show = false,
  toggle = () => {},
  selected = null,
  willCreate = true,
}) {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { isLoading, isSuccess, formSubmitted } = useSelector(
    ({ clinicInfo }) => clinicInfo
  );
  const {
    collections: taggedPhysicians = [],
    isLoading: physiciansLoading,
  } = useSelector(({ physicians }) => physicians);
  const {
    collections: branchUsers = [],
    isLoading: usersLoading,
  } = useSelector(({ users }) => users);
  const [form, setForm] = useState(defaultForm);
  const [physician, setPhysician] = useState(null);
  const [isSchedule, setIsSchedule] = useState(false);

  const physicianName = useMemo(() => getPhysicianName(physician), [physician]);
  const physicianOptions = useMemo(
    () =>
      (taggedPhysicians || []).map((item) => ({
        ...item,
        value: item?._id,
        label: getPhysicianName(item) || item?.specialization || "Unnamed physician",
      })),
    [taggedPhysicians]
  );
  const selectedSecretaryNames = useMemo(
    () =>
      (form?.secretaries || [])
        .map((item) => {
          if (typeof item !== "string") return getSecretaryName(item);

          return branchUsers.find((user) => String(user?._id) === String(item))
            ? getSecretaryName(
                branchUsers.find((user) => String(user?._id) === String(item))
              )
            : "";
        })
        .filter(Boolean),
    [branchUsers, form?.secretaries]
  );

  useEffect(() => {
    if (!willCreate || !physician) return;

    setForm((prev) => ({
      ...prev,
      title: prev?.title || physicianName,
      specialization:
        prev?.specialization ||
        physician?.specialization ||
        physician?.specialty ||
        "",
    }));
  }, [physician, physicianName, willCreate]);

  useEffect(() => {
    if (!show) return;

    const specializations = selected?.specializations || [];
    const specialization =
      selected?.specialization || specializations?.[0] || "";

    setForm({
      ...defaultForm,
      ...selected,
      specialization,
      secretaries: selected?.secretaries || [],
      schedules: selected?.schedules || [],
    });
    setPhysician(selected?.physician || null);
    setIsSchedule(false);
  }, [selected, show]);

  useEffect(() => {
    if (!show || !branchUsers.length) return;

    setForm((prev) => {
      const hasStringSecretary = (prev?.secretaries || []).some(
        (item) => typeof item === "string"
      );

      if (!hasStringSecretary) return prev;

      return {
        ...prev,
        secretaries: (prev?.secretaries || []).map((item) =>
          typeof item === "string"
            ? branchUsers.find((user) => String(user?._id) === String(item)) ||
              item
            : item
        ),
      };
    });
  }, [branchUsers, show]);

  useEffect(() => {
    if (!show || !token || !activePlatform?.branchId) return;

    dispatch(
      BROWSE_PHYSICIANS({
        token,
        key: { branchId: activePlatform.branchId },
      })
    );
    dispatch(
      BROWSE_USERS({
        token,
        key: { branchId: activePlatform.branchId },
      })
    );
  }, [activePlatform?.branchId, dispatch, show, token]);

  useEffect(() => {
    if (!show || !isSuccess) return;
    toggle();
    dispatch(RESET());
  }, [dispatch, isSuccess, show, toggle]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSchedule(true);
  };

  const handlePhysicianChange = ({ target }) => {
    const nextPhysician = physicianOptions.find(
      (item) => String(item.value) === String(target.value)
    );

    setPhysician(nextPhysician || null);
  };

  const handleSecretarySelect = (user) => {
    setForm((prev) => ({
      ...prev,
      secretaries: (prev?.secretaries || []).some(
        (item) => String(getSecretaryId(item)) === String(user?._id)
      )
        ? prev.secretaries
        : [...(prev?.secretaries || []), user],
    }));
  };

  const handleSecretaryRemove = (secretaryId) => {
    setForm((prev) => ({
      ...prev,
      secretaries: (prev?.secretaries || []).filter(
        (item) => String(getSecretaryId(item)) !== String(secretaryId)
      ),
    }));
  };

  const handleSave = () => {
    const { schedules = [] } = form;
    const physicianRecordId =
      physician?.physicianId || physician?._id || selected?.physicianId?._id;
    const physicianUserId =
      physician?.user?._id || physician?.userId?._id || selected?.userId?._id;

    if (!physicianRecordId) {
      addToast("Please select a physician first.", {
        appearance: "warning",
      });
      return;
    }

    if (!schedules.length) {
      Swal.fire({
        icon: "warning",
        title: "No Schedule Found",
        text: "You need to create at least one schedule before saving.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const payload = {
      ...form,
      ...(selected?._id ? { _id: selected._id } : {}),
      branchId: activePlatform?.branchId,
      physicianId: physicianRecordId,
      ...(physicianUserId ? { userId: physicianUserId } : {}),
      secretaries: (form?.secretaries || [])
        .map((item) => getSecretaryId(item))
        .filter(Boolean),
      specialization: form?.specialization || "",
      specializations: form?.specialization ? [form.specialization] : [],
    };

    const action = willCreate ? SAVE : UPDATE;
    dispatch(
      action({
        data: payload,
        token,
      })
    );
  };

  return (
    <MDBModal
      size={isSchedule ? "fluid" : "xl"}
      position="center"
      isOpen={show}
      toggle={toggle}
      backdrop
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clinic-medical" className="mr-2" />
        {willCreate ? "Create Clinic" : "Edit Clinic"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBStepper className="m-0 p-0 mt-n4">
          <MDBStep className="active">
            <a href="!#">
              <span className="circle">1</span>
              <span className="label">Clinic Information</span>
            </a>
          </MDBStep>
          <MDBStep className={isSchedule ? "active" : ""}>
            <a href="!#">
              <span className="circle">2</span>
              <span className="label">Schedules</span>
            </a>
          </MDBStep>
        </MDBStepper>

        {isSchedule ? (
          <>
            <Schedule form={form} setForm={setForm} />

            <div className="d-flex justify-content-between w-100 mt-3">
              <MDBBtn
                size="md"
                color="secondary"
                onClick={() => setIsSchedule(false)}
                disabled={isLoading || formSubmitted}
              >
                Prev
              </MDBBtn>
              <MDBBtn
                size="md"
                color="info"
                type="button"
                onClick={handleSave}
                disabled={isLoading || formSubmitted}
              >
                {formSubmitted ? "Saving..." : willCreate ? "Submit" : "Update"}
              </MDBBtn>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="w-100">
            <MDBRow>
              <MDBCol md="12" className="mb-3">
                <strong>Physician</strong>
                <>
                  <select
                    className="browser-default custom-select mt-2"
                    value={physician?._id || ""}
                    onChange={handlePhysicianChange}
                    disabled={physiciansLoading || isLoading || formSubmitted}
                  >
                    <option value="">
                      {physiciansLoading
                        ? "Loading tagged physicians..."
                        : "Select tagged physician"}
                    </option>
                    {physicianOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                        {item?.specialization ? ` - ${item.specialization}` : ""}
                        {item?.isGhost ? " (Ghost)" : ""}
                      </option>
                    ))}
                  </select>
                  {physicianName && (
                    <small className="d-block mt-2 text-primary">
                      Selected: {physicianName}
                    </small>
                  )}
                  {!physiciansLoading && !physicianOptions.length && (
                    <small className="d-block mt-2 text-muted">
                      No tagged physicians found for this branch.
                    </small>
                  )}
                </>
              </MDBCol>
              <MDBCol md="12" className="mb-3">
                <strong>Secretary</strong>
                <>
                  <div className="mt-2">
                    <SearchUser
                      setPatient={handleSecretarySelect}
                      excludes={form?.secretaries || []}
                      excludeKey="_id"
                      notFoundMessage="No secretary user found."
                      allowRegister={false}
                    />
                  </div>
                  <small className="d-block mt-2 text-muted">
                    Search and select a user to tag as secretary.
                  </small>
                  {!!form?.secretaries?.length && (
                    <div className="mt-3">
                      {(form?.secretaries || []).map((secretary) => {
                        const secretaryId = getSecretaryId(secretary);
                        const secretaryName = getSecretaryName(secretary);

                        return (
                          <div
                            key={secretaryId}
                            className="d-flex justify-content-between align-items-center border rounded px-3 py-2 mb-2"
                            style={{ background: "#f8fbff" }}
                          >
                            <div>
                              <div className="font-weight-bold">
                                {secretaryName || "Unnamed user"}
                              </div>
                              <small className="text-muted">
                                {secretary?.email || secretaryId}
                              </small>
                            </div>
                            <MDBBtn
                              type="button"
                              size="sm"
                              color="danger"
                              rounded
                              className="px-2 mb-0"
                              onClick={() => handleSecretaryRemove(secretaryId)}
                            >
                              <MDBIcon icon="times" />
                            </MDBBtn>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!usersLoading && !selectedSecretaryNames.length && (
                    <small className="d-block mt-2 text-muted">
                      No tagged secretary yet.
                    </small>
                  )}
                </>
              </MDBCol>
            </MDBRow>

            <Information form={form} setForm={setForm} />

            <div className="d-flex justify-content-end mt-3">
              <MDBBtn size="md" color="info" type="submit">
                Next
              </MDBBtn>
            </div>
          </form>
        )}
      </MDBModalBody>
    </MDBModal>
  );
}
