import { useState } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch } from "react-redux";
import { LOGIN } from "../../../services/redux/slices/assets/persons/auth";
import { Cloudinary, PresetImage } from "../../../services/utilities";
import ForgotPassword from "./forgot";

// The account remembered on this device (saved at the last sign-in). Used for
// the photo while nobody is signed in, when the app state has no user yet.
const readSavedAccount = () => {
  const read = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch (error) {
      return {};
    }
  };

  // The small record kept at Log out, else the full one from the last sign-in.
  const remembered = read("rememberedAccount");
  return remembered.email ? remembered : read("auth");
};

export default function RememberedAccountPanel({
  active = false,
  auth = {},
  email = "",
  image = "",
  isEMR = false,
  isLoading = false,
  isOnline = true,
  loginSuccess = false,
  message = "",
  notice = "",
  onLater = () => {},
  onUseAnotherAccount = () => {},
}) {
  const dispatch = useDispatch();
  const [isLocked, setIsLocked] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Their profile photo if they have one, otherwise the default avatar for
  // their sex -- never the app logo.
  const saved = auth?._id ? auth : readSavedAccount();
  const profilePhoto =
    image ||
    (saved?.pid && saved?.email
      ? `${Cloudinary.getEndpoint()}/${saved.pid}/users/${saved.email}/profile.png`
      : "");
  const defaultAvatar = PresetImage(saved?.isMale);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      LOGIN({
        email: String(email).trim(),
        password: e.target.password.value,
      }),
    );
  };

  return (
    <section className="top-login-auth__panel top-login-auth__panel--remembered">
      <div
        className={`top-login-auth__panel-inner top-login-auth__remembered${
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
              initialEmail={email}
              onDone={() => setIsForgotPassword(false)}
            />
          </>
        ) : (
          <>
            <div className="top-login-auth__title top-login-auth__title--form">
              Welcome back
            </div>
            <p className="top-login-auth__subtitle">
              Enter your password to continue as the saved account.
            </p>

            <div className="top-login-auth__account">
              <img
                src={profilePhoto || defaultAvatar}
                onError={(e) => {
                  // Only swap once, so a broken fallback can't loop.
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
                alt={`avatar-${auth?._id || "saved"}`}
                className="top-login-auth__account-avatar"
              />
              <div>
                <strong>{email}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="top-login-auth__form">
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
                      autoFocus={active}
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
                {isLoading ? (
                  <MDBIcon icon="spinner" spin />
                ) : isEMR ? (
                  "Sign in"
                ) : (
                  "Proceed"
                )}
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
            <button
              type="button"
              className="top-login-auth__plain"
              disabled={isLoading}
              onClick={isEMR ? onLater : onUseAnotherAccount}
            >
              {isEMR ? "Later" : "Use another account"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
