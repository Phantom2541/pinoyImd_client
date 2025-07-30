import { useState, useEffect } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  CUSTOMALERT,
  REGISTER,
} from "../../../services/redux/slices/assets/persons/users";
import { Suffixes } from "../../../services/fakeDb";
import REGISTRATIONIMG from "./../../../assets/homePageRegistrationImg.png";

const Register = () => {
  const [isMale, setIsMale] = useState(false);
  const [isLocked, setIsLocked] = useState({
    password: true,
    confirmPassword: true,
  });

  const { message, isLoading, isSuccess } = useSelector(({ users }) => users);
  const [suffix, setSuffix] = useState("NONE");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      email,
      password,
      confirmPassword,
      fname,
      mname,
      lname,
      dob,
      mobile,
    } = e.target;
    const fullName = {
      fname: fname.value,
      mname: mname.value,
      lname: lname.value,
      suffix: suffix,
    };

    if (password.value === confirmPassword.value) {
      dispatch(
        REGISTER({
          email: email.value,
          password: password.value,
          dob,
          mobile,
          // isMale,
          fullName,
        })
      );
    } else {
      dispatch(CUSTOMALERT("Passwords does not match."));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("registration-form")?.reset();
    }
  }, [isSuccess]);

  const handleMaleChange = (e) => {
    setIsMale(e.target.checked);
  };

  return (
    <div className="d-flex align-items-center">
      <div>
        <h2 style={{ fontWeight: "400" }}>Patient Registration Form</h2>
        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit}
          id="registration-form"
        >
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                label="First Name"
                icon="user"
                type="text"
                name="fname"
                required
              />
              <MDBInput
                label="Middle Name"
                icon="user"
                type="text"
                name="mname"
              />
              <MDBRow
                className="d-flex align-items-center"
                style={{ marginTop: "-25px" }}
              >
                <MDBCol className="pr-0">
                  <MDBInput
                    label="Last Name"
                    icon="user"
                    type="text"
                    name="lname"
                    required
                  />
                </MDBCol>
                <MDBCol className="pl-0">
                  <MDBSelect
                    getValue={(value) => setSuffix(value[0])}
                    label={"Suffix"}
                    className="colorful-select dropdown-primary hidden-md-down ml-3"
                  >
                    <MDBSelectInput name="suffix" selected={`NONE`} />
                    <MDBSelectOptions>
                      {Suffixes.map((sfx) => (
                        <MDBSelectOption key={sfx} value={sfx}>
                          {sfx}
                        </MDBSelectOption>
                      ))}
                    </MDBSelectOptions>
                  </MDBSelect>
                </MDBCol>
              </MDBRow>
              <MDBInput
                className="d-flex align-items-center mb-4"
                label="Phone #"
                style={{ marginTop: "-20px" }}
                icon="mobile "
                type="text"
                name="mobile"
                required
              />
              <div className="d-flex align-items-center mt-1 mb-4">
                <MDBInput
                  label="Male"
                  type="checkbox"
                  id="male"
                  checked={isMale}
                  onChange={handleMaleChange}
                />
                <MDBInput
                  label="Female"
                  type="checkbox"
                  id="female"
                  checked={!isMale}
                  onChange={() => setIsMale(false)}
                />
              </div>
            </MDBCol>

            <MDBCol md="6">
              <MDBInput
                label="Date Of Birth"
                icon="calendar "
                type="date"
                name="dob"
                required
              />
              <MDBInput
                label="E-mail Address"
                icon="envelope"
                type="email"
                name="email"
                required
              />
              <MDBInput
                label="Password"
                minLength={8}
                icon={isLocked.password ? "lock" : "unlock"}
                onIconMouseEnter={() =>
                  setIsLocked({ ...isLocked, password: false })
                }
                onIconMouseLeave={() =>
                  setIsLocked({ ...isLocked, password: true })
                }
                type={isLocked.password ? "password" : "text"}
                name="password"
                required
              />
              <MDBInput
                label="Confirm your password"
                minLength={8}
                icon={isLocked.confirmPassword ? "lock" : "unlock"}
                onIconMouseEnter={() =>
                  setIsLocked({ ...isLocked, confirmPassword: false })
                }
                onIconMouseLeave={() =>
                  setIsLocked({ ...isLocked, confirmPassword: true })
                }
                type={isLocked.confirmPassword ? "password" : "text"}
                name="confirmPassword"
                required
              />
              <MDBInput
                label="I read and agree with the Terms and Conditions"
                type="checkbox"
                id="agreement"
                name="agreement"
                required
              />
            </MDBCol>
          </MDBRow>

          {message && (
            <div
              className={`alert alert-${
                isSuccess ? "success" : "warning"
              } text-center mt-3`}
            >
              {message}
            </div>
          )}

          <div className="text-center mt-4">
            <MDBBtn
              disabled={isLoading}
              type="submit"
              color="light-blue"
              rounded
            >
              {isLoading ? <MDBIcon icon="spinner" spin /> : "Sign up"}
            </MDBBtn>
          </div>
        </form>
      </div>
      <img
        src={REGISTRATIONIMG}
        className="subscriber-register-img"
        alt="registrationImg"
      />
    </div>
  );
};

export default Register;
