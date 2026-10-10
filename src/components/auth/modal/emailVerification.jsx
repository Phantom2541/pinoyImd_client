import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MDBBtn } from "mdbreact";
import OtpInput from "./forgot/otp";
import Spinner from "../../spinner";

// Signup step: emails a 6-digit code to the address the person entered and
// hands back a one-time token once they type it correctly. `register` on the
// server refuses to create the account without that token.
const EmailVerification = ({ email, fullName, onVerified, onBack }) => {
  const [status, setStatus] = useState("sending"), // sending | sent | failed
    [message, setMessage] = useState(""),
    [isVerifying, setIsVerifying] = useState(false),
    hasRequested = useRef(false);

  // Resolves "" when the code went out, or the reason it didn't.
  const sendCode = async () => {
    try {
      await axios.post("assets/persons/auth/register-email/request", {
        email,
        fullName,
      });
      return "";
    } catch ({ response, message }) {
      // A code was sent moments ago (went back and forth between steps):
      // it's still valid, so carry on to entering it.
      if (response?.status === 429) return "";
      return response?.data?.message || message;
    }
  };

  const requestCode = async () => {
    setStatus("sending");
    setMessage("");
    const failure = await sendCode();

    if (failure) {
      setMessage(failure);
      return setStatus("failed");
    }
    setStatus("sent");
  };

  useEffect(() => {
    // StrictMode mounts effects twice in development; one email is enough.
    if (hasRequested.current) return;
    hasRequested.current = true;
    requestCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resolves "" on success, or the message to show under the code boxes.
  const verifyCode = async (code) => {
    setIsVerifying(true);

    try {
      const { data } = await axios.post(
        "assets/persons/auth/register-email/verify",
        { email, code },
      );
      onVerified(data?.payload?.verificationToken || "");
      return "";
    } catch ({ response, message }) {
      return response?.data?.message || message;
    } finally {
      setIsVerifying(false);
    }
  };

  if (status === "sent") {
    return (
      <OtpInput
        email={email}
        title="Verify Your Email"
        backLabel="Use a different email"
        isLoading={isVerifying}
        onVerify={verifyCode}
        onResend={sendCode}
        onBack={onBack}
      />
    );
  }

  return (
    <div className="text-center py-4">
      {status === "sending" ? (
        <>
          <Spinner formSubmitted />
          <p className="mt-2 mb-0 text-muted">
            Sending a verification code to <strong>{email}</strong>...
          </p>
        </>
      ) : (
        <>
          <div className="alert alert-warning">{message}</div>
          <MDBBtn rounded color="info" onClick={requestCode}>
            Try Again
          </MDBBtn>
          <div className="mt-2">
            <span
              onClick={onBack}
              style={{
                color: "#6c757d",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Use a different email
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailVerification;
