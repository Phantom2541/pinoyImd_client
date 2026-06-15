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
import Information from "../../../physician/dashboard/register/information";
import Schedule from "../../../physician/dashboard/register/schedule";
import { BROWSE as BROWSE_PHYSICIANS } from "../../../../../services/redux/slices/assets/persons/physicians";
import {
  RESET,
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicInfo";
import { properFullname } from "../../../../../services/utilities";

const defaultForm = {
  title: "",
  code: "",
  specialization: "",
  description: "",
  remarks: "",
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
      schedules: selected?.schedules || [],
    });
    setPhysician(selected?.physician || null);
    setIsSchedule(false);
  }, [selected, show]);

  useEffect(() => {
    if (!show || !token || !activePlatform?.branchId) return;

    dispatch(
      BROWSE_PHYSICIANS({
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
