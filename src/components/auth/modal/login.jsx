import { useState } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch } from "react-redux";
import { LOGIN } from "../../../services/redux/slices/assets/persons/auth";
import ForgotPassword from "./forgot";

export default function LoginPanel({
  isLoading = false,
  isOnline = true,
  loginSuccess = false,
  message = "",
  notice = "",
  onShowSignup = null,
}) {
  const dispatch = useDispatch();
  const [isLocked, setIsLocked] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      LOGIN({
        email: loginEmail.trim(),
        password: e.target.password.value,
      }),
    );
  };

  return (
    <section className="top-login-auth__panel top-login-auth__panel--login">
      <div
        className={`top-login-auth__panel-inner${
          isForgotPassword ? " top-login-auth__panel-inner--has-back" : ""
        }`}
      >
        {isForgotPassword ? (
          <>
            <button
              type="button"
              className="top-login-auth__back"
              onClick={() => setIsForgotPassword(false)}
            >
              <MDBIcon icon="arrow-left" /> Back
            </button>
            <div className="top-login-auth__title">Reset password</div>
            <ForgotPassword
              initialEmail={loginEmail}
              onDone={() => setIsForgotPassword(false)}
            />
          </>
        ) : (
          <>
            <div className="top-login-auth__title top-login-auth__title--form">
              Welcome back
            </div>
            <p className="top-login-auth__subtitle">
              Sign in to continue to your Pinoy iMD workspace.
            </p>
            <form onSubmit={handleSubmit} className="top-login-auth__form">
              <label className="top-login-auth__label">Email</label>
              <div className="top-login-auth__field">
                <MDBIcon far icon="envelope" />
                <input
                  type="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  name="address"
                  value={loginEmail}
                  onChange={({ target }) => setLoginEmail(target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  required
                />
              </div>
              {isOnline ? (
                <>
                  <label className="top-login-auth__label">Password</label>
                  <div className="top-login-auth__field">
                    <MDBIcon icon="lock" />
                    <input
                      name="password"
                      minLength={8}
                      type={isLocked ? "password" : "text"}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsLocked((current) => !current)}
                    >
                      <MDBIcon icon={isLocked ? "eye-slash" : "eye"} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="alert alert-warning text-center">
                  You have no Internet Connection.
                </div>
              )}
              {notice && (
                <div className="alert alert-info text-center">{notice}</div>
              )}
              {message && (
                <div
                  className={`alert alert-${
                    loginSuccess ? "success" : "warning"
                  } text-center`}
                >
                  {message}
                </div>
              )}
              <MDBBtn
                disabled={!isOnline || isLoading}
                block
                type="submit"
                className="top-login-auth__cta"
              >
                {isLoading ? <MDBIcon icon="spinner" spin /> : "Sign in"}
              </MDBBtn>
            </form>
            <button
              type="button"
              className="top-login-auth__plain"
              disabled={!isOnline || isLoading}
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot password?
            </button>
            {onShowSignup && (
              <p className="top-login-auth__switch">
                New to Pinoy iMD?{" "}
                <button type="button" onClick={onShowSignup}>
                  Sign up
                </button>
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
