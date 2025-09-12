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

export default function Register({ show, toggle = () => {} }) {
  const [form, setForm] = useState({ schedules: [] });
  const [isSchedule, setIsSchedule] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSchedule(true);
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
              <MDBBtn size="md" color="info" type="submit">
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
