import { useSelector } from "react-redux";
import LOGO from "../../assets/iMD.png";
import "./signOutOverlay.css";

// A short full-screen "Signing you out..." after Log out, so it is clear the
// sign-out happened (the page behind changes in a blink). It lives at the top
// of the app, not in the page that was left, and is switched on by the Log out
// action and off again by a timer there.
export default function SignOutOverlay() {
  const signingOut = useSelector(({ auth }) => auth.signingOut);

  if (!signingOut) return null;

  return (
    <div className="sign-out-overlay" role="status" aria-live="polite">
      <img src={LOGO} alt="" className="sign-out-overlay__logo" />
      <p className="sign-out-overlay__text">Signing you out&hellip;</p>
    </div>
  );
}
