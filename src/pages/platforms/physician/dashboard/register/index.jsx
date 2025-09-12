import {
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBStepper,
  MDBStep,
  MDBBtn,
} from "mdbreact";
import Information from "./information";
import Schedule from "./schedule";
import { useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { SAVE } from "../../../../../services/redux/slices/diagnostics/clinic/clinicInfo";

export default function Register({ show, toggle = () => {} }) {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);
  const [form, setForm] = useState({ schedules: [] });
  const [isSchedule, setIsSchedule] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSchedule(true);
  };
  const handleSave = () => {
    const { schedules = [] } = form;

    if (schedules.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Schedule Found",
        text: "You need to create at least one schedule before saving.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    dispatch(
      SAVE({
        data: {
          ...form,
          physicianId: auth._id,
          branchId: activePlatform?.branchId,
        },
        token,
      })
    ).then(() => {
      setIsSchedule(false);
      setForm({ schedules: [] });
    });
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
        <MDBIcon icon="clinic-medical" /> Register Clinic
      </MDBModalHeader>
      <MDBModalBody className="mb-0 ">
        <MDBStepper className="m-0 p-0 mt-n4">
          <MDBStep className={"active"}>
            <a>
              <span className="circle">1</span>
              <span className="label">Clinic Information</span>
            </a>
          </MDBStep>
          <MDBStep className={isSchedule ? "active" : ""}>
            <a>
              <span className="circle">2</span>
              <span className="label">Schedules</span>
            </a>
          </MDBStep>
        </MDBStepper>
        {isSchedule ? (
          <>
            <Schedule form={form} setForm={setForm} />

            {/* buttons row */}
            <div className="d-flex justify-content-between w-100 mt-3">
              <MDBBtn
                size="md"
                color="secondary"
                onClick={() => setIsSchedule(false)}
              >
                Prev
              </MDBBtn>
              <MDBBtn size="md" color="info" type="submit" onClick={handleSave}>
                Submit
              </MDBBtn>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="w-100">
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
