import React, { useEffect, useRef, useState } from "react";
import { MDBBtn } from "mdbreact";
import Spinner from "../../../spinner";
import useSecondsLeft, { formatTime } from "./useSecondsLeft";

const OTP_LENGTH = 6;
const RESEND_DELAY = 60;

const OtpInput = ({
  email,
  isLoading,
  onVerify,
  onResend,
  onBack,
  title = "Enter Verification Code",
  backLabel = "Use a different email",
  hideHeader = false,
  buttonClass = "",
  // When the current code was sent (epoch ms); lets a remounted component keep
  // its timers. Defaults to now.
  sentAt: sentAtProp = 0,
  // Show a "code expires in" countdown (and the expired notice) when set.
  expiresInSeconds = 0,
  // Epoch ms before which the back link is locked (e.g. "Change email").
  backUntil = 0,
}) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [sentAt, setSentAt] = useState(sentAtProp || Date.now());
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (sentAtProp) setSentAt(sentAtProp);
  }, [sentAtProp]);

  const resendTimer = useSecondsLeft(sentAt + RESEND_DELAY * 1000);
  const expiryTimer = useSecondsLeft(
    expiresInSeconds ? sentAt + expiresInSeconds * 1000 : 0,
  );
  const backTimer = useSecondsLeft(backUntil);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const fill = (digits, start = 0) => {
    const updated = [...otp];
    digits.forEach((digit, i) => {
      if (start + i < OTP_LENGTH) updated[start + i] = digit;
    });
    setOtp(updated);
    setError("");
    inputsRef.current[Math.min(start + digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleChange = (value, index) => {
    const digits = value.replace(/\D/g, "").split("");
    if (!digits.length) {
      const updated = [...otp];
      updated[index] = "";
      return setOtp(updated);
    }
    fill(digits, index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");
    if (!digits.length) return;
    e.preventDefault();
    fill(digits, 0);
  };

  const showError = (message) => {
    setError(message);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < OTP_LENGTH) {
      return showError(`Enter the ${OTP_LENGTH}-digit code.`);
    }

    const message = await onVerify(code);
    if (message) {
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
      showError(message);
    }
  };

  const handleResend = async () => {
    const failure = await onResend();
    if (failure) return showError(failure);

    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    setSentAt(Date.now());
    inputsRef.current[0]?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="text-center">
      {!hideHeader && (
        <>
          <h5 style={{ fontWeight: 600 }}>{title}</h5>
          <div style={{ opacity: 0.6, fontSize: "0.9rem" }}>
            Code sent to: <strong>{email}</strong>
          </div>
        </>
      )}

      <div
        className={shake ? "forgot-shake" : ""}
        onPaste={handlePaste}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "15px",
        }}
      >
        {otp.map((val, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1}`}
            value={val}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            style={{
              width: "44px",
              height: "52px",
              fontSize: "1.5rem",
              textAlign: "center",
              borderRadius: "10px",
              border: error ? "2px solid #dc3545" : "1px solid #bbb",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              outline: "none",
            }}
          />
        ))}
      </div>

      {error && (
        <div style={{ color: "#dc3545", marginTop: "10px", fontWeight: 500 }}>
          {error}
        </div>
      )}

      {expiresInSeconds > 0 &&
        (expiryTimer > 0 ? (
          <div className="mt-2 text-muted" style={{ fontSize: "0.85rem" }}>
            This code expires in <strong>{formatTime(expiryTimer)}</strong>.
          </div>
        ) : (
          <div className="mt-2 text-danger" style={{ fontSize: "0.85rem" }}>
            This code has expired. Please resend a new code.
          </div>
        ))}

      <MDBBtn
        {...(buttonClass
          ? { block: true }
          : { rounded: true, color: "primary" })}
        type="submit"
        disabled={isLoading}
        className={buttonClass || "mt-4"}
      >
        Verify and Continue <Spinner formSubmitted={isLoading} />
      </MDBBtn>

      <div className="mt-2">
        {resendTimer > 0 ? (
          <span style={{ color: "#6c757d", fontWeight: 500 }}>
            Resend code in <strong>{formatTime(resendTimer)}</strong>
          </span>
        ) : (
          <span
            onClick={!isLoading ? handleResend : undefined}
            style={{
              color: isLoading ? "#6c757d" : "#0d6efd",
              cursor: isLoading ? "not-allowed" : "pointer",
              textDecoration: isLoading ? "none" : "underline",
              fontWeight: 500,
            }}
          >
            Resend Code
          </span>
        )}
      </div>

      {onBack && (
        <div className="mt-2">
          <span
            onClick={!isLoading && backTimer <= 0 ? onBack : undefined}
            style={{
              color: "#6c757d",
              cursor: backTimer > 0 ? "not-allowed" : "pointer",
              fontSize: "0.9rem",
            }}
          >
            {backTimer > 0 ? (
              <>
                {backLabel} in <strong>{formatTime(backTimer)}</strong>
              </>
            ) : (
              backLabel
            )}
          </span>
        </div>
      )}

      <style>{`
        .forgot-shake { animation: forgotShake 0.3s; }
        @keyframes forgotShake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </form>
  );
};

export default OtpInput;
