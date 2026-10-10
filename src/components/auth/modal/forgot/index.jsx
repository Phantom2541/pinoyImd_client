import { useState } from "react";
import axios from "axios";
import { MDBBtn, MDBIcon } from "mdbreact";
import Spinner from "../../../spinner";
import OTP from "./otp";
import ChangePassword from "./changePassword";

// Forgot-password steps inside the login panel: email -> emailed code ->
// new password. `onDone` returns to the sign-in form afterwards.
const ForgotPassword = ({ initialEmail = "", onDone = () => {} }) => {
  const [step, setStep] = useState(1),
    [email, setEmail] = useState(initialEmail || ""),
    [resetToken, setResetToken] = useState(""),
    [message, setMessage] = useState(""),
    [isLoading, setIsLoading] = useState(false);

  // Sends (or re-sends) the code. Resolves "" on success, or the reason the
  // server gave (unregistered email, too many requests, mail down...).
  const sendCode = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await axios.post("assets/persons/auth/forgot-password/request", {
        email: email.trim(),
      });
      return "";
    } catch ({ response, message }) {
      return response?.data?.message || message;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    const failure = await sendCode();

    if (failure) return setMessage(failure);
    setStep(2);
  };

  // Resolves "" on success, or the message to show under the code boxes.
  const verifyCode = async (code) => {
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "assets/persons/auth/forgot-password/verify",
        { email: email.trim(), code },
      );

      setResetToken(data?.payload?.resetToken || "");
      setStep(3);
      return "";
    } catch ({ response, message }) {
      return response?.data?.message || message;
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <OTP
        email={email.trim()}
        isLoading={isLoading}
        onVerify={verifyCode}
        onResend={sendCode}
        onBack={() => setStep(1)}
      />
    );
  }

  if (step === 3) {
    return (
      <ChangePassword
        email={email.trim()}
        resetToken={resetToken}
        onDone={onDone}
      />
    );
  }

  return (
    <form onSubmit={handleSendCode} className="top-login-auth__form">
      <label className="top-login-auth__label">Email</label>
      <div className="top-login-auth__field">
        <MDBIcon far icon="envelope" />
        <input
          type="email"
          name="address"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          placeholder="you@example.com"
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
        Send Code <Spinner formSubmitted={isLoading} />
      </MDBBtn>
    </form>
  );
};

export default ForgotPassword;
