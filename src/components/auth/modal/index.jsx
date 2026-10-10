import { useEffect, useState } from "react";
import { MDBIcon, MDBModal, MDBModalBody } from "mdbreact";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  ForgetAccount,
  RESET,
} from "../../../services/redux/slices/assets/persons/auth";
import { clearSiteData } from "../../../services/utilities";
import "./style.css";
import AuthBrandPanel, { AuthFeatureFooter } from "./authBrand";
import LoginPanel from "./login";
import RememberedAccountPanel from "./rememberedAccount";
import SignupPanel from "./signup";

// One shell for sign-in, the remembered account, forgot password and sign-up.
// `allowSignup` shows the sign-up panel and its links; EMR / platform logins
// leave it off.
const TopLogin = ({
  show,
  toggle = null,
  isEMR = false,
  initialMode = "login",
  allowSignup = false,
}) => {
  const {
      activePlatform,
      auth,
      email,
      image,
      isLoading,
      isOnline,
      loginSuccess,
      message,
      sessionEnded,
    } = useSelector(({ auth }) => auth),
    [mode, setMode] = useState("login"),
    history = useHistory(),
    location = useLocation(),
    dispatch = useDispatch();
  const showRemembered = Boolean(email && mode === "login");
  const authMode = showRemembered ? "remembered" : mode;
  const canSignup = allowSignup;
  const notice = sessionEnded
    ? "Your session has ended. Please sign in again."
    : "";

  useEffect(() => {
    if (auth._id && loginSuccess) {
      if (activePlatform) {
        history.push(
          `/${activePlatform?.platform?.toLowerCase() || "patron"}/${
            ["manager", "headquarter"].includes(
              activePlatform?.platform?.toLowerCase(),
            )
              ? "dashboard"
              : "bulletin"
          }`,
        );
      } else {
        history.push(`/patron/bulletin`);
      }
      dispatch(RESET());
    }
  }, [auth, loginSuccess, history, location, dispatch, activePlatform]);

  useEffect(() => {
    if (show) setMode(canSignup ? initialMode : "login");
  }, [show, initialMode, canSignup]);

  // A failed sign-in's message shouldn't greet the next visit or follow the
  // person into another panel.
  useEffect(() => {
    if (show) dispatch(RESET());
  }, [show, mode, dispatch]);

  // Same full wipe of browser storage as the Log out button, with no page
  // reload, then the app forgets the account. A page keeps working as it was
  // (a company page keeps the company it loaded). Over a page of the app (a
  // session ended there) the page behind is the previous person's, so go back
  // to the start page as Log out does; on the start page the form just
  // switches to empty.
  const useAnotherAccount = async () => {
    // Which clinic's page this is isn't about the person, and pages read it.
    await clearSiteData({ keep: ["companyId", "patronCompany"] });
    dispatch(ForgetAccount());

    const onStartPage =
      location.pathname === "/" || location.pathname.startsWith("/subscribers");
    if (!onStartPage) history.push("/");
  };

  return (
    <MDBModal
      isOpen={show}
      backdrop={true}
      centered
      size="lg"
      className={`top-login-auth-modal top-login-auth-modal--${authMode}`}
      toggle={() => {}}
    >
      <MDBModalBody className="top-login-auth">
        {/* Closable whenever the page lets it be closed (it passes `toggle`).
            Over an app page after a session ends there is none: sign-in is
            required. The EMR has its own "Later" button. */}
        {toggle && !(showRemembered && isEMR) && (
          <button
            type="button"
            className="top-login-auth__close"
            onClick={toggle}
            aria-label="Close authentication"
          >
            <MDBIcon icon="times" />
          </button>
        )}

        <div className="top-login-auth__frame">
          <AuthBrandPanel />
          <div className="top-login-auth__forms">
            {showRemembered ? (
              <RememberedAccountPanel
                active={show}
                auth={auth}
                email={email}
                image={image}
                isEMR={isEMR}
                isLoading={isLoading}
                isOnline={isOnline}
                loginSuccess={loginSuccess}
                message={sessionEnded ? "" : message}
                notice={notice}
                onLater={toggle || (() => {})}
                onUseAnotherAccount={useAnotherAccount}
              />
            ) : (
              <>
                <LoginPanel
                  isLoading={isLoading}
                  isOnline={isOnline}
                  loginSuccess={loginSuccess}
                  message={sessionEnded ? "" : message}
                  notice={notice}
                  onShowSignup={canSignup ? () => setMode("signup") : null}
                />
                {canSignup && (
                  <SignupPanel onShowLogin={() => setMode("login")} />
                )}
              </>
            )}
          </div>
          <AuthFeatureFooter />
        </div>
      </MDBModalBody>
    </MDBModal>
  );
};

export default TopLogin;
