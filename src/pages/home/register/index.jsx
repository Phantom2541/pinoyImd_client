import { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  CUSTOMALERT,
  REGISTER,
} from "../../../services/redux/slices/assets/persons/users";
import { Suffixes } from "../../../services/fakeDb";
import REGISTRATIONIMG from "./../../../assets/homePageRegistrationImg.png";
import "./style.css";

const Register = () => {
  const [isMale, setIsMale] = useState(false);
  const [isLocked, setIsLocked] = useState({
    password: true,
    confirmPassword: true,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState("left");

  const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Medical Details" },
    { id: 3, title: "Confirmation" },
  ];

  const { message, isLoading, isSuccess } = useSelector(({ users }) => users);
  const [suffix, setSuffix] = useState("NONE");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      email,
      password,
      confirmPassword,
      fname,
      mname,
      lname,
      dob,
      mobile,
    } = e.target;
    const fullName = {
      fname: fname.value,
      mname: mname.value,
      lname: lname.value,
      suffix: suffix,
    };

    if (password.value === confirmPassword.value) {
      dispatch(
        REGISTER({
          email: email.value,
          password: password.value,
          dob,
          mobile,
          // isMale,
          fullName,
        })
      );
    } else {
      dispatch(CUSTOMALERT("Passwords does not match."));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("registration-form")?.reset();
    }
  }, [isSuccess]);

  const handleMaleChange = (e) => {
    setIsMale(e.target.checked);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setSlideDirection("left"); // 👈 Add this
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setSlideDirection("right"); // 👈 Add this
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <MDBRow>
              <MDBCol md="6" sm="6" className="pr-0">
                <MDBInput
                  label="First Name"
                  icon="user"
                  type="text"
                  name="fname"
                  size="sm"
                  required
                />
              </MDBCol>
              <MDBCol md="6" sm="6" className="pr-0">
                <MDBInput
                  label="Middle Name"
                  icon="user"
                  type="text"
                  name="mname"
                  size="sm"
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6" sm="6" className="pr-0">
                <MDBInput
                  label="Last Name"
                  icon="user"
                  type="text"
                  name="lname"
                  size="sm"
                  required
                />
              </MDBCol>
              <MDBCol md="3" sm="3" className="pr-0">
                <MDBSelect
                  getValue={(value) => setSuffix(value[0])}
                  label={"Suffix"}
                  size="sm"
                  className="colorful-select dropdown-primary hidden-md-down ml-3"
                >
                  <MDBSelectInput name="suffix" selected={`NONE`} />
                  <MDBSelectOptions>
                    {Suffixes.map((sfx) => (
                      <MDBSelectOption key={sfx} value={sfx}>
                        {sfx}
                      </MDBSelectOption>
                    ))}
                  </MDBSelectOptions>
                </MDBSelect>
              </MDBCol>
              <MDBCol md="3" sm="3" className="pr-0">
                <div className="d-flex flex-column align-items-center mt-1 mb-4">
                  <MDBInput
                    label="Male"
                    type="checkbox"
                    size="sm"
                    id="male"
                    checked={isMale}
                    onChange={handleMaleChange}
                  />
                  <MDBInput
                    label="Female"
                    type="checkbox"
                    id="female"
                    size="sm"
                    checked={!isMale}
                    onChange={() => setIsMale(false)}
                  />
                </div>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6" sm="6" className="pr-0">
                <MDBInput
                  label="Date Of Birth"
                  icon="calendar "
                  type="date"
                  name="dob"
                  size="sm"
                  required
                />
              </MDBCol>
              <MDBCol md="6" sm="6" className="pr-0">
                <MDBInput
                  label="Phone #"
                  icon="mobile "
                  type="text"
                  name="mobile"
                  size="sm"
                  required
                />
              </MDBCol>
            </MDBRow>
          </>
        );
      case 2:
        return (
          <MDBInput
            label="E-mail Address"
            icon="envelope"
            type="email"
            name="email"
            required
          />
        );
      case 3:
        return (
          <>
            <MDBRow>
              <MDBCol md="6" sm="6">
                <MDBInput
                  label="Password"
                  minLength={8}
                  icon={isLocked.password ? "lock" : "unlock"}
                  onIconMouseEnter={() =>
                    setIsLocked({ ...isLocked, password: false })
                  }
                  onIconMouseLeave={() =>
                    setIsLocked({ ...isLocked, password: true })
                  }
                  type={isLocked.password ? "password" : "text"}
                  name="password"
                  required
                />
              </MDBCol>
              <MDBCol md="6" sm="6">
                <MDBInput
                  label="Confirm your password"
                  minLength={8}
                  icon={isLocked.confirmPassword ? "lock" : "unlock"}
                  onIconMouseEnter={() =>
                    setIsLocked({ ...isLocked, confirmPassword: false })
                  }
                  onIconMouseLeave={() =>
                    setIsLocked({ ...isLocked, confirmPassword: true })
                  }
                  type={isLocked.confirmPassword ? "password" : "text"}
                  name="confirmPassword"
                  required
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="12" sm="12" className="mt-4">
                <MDBInput
                  label="I read and agree with the Terms and Conditions"
                  type="checkbox"
                  id="agreement"
                  name="agreement"
                  required
                />
              </MDBCol>
            </MDBRow>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between w-100"
      style={{ gap: "15px" }}
    >
      <div style={{ flex: 1 }}>
        <h2 style={{ fontWeight: "400" }}>Patient Registration Form</h2>

        {/* Stepper Header */}
        <div className="subscriber-register-stepper-wrapper">
          {steps.map((step, index) => {
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;
            const isLineActive = currentStep > step.id;

            return (
              <div key={step.id} className="subscriber-register-step">
                {/* Circle */}
                <div
                  className={`subscriber-register-step-circle ${
                    isActive ? "active" : ""
                  } ${isCurrent ? "current" : ""}`}
                >
                  {step.id}
                </div>

                {/* Title */}
                <div
                  className={`subscriber-register-step-title ${
                    isActive ? "active" : ""
                  }`}
                >
                  {step.title}
                </div>

                {/* Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`subscriber-register-step-line ${
                      isLineActive ? "active" : ""
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Step Container */}

        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
          id="registration-form"
        >
          {/* Slide animation wrapper ONLY for the content */}
          <div
            key={currentStep}
            className={`subscriber-register-step-content subscriber-register-slide-${slideDirection}`}
          >
            {renderStepContent()}
          </div>

          {/* Buttons OUTSIDE the slide animation */}
          <div
            className="d-flex justify-content-end"
            style={{ gap: "10px", marginTop: "16px" }}
          >
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="subscriber-register-btn-outline"
            >
              Back
            </button>

            {currentStep < steps.length && (
              <button
                type="button"
                onClick={handleNext}
                className="subscriber-register-btn-primary"
              >
                Next
              </button>
            )}

            {currentStep === steps.length && (
              <button
                type="submit"
                disabled={isLoading}
                className="subscriber-register-btn-primary"
              >
                {isLoading ? <MDBIcon icon="spinner" spin /> : "Sign up"}
              </button>
            )}
          </div>
        </form>
      </div>
      {currentStep === 3 ? (
        <span className="subscriber-register-terms">
          These Terms and Conditions (“Terms”) govern your access to and use of
          the Pinoy iMD system (“Platform”), a digital Electronic Health Record
          (EHR) service developed specifically for medical practitioners and
          institutions in the Philippines. By accessing or using this Platform,
          you acknowledge that you have read, understood, and agree to be
          legally bound by these Terms.
        </span>
      ) : (
        <img
          src={REGISTRATIONIMG}
          className="subscriber-register-img"
          alt="registrationImg"
          style={{ marginLeft: "40px" }}
        />
      )}
    </div>
  );
};

export default Register;
