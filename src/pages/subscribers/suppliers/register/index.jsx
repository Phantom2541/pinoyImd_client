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
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import {
  CUSTOMALERT,
  REGISTER,
} from "../../../../services/redux/slices/assets/persons/users";
import { Suffixes } from "../../../../services/fakeDb";
import REGISTRATIONIMG from "./../../../../assets/homePageRegistrationImg.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const slides = [
  {
    title: "Your Complete Diagnostic Information System",
    subtitle: "Simplified, Integrated, Scalable.",
    description:
      "Empowering medical providers with seamless laboratory management, advanced reporting, and patient-centric care.",
    image: "1r9GSLgSh2r92poO5M-31eZRrl9TX6WyV",
  },
  {
    title: "Seamless Device Integration",
    subtitle: "Connect Your Laboratory Analyzers with Ease.",
    description:
      "Full compatibility with hematology, chemistry, and immunology analyzers. HL7-ready for EMR and LIS integration.",
    image: "1_iTLa8s73Y-Cv3ExURPOx3pb8Lhvo-BJ",
  },
  {
    title: "Built for Clinics, Hospitals, and Mobile Units",
    subtitle: "From small clinics to nationwide chains — scalable as you grow.",
    description:
      "Manage patient records, results, billing, inventory, and mobile laboratory operations — all in one platform.",
    image: "1ChFTwijLSd9NCZI6QEoVP1v1DMFnV7dg",
  },
];

export default function Register({ handleFlip, flipped }) {
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

  const handleMaleChange = (e) => {
    setIsMale(e.target.checked);
  };

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("registration-form")?.reset();
    }
  }, [isSuccess]);

  return (
    <MDBAnimation reveal type="fadeIn" duration="1000ms">
      <div className="subscriber-register-section">
        <div
          className={`subscriber-flip-container ${
            flipped ? "subscriber-flipped" : ""
          }`}
        >
          <div className="subscriber-flip-card">
            <div className="subscriber-flip-card-front">
              <Carousel
                // autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                showArrows={false}
              >
                {slides.map((slide, i) => (
                  <div className="subscriber-slide-style" key={i}>
                    <div className="subscriber-slide-content">
                      <div className="subscriber-text-container-style">
                        <h1>{slide.title}</h1>
                        <h5>{slide.subtitle}</h5>
                        <p>"{slide.description}"</p>
                      </div>
                      <div className="subscriber-image-container-style">
                        <img
                          src={`https://drive.google.com/thumbnail?id=${slide.image}`}
                          alt={`Slide ${i + 1}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="subscriber-flip-card-back">
              <button className="subscriber-back-button" onClick={handleFlip}>
                <MDBIcon fas icon="arrow-left" />
              </button>
              <div className="d-flex align-items-center">
                <div>
                  <h2 style={{ fontWeight: "400" }}>
                    Patient Registration Form
                  </h2>
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
                          className="d-flex align-items-center mt-1 mb-4"
                          label="Phone #"
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
                        {isLoading ? (
                          <MDBIcon icon="spinner" spin />
                        ) : (
                          "Sign up"
                        )}
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
            </div>
          </div>
        </div>
      </div>
    </MDBAnimation>
  );
}
