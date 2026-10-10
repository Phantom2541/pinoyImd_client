import { useMemo, useState } from "react";
import axios from "axios";
import { DatePicker, MDBBtn, MDBIcon } from "mdbreact";
import Swal from "sweetalert2";
import { Suffixes } from "../../../services/fakeDb";
import Spinner from "../../spinner";
import OTP from "./forgot/otp";
import Password from "./forgot/changePassword/password";
import { getPasswordError } from "./forgot/passwordRule";
import showTerms from "./terms";
import useSecondsLeft, { formatTime } from "./forgot/useSecondsLeft";

// Same range as the full registration form: nothing in the future and
// nothing older than MAX_AGE_YEARS. (SLC also enforces a minimum age because
// it enrolls students; patients here can be any age.)
const MAX_AGE_YEARS = 120;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 2;
// Matches the server: a code lasts 5 minutes.
const CODE_EXPIRY_SECONDS = 5 * 60;
// After changing the email, wait this long before changing it again, so the
// form can't be used to send codes to a string of addresses.
const CHANGE_EMAIL_DELAY_MS = 60 * 1000;

const toDateInputValue = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;

const getDobBounds = () => {
  const today = new Date();
  const oldest = new Date(today);
  oldest.setFullYear(today.getFullYear() - MAX_AGE_YEARS);
  return {
    minDate: toDateInputValue(oldest),
    maxDate: toDateInputValue(today),
  };
};

// What the server said went wrong, else the network error.
const reasonOf = ({ response, message }) =>
  response?.data?.message || response?.data?.error || message;

const initialForm = {
  lname: "",
  fname: "",
  mname: "",
  suffix: "",
  dob: null,
  isMale: null,
  mobile: "",
  email: "",
  password: "",
  confirmPassword: "",
  agree: false,
};

