import { useEffect, useMemo, useState } from "react";
import {
  MDBBtn,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBStep,
  MDBStepper,
} from "mdbreact";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Swal from "sweetalert2";
import Information from "../../../../physician/dashboard/register/information";
import Schedule from "../../../../physician/dashboard/register/schedule";
import { axioKit, properFullname } from "../../../../../../services/utilities";

const url = "/diagnostics/clinic/informations";

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
  physician = null,
  onSaved = () => {},
}) {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { addToast } = useToasts();
  const [form, setForm] = useState(defaultForm);
  const [isSchedule, setIsSchedule] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const physicianName = useMemo(() => {
    if (!physician) return "";
    return properFullname(physician?.user?.fullName || physician?.ghostName);
  }, [physician]);

  useEffect(() => {
    if (!show || !physician) return;

    const clinic = physician?.clinic || {};

    setForm({
      ...defaultForm,
      ...clinic,
      title: clinic?.title || physicianName || "",
      specialization:
        clinic?.specialization ||
        physician?.specialization ||
        physician?.specialty ||
        "",
      description: clinic?.description || "",
      remarks: clinic?.remarks || "",
      schedules: clinic?.schedules || [],
    });
    setIsSchedule(false);
  }, [show, physician, physicianName]);

  const handleNext = (event) => {
    event.preventDefault();
    setIsSchedule(true);
  };

  const handleSave = async () => {
    const { schedules = [] } = form;

    if (!schedules.length) {
      Swal.fire({
        icon: "warning",
        title: "No Schedule Found",
        text: "You need to create at least one schedule before saving.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    if (!physician?.user?._id) {
      addToast("Clinic can only be created for registered physicians.", {
        appearance: "warning",
      });
      return;
    }

    const payload = {
      ...form,
      physicianId: physician.user._id,
      branchId: activePlatform?.branchId,
      userId: physician.user._id,
      specialization:
        form?.specialization ||
        physician?.specialization ||
        physician?.specialty ||
        "",
      _id: form?._id,
    };

    setIsSubmitting(true);

    try {
      const saved = form?._id
        ? await axioKit.update(url, payload, token)
        : await axioKit.save(url, payload, token);

      addToast(
        form?._id
          ? "Clinic updated successfully."
          : "Clinic created successfully.",
        {
          appearance: "success",
        },
      );

      onSaved(saved);
      toggle();
    } catch (error) {
      addToast(error.message || "Failed to save clinic.", {
        appearance: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        {form?._id ? "Edit Clinic" : "Create Clinic"}
        {physicianName ? ` - ${physicianName}` : ""}
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
                disabled={isSubmitting}
              >
                Prev
              </MDBBtn>
              <MDBBtn
                size="md"
                color="info"
                type="button"
                onClick={handleSave}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : form?._id ? "Update" : "Submit"}
              </MDBBtn>
            </div>
          </>
        ) : (
          <form onSubmit={handleNext} className="w-100">
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
