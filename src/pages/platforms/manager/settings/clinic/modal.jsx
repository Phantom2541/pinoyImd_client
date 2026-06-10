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
import { SearchPhysicians } from "../../../../../components/searchables";
import Information from "../../../physician/dashboard/register/information";
import Schedule from "../../../physician/dashboard/register/schedule";
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
  const [form, setForm] = useState(defaultForm);
  const [physician, setPhysician] = useState(null);
  const [isSchedule, setIsSchedule] = useState(false);

  const physicianName = useMemo(() => {
    if (!physician) return "";
    return properFullname(physician?.user?.fullName || physician?.fullName);
  }, [physician]);

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
    if (!show || !isSuccess) return;
    toggle();
    dispatch(RESET());
  }, [dispatch, isSuccess, show, toggle]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSchedule(true);
  };

  const handleSave = () => {
    const { schedules = [] } = form;

    if (!physician?._id) {
      addToast("Please select a physician first.", {
        appearance: "warning",
      });
      return;
    }

    if (physician?.isGhost || !physician?.user?._id) {
      addToast("Ghost physicians cannot be assigned to a clinic yet.", {
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
      branchId: activePlatform?.branchId,
      userId: physician?.user?._id,
      physicianId: physician?.user?._id,
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
                {willCreate ? (
                  <>
                    <div className="mt-2">
                      <SearchPhysicians setPhysician={setPhysician} />
                    </div>
                    {physicianName && (
                      <small className="d-block mt-2 text-primary">
                        Selected: {physicianName}
                      </small>
                    )}
                  </>
                ) : (
                  <div className="mt-2 text-primary">
                    {physicianName || form?.title || "No physician assigned"}
                  </div>
                )}
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