// Sign-up in the auth shell, two screens:
//  1. who you are (name, suffix, birthday, sex, mobile)
//  2. email -> emailed code -> password, each part appearing once the one
//     before it is done. The account is only created with the token the
//     correct code earned (the server checks it).
export default function SignupPanel({ onShowLogin = () => {} }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  // The code last sent: { email, at (epoch ms) }, or null before/after a change.
  const [sent, setSent] = useState(null);
  // The address a correct code proved.
  const [verification, setVerification] = useState({ email: "", token: "" });
  // Epoch ms before which "Change email" is locked.
  const [changeUntil, setChangeUntil] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { minDate, maxDate } = useMemo(getDobBounds, []);
  const changeTimer = useSecondsLeft(changeUntil);

  const update = (key, value) => {
    setMessage("");
    setForm((current) => ({ ...current, [key]: value }));
  };

  const goTo = (next) => {
    setMessage("");
    setStep(next);
  };

  const email = form.email.trim().toLowerCase();
  const fullName = {
    fname: form.fname.trim(),
    mname: form.mname.trim(),
    lname: form.lname.trim(),
    suffix: form.suffix,
  };
  const isVerified = Boolean(
    verification.token && verification.email === email,
  );
  const stage = isVerified ? "verified" : sent ? "code" : "email";

  const handleDetails = async (e) => {
    e.preventDefault();

    if (!fullName.lname || !fullName.fname) {
      return setMessage("Please enter your last name and first name.");
    }
    if (!(form.dob instanceof Date) || isNaN(form.dob)) {
      return setMessage("Please select your date of birth.");
    }
    if (form.isMale === null) return setMessage("Please select your sex.");
    if (!form.mobile.trim()) {
      return setMessage("Please enter your mobile number.");
    }

    setIsLoading(true);
    setMessage("");

    try {
      await axios.post("assets/persons/users/duplicate_checker", {
        fullName,
        dob: toDateInputValue(form.dob),
        isMale: form.isMale,
        mobile: form.mobile,
      });
      goTo(2);
    } catch (error) {
      setMessage(reasonOf(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Sends (or re-sends) the code. Resolves "" on success, or the reason.
  const sendCode = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await axios.post("assets/persons/auth/register-email/request", {
        email,
        fullName,
      });
      setSent({ email, at: Date.now() });
      return "";
    } catch (error) {
      // A code went out moments ago: it's still valid, so carry on to it.
      if (error.response?.status === 429) {
        setSent({ email, at: Date.now() });
        return "";
      }
      return reasonOf(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      return setMessage("Please enter a valid email address.");
    }

    const failure = await sendCode();
    if (failure) setMessage(failure);
  };

  // Resolves "" on success, or the message to show under the code boxes.
  const verifyCode = async (code) => {
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "assets/persons/auth/register-email/verify",
        { email, code },
      );

      setVerification({ email, token: data?.payload?.verificationToken });
      setMessage("");
      return "";
    } catch (error) {
      return reasonOf(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Back to editing the email. The old code no longer counts, so the next
  // address needs its own; the lock keeps this from being spammed.
  const changeEmail = () => {
    if (changeTimer > 0) return;

    setSent(null);
    setVerification({ email: "", token: "" });
    setForm((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
      agree: false,
    }));
    setChangeUntil(Date.now() + CHANGE_EMAIL_DELAY_MS);
    setMessage("");
  };

  const passwordError = getPasswordError(form.password);
  const passwordsMatch = form.password === form.confirmPassword;
  const canRegister =
    isVerified &&
    Boolean(form.password && form.confirmPassword) &&
    !passwordError &&
    passwordsMatch &&
    form.agree &&
    !isLoading;

  // The box only becomes ticked once every item in the checklist was.
  const openTerms = async () => {
    if (await showTerms()) update("agree", true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!canRegister) return;

    setIsLoading(true);
    setMessage("");

    try {
      await axios.post("assets/persons/users/register", {
        email,
        password: form.password,
        dob: toDateInputValue(form.dob),
        mobile: form.mobile.trim(),
        isMale: form.isMale,
        fullName,
        verificationToken: verification.token,
      });

      Swal.fire({
        icon: "success",
        title: "Successfully Registered!",
        text: "You can now sign in with your email and password.",
      });
      setForm(initialForm);
      setSent(null);
      setVerification({ email: "", token: "" });
      setStep(1);
      onShowLogin();
    } catch (error) {
      setMessage(reasonOf(error));
    } finally {
      setIsLoading(false);
    }
  };

  const subtitles = {
    1: "Tell us who you are.",
    email: "Enter your email and we'll send you a code.",
    code: "Enter the code we emailed you.",
    verified: "Email verified. Choose a password.",
  };

  const changeLabel =
    changeTimer > 0 ? (
      <>
        Change email in <strong>{formatTime(changeTimer)}</strong>
      </>
    ) : (
      "Change email"
    );

  return (
    <section className="top-login-auth__panel top-login-auth__panel--signup">
      <div
        className={`top-login-auth__panel-inner${
          step > 1 ? " top-login-auth__panel-inner--has-back" : ""
        }`}
      >
        {step > 1 && (
          <button
            type="button"
            className="top-login-auth__back"
            disabled={isLoading}
            onClick={() => goTo(1)}
          >
            <MDBIcon icon="arrow-left" /> Back
          </button>
        )}
        <div className="top-login-auth__title top-login-auth__title--form">
          Create your account
        </div>
        <p className="top-login-auth__subtitle">
          {step === 1 ? subtitles[1] : subtitles[stage]}
        </p>
        <div className="top-login-auth__steps" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span key={i} className={i + 1 <= step ? "is-active" : ""} />
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleDetails} className="top-login-auth__form">
            <label className="top-login-auth__label">Full Name</label>
            <div className="top-login-auth__names">
              {[
                { key: "lname", placeholder: "Last name", required: true },
                { key: "fname", placeholder: "First name", required: true },
                { key: "mname", placeholder: "Middle name" },
              ].map(({ key, placeholder, required }) => (
                <div className="top-login-auth__field" key={key}>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={({ target }) =>
                      update(key, target.value.toUpperCase())
                    }
                    placeholder={placeholder}
                    aria-label={placeholder}
                    autoComplete="off"
                    required={required}
                  />
                </div>
              ))}
            </div>
            <label className="top-login-auth__label">Suffix</label>
            <div className="top-login-auth__field">
              <MDBIcon far icon="id-badge" />
              <select
                value={form.suffix}
                onChange={({ target }) => update("suffix", target.value)}
              >
                <option value="">None</option>
                {Suffixes.filter((suffix) => suffix !== "None").map(
                  (suffix) => (
                    <option key={suffix} value={suffix}>
                      {suffix}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="top-login-auth__row">
              <div className="top-login-auth__row-main">
                <label className="top-login-auth__label">Birthday</label>
                <div className="top-login-auth__field top-login-auth__field--date">
                  <DatePicker
                    disableFuture
                    emptyLabel="DD/MM/YYYY"
                    format="DD/MM/YYYY"
                    keyboard={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    openToYearSelection
                    minDateMessage="Use a more recent date of birth."
                    maxDateMessage="Date of birth cannot be in the future."
                    invalidDateMessage="Use DD/MM/YYYY."
                    InputProps={{
                      inputProps: {
                        readOnly: true,
                        inputMode: "none",
                        "aria-label": "Birthday",
                      },
                    }}
                    placeholder="DD/MM/YYYY"
                    value={form.dob}
                    valueDefault={null}
                    getValue={(date) => update("dob", date)}
                    className="top-login-auth__date-picker-input"
                  />
                </div>
              </div>
              <div className="top-login-auth__row-sex">
                <label className="top-login-auth__label">Sex</label>
                <div className="top-login-auth__checks">
                  {[
                    { label: "Male", value: true },
                    { label: "Female", value: false },
                  ].map(({ label, value }) => (
                    <label key={label} className="top-login-auth__agree">
                      <input
                        type="checkbox"
                        checked={form.isMale === value}
                        onChange={({ target }) =>
                          update("isMale", target.checked ? value : null)
                        }
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <label className="top-login-auth__label">Mobile Number</label>
            <div className="top-login-auth__field">
              <MDBIcon icon="phone" />
              <input
                type="tel"
                inputMode="tel"
                value={form.mobile}
                onChange={({ target }) => update("mobile", target.value)}
                placeholder="09XX XXX XXXX"
                required
              />
            </div>
            {message && (
              <div className="alert alert-warning text-center">{message}</div>
            )}
            <MDBBtn
              block
              type="submit"
              disabled={isLoading}
              className="top-login-auth__cta"
            >
              Next <Spinner formSubmitted={isLoading} />
            </MDBBtn>
          </form>
        )}

        {step === 2 && (
          <>
            <form onSubmit={handleSendCode} className="top-login-auth__form">
              <label className="top-login-auth__label">Email</label>
              <div className="top-login-auth__field">
                <MDBIcon far icon="envelope" />
                <input
                  type="email"
                  value={form.email}
                  onChange={({ target }) => update("email", target.value)}
                  placeholder="you@example.com"
                  disabled={stage !== "email"}
                  required
                />
                {isVerified && (
                  <MDBIcon
                    icon="check-circle"
                    className="top-login-auth__verified"
                    title="Verified"
                  />
                )}
              </div>
              {stage === "email" && (
                <>
                  {message && (
                    <div className="alert alert-warning text-center">
                      {message}
                    </div>
                  )}
                  <MDBBtn
                    block
                    type="submit"
                    disabled={isLoading}
                    className="top-login-auth__cta"
                  >
                    Send Code <Spinner formSubmitted={isLoading} />
                  </MDBBtn>
                </>
              )}
            </form>

            {stage === "code" && (
              <OTP
                email={email}
                hideHeader
                buttonClass="top-login-auth__cta"
                isLoading={isLoading}
                sentAt={sent.at}
                expiresInSeconds={CODE_EXPIRY_SECONDS}
                backLabel="Change email"
                backUntil={changeUntil}
                onVerify={verifyCode}
                onResend={sendCode}
                onBack={changeEmail}
              />
            )}

            {stage === "verified" && (
              <>
                <div className="text-center mb-2">
                  <span
                    onClick={changeTimer > 0 ? undefined : changeEmail}
                    style={{
                      color: "#6c757d",
                      cursor: changeTimer > 0 ? "not-allowed" : "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    {changeLabel}
                  </span>
                </div>
                <form
                  onSubmit={handleRegister}
                  className="top-login-auth__form"
                >
                  <Password
                    label="Password"
                    password={form.password}
                    setPassword={(value) => update("password", value)}
                  />
                  {form.password && passwordError && (
                    <small className="d-block text-danger mb-2">
                      {passwordError}.
                    </small>
                  )}
                  <Password
                    label="Confirm Password"
                    password={form.confirmPassword}
                    setPassword={(value) => update("confirmPassword", value)}
                  />
                  {form.confirmPassword && !passwordsMatch && (
                    <small className="d-block text-danger mb-2">
                      Passwords do not match.
                    </small>
                  )}
                  <label className="top-login-auth__agree">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={({ target }) =>
                        target.checked ? openTerms() : update("agree", false)
                      }
                    />
                    <span>
                      I agree with the <u>Terms and Conditions</u>
                    </span>
                    <button
                      type="button"
                      className="top-login-auth__terms-icon"
                      title="Read the Terms and Conditions"
                      aria-label="Read the Terms and Conditions"
                      onClick={(e) => {
                        e.preventDefault();
                        openTerms();
                      }}
                    >
                      <MDBIcon far icon="file-alt" />
                    </button>
                  </label>
                  {message && (
                    <div className="alert alert-warning text-center">
                      {message}
                    </div>
                  )}
                  <MDBBtn
                    block
                    type="submit"
                    disabled={!canRegister}
                    className="top-login-auth__cta"
                  >
                    Sign up <Spinner formSubmitted={isLoading} />
                  </MDBBtn>
                </form>
              </>
            )}
          </>
        )}

        <p className="top-login-auth__switch">
          Already have an account?{" "}
          <button type="button" onClick={onShowLogin}>
            Sign in
          </button>
        </p>
      </div>
    </section>
  );
}
