import { useState } from "react";
import { MDBIcon } from "mdbreact";

// Password field in the auth shell's field style, with the click-to-show eye.
const Password = ({ password, setPassword, label = "" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <label className="top-login-auth__label">{label}</label>
      <div className="top-login-auth__field">
        <MDBIcon icon="lock" />
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          value={password}
          autoComplete="new-password"
          placeholder={label}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          <MDBIcon icon={showPassword ? "eye" : "eye-slash"} />
        </button>
      </div>
    </>
  );
};

export default Password;
