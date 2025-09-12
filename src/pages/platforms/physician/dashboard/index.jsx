import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdbreact";
import { useState } from "react";
import Register from "./register";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  return (
    <MDBContainer fluid>
      <MDBRow className="w-100 justify-content-center">
        <MDBCol md="8" lg="5">
          <MDBCard className="shadow-3 rounded-4 border-0">
            <MDBCardBody className="text-center p-5">
              {/* Clinic Logo Placeholder */}
              <div className="mb-4">
                <i className="fas fa-stethoscope fa-3x text-primary"></i>
              </div>

              {/* Title */}
              <h2 className="fw-bold text-primary mb-2">
                Welcome to <span className="text-dark">Pinoy IMD Clinic</span>
              </h2>
              <h6 className="text-muted mb-4">
                Modern Healthcare Management System
              </h6>

              {/* Main Pitch */}
              <p className="text-muted fs-6 mb-4">
                Manage your clinic with ease and confidence. From patient
                records to billing — everything is organized in one system.
              </p>

              {/* Highlighted Call */}
              <p className="fs-6 mb-5">
                <span className="fw-bold text-danger">
                  Register your clinic today
                </span>{" "}
                and gain access to tools that help you work faster, avoid
                errors, and provide better patient care.
              </p>

              {/* CTA Button */}
              <MDBBtn
                color="primary"
                size="lg"
                onClick={() => setShow(true)}
                className="px-5 py-2 shadow-2 rounded-pill"
              >
                🚀 Register My Clinic
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <Register show={show} toggle={() => setShow(!show)} />
    </MDBContainer>
  );
};

export default Dashboard;
