// How a walk-in patient signs in, shown to the cashier right after the patient
// is registered. Sign-in is by email. The first password is their birthday
// without dashes (the form sets it) and nothing makes them change it, so the
// message says so.
import { renderToStaticMarkup } from "react-dom/server";
import Swal from "sweetalert2";

const NOTE = { marginTop: 6, fontSize: "0.82rem", lineHeight: 1.35 };

export const LoginDetails = ({
  email,
  dob,
  emailWasGenerated,
  showTitle = true,
}) => {
  const password = String(dob || "").replaceAll("-", "");

  return (
    <div style={{ textAlign: "left" }}>
      {showTitle && <strong>Patient registered</strong>}
      <div style={{ marginTop: 4 }}>They sign in with this email:</div>
      <div style={{ marginTop: 4, wordBreak: "break-all" }}>
        <div>
          Email: <strong>{email}</strong>
        </div>
        <div>
          Password: <strong>{password}</strong> (birthday, YYYYMMDD)
        </div>
      </div>
      <div style={NOTE}>
        Ask them to change the password after their first sign-in. Until then,
        anyone who knows their birthday could sign in.
      </div>
      {emailWasGenerated && (
        <div style={NOTE}>
          That email was made up (none was entered) and is not a real inbox, so
          Forgot password can't reach it. Add their real email while the account
          is unclaimed.
        </div>
      )}
    </div>
  );
};

// Opens the details as an alert. "Show as toast" closes it and hands the same
// content to `showToast` instead, for a cashier who wants it kept on screen
// while they carry on working.
const showLoginDetails = async (details, showToast) => {
  const { isDenied } = await Swal.fire({
    icon: "success",
    title: "Patient registered",
    html: renderToStaticMarkup(<LoginDetails {...details} showTitle={false} />),
    width: 480,
    showDenyButton: true,
    confirmButtonText: "Done",
    denyButtonText: "Show as toast",
    confirmButtonColor: "#0277bd",
    denyButtonColor: "#6c757d",
  });

  if (isDenied) showToast(<LoginDetails {...details} />);
};

export default showLoginDetails;
