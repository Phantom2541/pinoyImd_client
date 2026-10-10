import { MDBBtn } from "mdbreact";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Password from "./password";
import { getPasswordError } from "../passwordRule";
import Spinner from "../../../../spinner";

const ChangePassword = ({ email, resetToken = "", onDone = () => {} }) => {
  const [password, setPassword] = useState(""),
    [cPassword, setCPassword] = useState(""),
    [isLoading, setIsLoading] = useState(false);
  const passwordError = getPasswordError(password);
  const passwordsMatch = password === cPassword;

  const canSubmit =
    Boolean(password && cPassword) &&
    !passwordError &&
    passwordsMatch &&
    !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);

    try {
      const { data } = await axios.put(
        "assets/persons/auth/forgot-password/reset",
        { email, resetToken, password },
      );

      Swal.fire({
        icon: "success",
        title: "Password Changed!",
        text: data?.success || "Your password has been changed. Please login.",
      });
      onDone();
    } catch ({ response, message }) {
      Swal.fire({
        icon: "warning",
        title: "Unable to reset password",
        text: response?.data?.message || message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="top-login-auth__form">
      <Password
        label="New Password"
        password={password}
        setPassword={setPassword}
      />
      {password && passwordError && (
        <small className="d-block text-danger mb-2">{passwordError}.</small>
      )}
      <Password
        label="Confirm Password"
        password={cPassword}
        setPassword={setCPassword}
      />
      {cPassword && !passwordsMatch && (
        <small className="d-block text-danger mb-2">
          Passwords do not match.
        </small>
      )}
      <MDBBtn
        block
        type="submit"
        disabled={!canSubmit}
        className="top-login-auth__cta"
      >
        Change Password <Spinner formSubmitted={isLoading} />
      </MDBBtn>
    </form>
  );
};

export default ChangePassword;
