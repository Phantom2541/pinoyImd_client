import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
} from "mdbreact";
import {
  TOGGLE_PATIENT_MODAL,
  SAVE,
  SetSCHED,
  arrangeSchedules,
  SetPHYSICIAN,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { useEffect, useState } from "react";
import visitTypes from "../visitTypes.json";
import { EditableUser } from "../../../../../components/customizable";
import Register from "./register";
import Swal from "sweetalert2";
import { fullName, generateEmail } from "../../../../../services/utilities";
import Spinner from "../../../../../components/spinner";
const _form = {
  isRegister: false,
  sched: "",
  patient: "",
  visitType: "",
};
export default function PatientModal() {
  const { auth, token } = useSelector(({ auth }) => auth);
  const {
      showPatientModal,
      selected,
      scheds,
      activeSched,
      roster = [],
      physicians = [],
      activePhysician,
      formSubmitted,
    } = useSelector(({ appointments }) => appointments),
    [physician, setPhysician] = useState(""),
    [form, setForm] = useState(_form),
    [schedules, setSchedules] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (showPatientModal && activePhysician?._id) {
      setForm({ ..._form, sched: activeSched });
      setPhysician(activePhysician?._id);
      setSchedules(scheds);
    } else {
      setForm(_form);
      setPhysician("");
      setSchedules([]);
    }
  }, [showPatientModal, activeSched, activePhysician, scheds]);

  const toggle = () => dispatch(TOGGLE_PATIENT_MODAL());

  const handleSubmit = (e) => {
    e.preventDefault();
    const clinic = [...roster].find(
      ({ physicianId }) => physicianId?._id === physician
    )?._id;

    const { isRegister, patient } = form;

    if (!isRegister && !patient) {
      Swal.fire({
        icon: "warning",
        title: "Patient Required",
        text: "Please select a patient from the search or register a new patient before proceeding.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      return; // stop submission
    }

    if (!clinic) {
      Swal.fire({
        icon: "warning",
        title: "Clinic Required",
        text: "Please select a clinic.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      return; // stop submission
    }

    const _form = {
      ...form,
      clinic,
      status: "draft",
      userId: auth._id,
      ...(isRegister && {
        patient: {
          ...patient,
          password: patient?.dob.replaceAll("-", ""),
          email: patient?.email || generateEmail(patient),
        },
      }),
    };
    dispatch(SAVE({ data: _form, token })).then(() => {
      dispatch(SetPHYSICIAN(physician));
      dispatch(SetSCHED({ sched: form.sched }));
      setForm(_form);
      toggle();
    });
  };

  const handleChangePhysician = (e) => {
    const { value } = e.target;
    const { schedules = [] } = [...roster].find(
      ({ physicianId }) => physicianId?._id === value
    );

    setSchedules(arrangeSchedules(schedules));
    setPhysician(value);
  };

  return (
    <MDBModal isOpen={showPatientModal} toggle={toggle} backdrop size={"md"}>
      <MDBModalHeader
        toggle={toggle}
        className=" light-blue darken-3 white-text"
      >
        <MDBIcon icon="calendar " className=" mr-2" />
        Appointment
      </MDBModalHeader>

      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          {form.isRegister ? (
            <Register form={form} setForm={setForm} />
          ) : (
            <div>
              <span style={{ fontWeight: 400 }} className=" d-block grey-text">
                Patient:
              </span>
              <EditableUser
                readOnly
                defaultSearchValue={selected?.defaultSearch}
                setUserId={(patient) => setForm({ ...form, patient })}
                hasRegister
                setRegister={(fullName) =>
                  setForm({ ...form, isRegister: true, patient: { fullName } })
                }
              />
            </div>
          )}
          <div>
            <span
              style={{ fontWeight: 400 }}
              className="mb-1 d-block grey-text mt-3"
            >
              Visit Type:
            </span>
            <select
              className="form-control"
              required
              value={form?.visitType}
              onChange={(e) => setForm({ ...form, visitType: e.target.value })}
            >
              <option value="">Choose Visit Type</option>
              {visitTypes.map((visit, index) => (
                <option key={index} value={visit}>
                  {visit}
                </option>
              ))}
            </select>
          </div>
          {!activePhysician._id && (
            <div>
              <span
                style={{ fontWeight: 400 }}
                className="mb-1 d-block grey-text mt-3"
              >
                Physician:
              </span>
              <select
                className="form-control"
                required
                value={physician}
                onChange={handleChangePhysician}
              >
                <option value="">Choose a Physician </option>
                {physicians.map(({ fullName: name, _id }) => (
                  <option key={_id} value={_id}>
                    Dr. {fullName(name)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <span
              style={{ fontWeight: 400 }}
              className="mb-1 d-block grey-text mt-3"
            >
              Schedule:
            </span>
            <select
              className="form-control"
              required
              value={form?.sched}
              onChange={(e) => setForm({ ...form, sched: e.target.value })}
            >
              <option value="">Choose a Schedule </option>
              {schedules.map((sched) => (
                <option key={sched} value={sched}>
                  {sched}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center mt-3">
            <MDBBtn
              size="md"
              color="info"
              rounded
              type="submit"
              disabled={formSubmitted}
            >
              Submit <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
