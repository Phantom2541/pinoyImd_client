import { useState, useEffect } from "react";
import {
  MDBCol,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  DUPLICATE_CHECKER,
  REGISTER,
} from "../../../services/redux/slices/assets/persons/users";
import { Suffixes } from "../../../services/fakeDb";
import REGISTRATIONIMG from "./../../../assets/homePageRegistrationImg.png";
import "./style.css";
import Swal from "sweetalert2";
import Spinner from "../../../components/spinner";

const Register = () => {
  const dispatch = useDispatch();
  const { isSuccess, formSubmitted } = useSelector(({ users }) => users);

  const [isMale, setIsMale] = useState(false);
  const [isLocked, setIsLocked] = useState({
    password: true,
    confirmPassword: true,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState("left");

  // 👇 state for all form fields
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    suffix: "",
    dob: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const steps = [
    { id: 1, title: "Personal Info" },
    { id: 2, title: "Medical Details" },
    { id: 3, title: "Confirmation" },
  ];

  // 🔁 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSuffix = (val) => {
    setFormData((prev) => ({ ...prev, suffix: val[0] }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const { dob, email, mobile } = formData;

    const fullName = {
      fname: formData.fname,
      mname: formData.mname,
      lname: formData.lname,
      suffix: formData.suffix,
    };

    dispatch(
      DUPLICATE_CHECKER({ data: { fullName, email, mobile, dob, isMale } })
    ).then((action) => {
      if (action.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: action?.error?.message,
        });
      } else {
        setSlideDirection("left");
        setCurrentStep(currentStep + 1);
      }
    });
  };

  const handleBack = () => {
    setSlideDirection("right");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      fname,
      mname,
      lname,
      suffix,
      mobile,
      password,
      confirmPassword,
      email,
      dob,
    } = formData;

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password and Confirm passsword does not match.",
      });
      return;
    }
    const fullName = { fname, mname, lname, suffix };

    dispatch(
      REGISTER({
        data: {
          email,
          password,
          dob,
          mobile,
          isMale,
          fullName,
        },
      })
    );
  };

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        icon: "success",
        title: "Successfully Registered!",
        showConfirmButton: false,
        timer: 2000, // auto-close after 2 seconds
        timerProgressBar: true,
      });
      setFormData({
        fname: "",
        mname: "",
        lname: "",
        suffix: "NONE",
        dob: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setCurrentStep(1);
    }
  }, [isSuccess]);

  const renderStepContent = () => {
    const f = formData;

    switch (currentStep) {
      case 1:
        return (
          <>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput
                  label="First Name"
                  name="fname"
                  size={window.innerWidth <= 480 ? "sm" : "md"}
                  value={f.fname}
                  onChange={handleChange}
                  required
                />
              </MDBCol>
              <MDBCol
                md="6"
                className={`${window.innerWidth <= 480 ? "mt-n4" : ""}`}
              >
                <MDBInput
                  label="Middle Name"
                  name="mname"
                  size={window.innerWidth <= 480 ? "sm" : "md"}
                  value={f.mname}
                  onChange={handleChange}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-n4">
              <MDBCol md="6">
                <MDBInput
                  label="Last Name"
                  size={window.innerWidth <= 480 ? "sm" : "md"}
                  name="lname"
                  value={f.lname}
                  onChange={handleChange}
                  required
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBSelect
                  className={`${window.innerWidth <= 480 ? "mt-n3" : ""}`}
                  getValue={handleSuffix}
                  label="Suffix"
                  selected={f.suffix}
                >
                  <MDBSelectInput selected={f.suffix} />
                  <MDBSelectOptions>
                    {Suffixes.map((sfx) => (
                      <MDBSelectOption key={sfx} value={sfx}>
                        {sfx}
                      </MDBSelectOption>
                    ))}
                  </MDBSelectOptions>
                </MDBSelect>
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput
                  size={window.innerWidth <= 480 ? "sm" : "md"}
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={f.dob}
                  onChange={handleChange}
                  required
                />
              </MDBCol>
              <MDBCol md="6">
                <div
                  className={`d-flex align-items-center mt-4 ${
                    window.innerWidth <= 480 ? "mt-n2" : ""
                  }`}
                >
                  <MDBInput
                    label="Male"
                    type="checkbox"
                    id="male"
                    name="gender"
                    checked={isMale}
                    onChange={() => setIsMale(true)}
                  />
                  <MDBInput
                    label="Female"
                    type="checkbox"
                    id="female"
                    name="gender"
                    checked={!isMale}
                    onChange={() => setIsMale(false)}
                  />
                </div>
              </MDBCol>
            </MDBRow>
          </>
        );
      case 2:
        return (
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                size={window.innerWidth <= 480 ? "sm" : "md"}
                label="Phone #"
                name="mobile"
                value={f.mobile}
                onChange={handleChange}
                required
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                size={window.innerWidth <= 480 ? "sm" : "md"}
                className={`${window.innerWidth <= 480 ? "mt-n4" : ""}`}
                label="E-mail Address"
                name="email"
                value={f.email}
                onChange={handleChange}
                type="email"
                required
              />
            </MDBCol>
          </MDBRow>
        );
      case 3:
        return (
          <>
            <MDBRow>
              <MDBCol md="6">
                <MDBInput
                  size={window.innerWidth <= 480 ? "sm" : "md"}
                  label="Password"
                  name="password"
                  type={isLocked.password ? "password" : "text"}
                  icon={isLocked.password ? "lock" : "unlock"}
                  value={f.password}
                  minLength={8}
                  required
                  onChange={handleChange}
                  onIconMouseEnter={() =>
                    setIsLocked((prev) => ({ ...prev, password: false }))
                  }
                  onIconMouseLeave={() =>
                    setIsLocked((prev) => ({ ...prev, password: true }))
                  }
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput
                  size={window.innerWidth <= 480 ? "sm" : "md"}
                  className={`${window.innerWidth <= 480 ? "mt-n4" : ""}`}
                  label="Confirm Password"
                  name="confirmPassword"
                  type={isLocked.confirmPassword ? "password" : "text"}
                  icon={isLocked.confirmPassword ? "lock" : "unlock"}
                  value={f.confirmPassword}
                  minLength={8}
                  required
                  onChange={handleChange}
                  onIconMouseEnter={() =>
                    setIsLocked((prev) => ({
                      ...prev,
                      confirmPassword: false,
                    }))
                  }
                  onIconMouseLeave={() =>
                    setIsLocked((prev) => ({
                      ...prev,
                      confirmPassword: true,
                    }))
                  }
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <MDBInput
                  labelClass={window.innerWidth <= 480 ? "small" : ""}
                  label="I read and agree with the Terms and Conditions"
                  type="checkbox"
                  name="agreement"
                  id="agreement"
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
      className="d-flex w-100 justify-content-between"
      style={{ gap: "15px" }}
    >
      <div style={{ flex: 1 }}>
        <h2 className="subscriber-register-stepper-title">
          Patient Registration Form
        </h2>

        {/* Stepper */}
        <div className="subscriber-register-stepper-wrapper">
          {steps.map((step, index) => {
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;
            const isLineActive = currentStep > step.id;

            return (
              <div key={step.id} className="subscriber-register-step">
                <div
                  className={`subscriber-register-step-circle ${
                    isActive ? "active" : ""
                  } ${isCurrent ? "current" : ""}`}
                >
                  {step.id}
                </div>
                <div
                  className={`subscriber-register-step-title ${
                    isActive ? "active" : ""
                  }`}
                >
                  {step.title}
                </div>
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

        {/* Step Form */}
        <form
          onSubmit={currentStep === 3 ? handleSubmit : handleNext}
          id="registration-form"
        >
          <div
            key={currentStep}
            className={`subscriber-register-step-content subscriber-register-slide-${slideDirection}`}
          >
            {renderStepContent()}
          </div>

          <div
            // className="d-flex justify-content-end"
            className={`d-flex justify-content-end ${
              window.innerWidth <= 480 ? "mt-2" : ""
            }`}
            style={{ gap: "10px" }}
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
                type="submit"
                className="subscriber-register-btn-primary"
                disabled={formSubmitted}
              >
                Next <Spinner formSubmitted={formSubmitted} />
              </button>
            )}
            {currentStep === steps.length && (
              <button type="submit" className="subscriber-register-btn-primary">
                Sign Up <Spinner formSubmitted={formSubmitted} />
              </button>
            )}
          </div>
        </form>
      </div>

      {currentStep === 3 ? (
        <span className="subscriber-register-terms">
          These Terms and Conditions (“Terms”) govern your access to and use of
          the Pinoy iMD system...
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
