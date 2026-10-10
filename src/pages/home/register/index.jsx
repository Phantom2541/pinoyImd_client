import { useState, useEffect, useMemo, useRef } from "react";
import {
  DatePicker,
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
  DUPLICATE_CHECKER,
  REGISTER,
} from "../../../services/redux/slices/assets/persons/users";
import { Suffixes } from "../../../services/fakeDb";
import REGISTRATIONIMG from "./../../../assets/homePageRegistrationImg.png";
import "./style.css";
import Swal from "sweetalert2";
import Spinner from "../../../components/spinner";
import EmailVerification from "../../../components/auth/modal/emailVerification";
import { getPasswordError } from "../../../components/auth/modal/forgot/passwordRule";

// Date of birth rule for the calendar: no future dates and nothing older than
// MAX_AGE_YEARS. (SLC also enforces a minimum age because it enrolls
// students; patients here can be any age, infants included.)
const MAX_AGE_YEARS = 120;

const toDateInputValue = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;

// "YYYY-MM-DD" -> local-midnight Date (new Date("YYYY-MM-DD") is UTC and can
// show the previous day in the calendar).
const parseDateInputValue = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Whole years since `date`, or null for a date that can't be a birthday
// (future, or older than MAX_AGE_YEARS) -- the same range the calendar offers.
const getAge = (date) => {
  if (!date) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const hadBirthday =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!hadBirthday) age -= 1;
  return age >= 0 && age <= MAX_AGE_YEARS ? age : null;
};

// Patients can be newborns, so under a year the age reads in months or days
// ("3 months old", "5 days old", "born today") instead of "0 yrs old".
const describeAge = (date) => {
  const years = getAge(date);
  if (years === null) return null;
  if (years >= 1) return `${years} yr${years === 1 ? "" : "s"} old`;

  const today = new Date();
  let months =
    (today.getFullYear() - date.getFullYear()) * 12 +
    (today.getMonth() - date.getMonth());
  if (today.getDate() < date.getDate()) months -= 1;
  if (months >= 1) return `${months} month${months === 1 ? "" : "s"} old`;

  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const days = Math.round((startOfDay(today) - startOfDay(date)) / 86400000);
  if (days < 1) return "Born today";
  return `${days} day${days === 1 ? "" : "s"} old`;
};

const getDobBounds = () => {
  const today = new Date();
  const oldest = new Date(today);
  oldest.setFullYear(today.getFullYear() - MAX_AGE_YEARS);
  return {
    minDate: toDateInputValue(oldest),
    maxDate: toDateInputValue(today),
  };
};

// Click-to-show eye icon inside the input, same as the login and forgot
// password screens. The wrapper carries the spacing so the icon centers on
// the input itself.
const PasswordField = ({ label, name, value, onChange, isLocked, toggle }) => (
  <div className="position-relative my-4">
    <MDBInput
      containerClass="my-0"
      size={window.innerWidth <= 480 ? "sm" : "md"}
      label={label}
      name={name}
      type={isLocked ? "password" : "text"}
      icon="lock"
      value={value}
      minLength={8}
      required
      onChange={onChange}
    />
    <MDBIcon
      far
      icon={isLocked ? "eye-slash" : "eye"}
      onClick={toggle}
      className="position-absolute"
      style={{
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#6c757d",
      }}
    />
  </div>
);

