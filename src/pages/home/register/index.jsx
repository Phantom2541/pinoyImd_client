import React, { useState, useEffect } from "react";
import {
  MDBAnimation,
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
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  CUSTOMALERT,
  REGISTER,
} from "../../../services/redux/slices/assets/persons/users";
import { Suffixes } from "../../../services/fakeDb";
import IMG1 from "./../../../assets/homeImg.jpg";
import IMG2 from "./../../../assets/homeMachine.jpg";
import IMG3 from "./../../../assets/homePatient.jpg";
import REGISTRATIONIMG from "./../../../assets/homePageRegistrationImg.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { set } from "lodash";

export default function Register({ handleFlip, flipped }) {
  const [isMale, setIsMale] = useState(false);
  const [isLocked, setIsLocked] = useState({
      password: true,
      confirmPassword: true,
    }),
    { message, isLoading, isSuccess } = useSelector(({ users }) => users),
    [suffix, setSuffix] = useState("NONE"),
    dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password, confirmPassword, fname, mname, lname } = e.target;
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
          fullName,
        })
      );
    } else {
      dispatch(CUSTOMALERT("Passwords does not match."));
    }
  };

  const handleMaleChange = (e) => {
    setIsMale(e.target.checked);
  };

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("registration-form").reset();
    }
  }, [isSuccess]);

  return (
    <MDBAnimation reveal type="fadeIn">
      <div
        className={`homePage-flip-container ${
          flipped ? "homePage-flipped" : ""
        }`}
      >
        <div className="homePage-flip-card">
          <div className="homePage-flip-card-front">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              showArrows={false}
            >
              <div className="homeSlideStyle">
                <div className="homeSlideContent">
                  <div className="hometextContainerStyle">
                    <h1>Your Complete Diagnostic Information System</h1>
                    <h5>Simplified, Integrated, Scalable.</h5>
                    <p>
                      Empowering medical providers with seamless laboratory
                      management, advanced reporting, and patient-centric care.
                    </p>
                  </div>
                  <div className="homeimageContainerStyle">
                    <img src={IMG1} alt="Slide 1" className="homeimageStyle" />
                  </div>
                </div>
              </div>

              <div className="homeSlideStyle">
                <div className="homeSlideContent">
                  <div className="hometextContainerStyle">
                    <h1>Seamless Device Integration</h1>
                    <h5>Connect Your Laboratory Analyzers with Ease.</h5>
                    <p>
                      Full compatibility with hematology, chemistry, and
                      immunology analyzers. HL7-ready for EMR and LIS
                      integration.
                    </p>
                  </div>
                  <div className="homeimageContainerStyle">
                    <img src={IMG2} alt="Slide 2" className="homeimageStyle" />
                  </div>
                </div>
              </div>

              <div className="homeSlideStyle">
                <div className="homeSlideContent">
                  <div className="hometextContainerStyle">
                    <h1>Built for Clinics, Hospitals, and Mobile Units</h1>
                    <h5>
                      From small clinics to nationwide chains — scalable as you
                      grow.
                    </h5>
                    <p>
                      Manage patient records, results, billing, inventory, and
                      mobile laboratory operations — all in one platform.
                    </p>
                  </div>
                  <div className="homeimageContainerStyle">
                    <img src={IMG3} alt="Slide 3" className="homeimageStyle" />
                  </div>
                </div>
              </div>
            </Carousel>
          </div>
          <div className="homePage-flip-card-back">
            <div className="d-flex align-items-center">
              <div>
                <h2 style={{ fontWeight: "400" }}>Patient Registration Form</h2>
                <form style={{ width: "100%" }}>
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
                            className={`colorful-select dropdown-primary  hidden-md-down ml-3`}
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

                      <div className="d-flex align-items-center mt-1 mb-4">
                        <MDBInput
                          label="Male"
                          type="checkbox"
                          id="male"
                          checked={isMale}
                          onChange={handleMaleChange}
                          required
                        />
                        <MDBInput
                          label="Female"
                          type="checkbox"
                          id="female"
                          checked={!isMale}
                          onChange={() => setIsMale(false)}
                          required
                        />
                      </div>
                    </MDBCol>
                    <MDBCol md="6">
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
                className="homePage-register-img"
                alt="registrationImg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="homeSlideContainer"></div>
    </MDBAnimation>
  );
}
