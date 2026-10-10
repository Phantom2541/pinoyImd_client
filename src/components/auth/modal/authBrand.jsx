import { MDBIcon } from "mdbreact";
import LOGO from "../../../assets/iMD.png";
import HERO from "../../../assets/homePatient.jpg";

export default function AuthBrandPanel() {
  return (
    <aside className="top-login-auth__brand">
      <img
        src={HERO}
        alt=""
        className="top-login-auth__image"
        aria-hidden="true"
      />
      <div className="top-login-auth__image-overlay" />
      <img src={LOGO} alt="Pinoy iMD" className="top-login-auth__logo" />
      <div className="top-login-auth__brand-copy">
        <h2>
          Your health records, <span>connected</span>.
        </h2>
        <p>
          Pinoy iMD brings patients, clinicians, laboratories and billing
          together in one diagnostic information system.
        </p>
      </div>
    </aside>
  );
}

export function AuthFeatureFooter() {
  return (
    <div className="top-login-auth__features">
      <div
        className="top-login-auth__feature"
        title="We protect your records with top-notch security."
      >
        <span className="top-login-auth__feature-icon top-login-auth__feature-icon--orange">
          <MDBIcon icon="shield-alt" />
        </span>
        <strong>Secure &amp; Safe</strong>
      </div>
      <div
        className="top-login-auth__feature"
        title="Designed for clinics, hospitals and laboratories."
      >
        <span className="top-login-auth__feature-icon top-login-auth__feature-icon--blue">
          <MDBIcon icon="clinic-medical" />
        </span>
        <strong>Built for Clinics</strong>
      </div>
      <div
        className="top-login-auth__feature"
        title="Everything you need in one integrated platform."
      >
        <span className="top-login-auth__feature-icon top-login-auth__feature-icon--green">
          <MDBIcon far icon="star" />
        </span>
        <strong>All in One</strong>
      </div>
    </div>
  );
}