// `onRegistered` runs after the success message, e.g. to open the login modal.
const Register = ({ onRegistered = null }) => {
  const dispatch = useDispatch();
  const { isSuccess, formSubmitted } = useSelector(({ users }) => users);

  // null until chosen: an unset sex must not silently save as female.
  const [isMale, setIsMale] = useState(null);
  const [isLocked, setIsLocked] = useState({
    password: true,
    confirmPassword: true,
  });
  const [currentStep, setCurrentStep] = useState(1);
  // A ref, so a parent passing a fresh function each render can't re-run the
  // success effect below (and show the message again).
  const onRegisteredRef = useRef(onRegistered);
  onRegisteredRef.current = onRegistered;
  const [slideDirection, setSlideDirection] = useState("left");
  // Set once the emailed code is entered; `verifiedEmail` is the address it
  // proves, so changing the email afterwards asks for a new code.
  const [verification, setVerification] = useState({ email: "", token: "" });

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
    { id: 3, title: "Verify Email" },
    { id: 4, title: "Confirmation" },
  ];

  // 🔁 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dobBounds = useMemo(getDobBounds, []);
  // Same Date object until the stored string changes: the picker re-syncs
  // whenever its `value` prop changes identity, which would loop otherwise.
  const dobValue = useMemo(
    () => parseDateInputValue(formData.dob),
    [formData.dob],
  );

  const dobAge = describeAge(dobValue);

  const handleDob = (date) => {
    const next =
      date instanceof Date && !isNaN(date) ? toDateInputValue(date) : "";
    setFormData((prev) => (prev.dob === next ? prev : { ...prev, dob: next }));
  };

  const handleSuffix = (val) => {
    // "None" means no suffix; storing the word would show as "none" later.
    setFormData((prev) => ({
      ...prev,
      suffix: val[0] === "None" ? "" : val[0],
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const { dob } = formData;
    const email = formData.email.trim().toLowerCase();
    const mobile = formData.mobile.trim();

    if (!dob) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select your date of birth.",
      });
      return;
    }

    if (isMale === null) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select your sex.",
      });
      return;
    }

    const fullName = {
      fname: formData.fname,
      mname: formData.mname,
      lname: formData.lname,
      suffix: formData.suffix,
    };

    dispatch(
      DUPLICATE_CHECKER({ data: { fullName, email, mobile, dob, isMale } }),
    ).then((action) => {
      if (action.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: action?.error?.message,
        });
      } else {
        setSlideDirection("left");
        // Already verified this exact email (went back and forth): skip ahead.
        const isVerified =
          currentStep === 2 &&
          verification.token &&
          verification.email === email.trim().toLowerCase();
        setCurrentStep(isVerified ? 4 : currentStep + 1);
      }
    });
  };

  const handleBack = () => {
    setSlideDirection("right");
    // Step 4 follows a finished verification, so back goes to the email, not
    // to a second code request.
    setCurrentStep((prev) => (prev === 4 ? 2 : Math.max(prev - 1, 1)));
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
      dob,
    } = formData;
    const email = formData.email.trim().toLowerCase();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password and Confirm passsword does not match.",
      });
      return;
    }
    const passwordError = getPasswordError(password);

    if (passwordError) {
      Swal.fire({ icon: "error", title: "Oops...", text: `${passwordError}.` });
      return;
    }

    const fullName = { fname, mname, lname, suffix };

    dispatch(
      REGISTER({
        data: {
          email,
          password,
          dob,
          mobile: mobile.trim(),
          isMale,
          fullName,
          verificationToken: verification.token,
        },
      }),
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
      }).then(() => onRegisteredRef.current?.());
      setFormData({
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

      setVerification({ email: "", token: "" });
      setIsMale(null);
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
                <div id="registration-dob-field">
                  <label className="mb-0 small text-muted">Date of Birth</label>
                  <div
                    className="d-flex align-items-center"
                    style={{ minHeight: "38px" }}
                  >
                    <DatePicker
                      value={dobValue}
                      // The component defaults `valueDefault` to today, which
                      // would show and submit today's date untouched.
                      valueDefault={null}
                      getValue={handleDob}
                      minDate={dobBounds.minDate}
                      maxDate={dobBounds.maxDate}
                      openToYearSelection
                      emptyLabel="Select date of birth"
                      minDateMessage="Please pick a more recent date."
                      maxDateMessage="Date of birth cannot be in the future."
                    />
                    {dobValue && (
                      <MDBIcon
                        title={dobAge === null ? "Invalid date" : dobAge}
                        icon={dobAge === null ? "times" : "check"}
                        className={`ml-2 text-${
                          dobAge === null ? "danger" : "success"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </MDBCol>
              <MDBCol md="6">
                <div>
                  <label className="mb-0 small text-muted">Sex</label>
                  <div
                    className="d-flex align-items-center"
                    style={{ minHeight: "38px" }}
                  >
                    <MDBInput
                      label="Male"
                      type="checkbox"
                      id="male"
                      name="gender"
                      containerClass="mb-0 mr-4"
                      checked={isMale === true}
                      onChange={() => setIsMale(isMale === true ? null : true)}
                    />
                    <MDBInput
                      label="Female"
                      type="checkbox"
                      id="female"
                      name="gender"
                      containerClass="mb-0"
                      checked={isMale === false}
                      onChange={() =>
                        setIsMale(isMale === false ? null : false)
                      }
                    />
                  </div>
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
      case 4:
        return (
          <>
            <MDBRow>
              <MDBCol md="6">
                <PasswordField
                  label="Password"
                  name="password"
                  value={f.password}
                  onChange={handleChange}
                  isLocked={isLocked.password}
                  toggle={() =>
                    setIsLocked((prev) => ({
                      ...prev,
                      password: !prev.password,
                    }))
                  }
                />
              </MDBCol>
              <MDBCol md="6">
                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={f.confirmPassword}
                  onChange={handleChange}
                  isLocked={isLocked.confirmPassword}
                  toggle={() =>
                    setIsLocked((prev) => ({
                      ...prev,
                      confirmPassword: !prev.confirmPassword,
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

        {/* Email verification has its own form (code boxes) */}
        {currentStep === 3 && (
          <div
            key="verify-email"
            className={`subscriber-register-step-content subscriber-register-slide-${slideDirection}`}
          >
            <EmailVerification
              email={formData.email.trim().toLowerCase()}
              fullName={{
                fname: formData.fname,
                mname: formData.mname,
                lname: formData.lname,
                suffix: formData.suffix,
              }}
              onBack={handleBack}
              onVerified={(token) => {
                setVerification({
                  email: formData.email.trim().toLowerCase(),
                  token,
                });
                setSlideDirection("left");
                setCurrentStep(4);
              }}
            />
          </div>
        )}

        {/* Step Form */}
        {currentStep !== 3 && (
          <form
            onSubmit={currentStep === 4 ? handleSubmit : handleNext}
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
                window.innerWidth <= 480 ? "mt-2" : "mt-3"
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
                <button
                  type="submit"
                  className="subscriber-register-btn-primary"
                >
                  Sign Up <Spinner formSubmitted={formSubmitted} />
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {currentStep === 4 ? (
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
