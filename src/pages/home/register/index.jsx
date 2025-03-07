import React, { useState } from "react";
import {
  MDBAnimation,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
} from "mdbreact";

export default function Register() {
  const [isLocked, setIsLocked] = useState({
    password: true,
    confirmPassword: true,
  });

  const handleSubmit = e => {
    e.preventDefault();

    // //console.log("test");
    // document.getElementById("registration-form").reset();

    const { email, password, confirmPassword } = e.target;

    //console.log(email);

    if (password.value === confirmPassword.value) {
      // dispatch(
      //   SAVE({
      //     email: email.value,
      //     password: password.value,
      //     role: "64834b49033916fc83e236c5",
      //     wasBanned: true,
      //     banned: {
      //       at: new Date().toLocaleString(),
      //       for: "Account is still being processed.",
      //       by: "647dd2a5dced91b0b39444b3",
      //     },
      //   })
      // );
    } else {
      // dispatch(CUSTOMALERT("Passwords does not match."));
    }
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     // let task = "register reset not working";
  //     document.getElementById("registration-form").reset();
  //   }
  // }, [isSuccess]);

  return (
    <MDBRow className="flex-center pt-5 mt-3">
      <MDBCol md="6" className="text-center text-md-left mb-5">
        <MDBAnimation type="fadeInLeft">
          <div className="white-text">
            <h1 className="h1-responsive font-weight-bold">
              Join us right now!
            </h1>
            <hr className="hr-light" />
            <h6>
              As a solution provider company, we specialize in understanding and
              addressing the needs of our clients by offering tailored and
              innovative solutions. Through close collaboration and utilizing
              our expertise, we develop comprehensive strategies that encompass
              software implementation, process optimization, consultancy
              services, and specialized products. Our goal is to deliver
              effective and efficient solutions that resolve complex problems
              and help our clients achieve their objectives.
            </h6>
          </div>
        </MDBAnimation>
      </MDBCol>
      <MDBCol md="6" className="col-xl-5 offset-xl-1">
        <MDBAnimation type="fadeInRight">
          <form
            onSubmit={handleSubmit}
            id="registration-form"
            autoComplete="off"
          >
            <MDBCard>
              <MDBCardBody>
                <div className="text-center">
                  <h3 className="white-text">
                    <MDBIcon icon="user-plus" className="white-text" /> Register
                  </h3>
                  <hr className="hr-light" />
                </div>

                <MDBInput
                  label="E-mail Address"
                  icon="envelope"
                  type="email"
                  labelClass="white-text"
                  iconClass="white-text"
                  name="email"
                  required
                  disabled
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
                  labelClass="white-text"
                  iconClass="white-text"
                  name="password"
                  required
                  disabled
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
                  labelClass="white-text"
                  iconClass="white-text"
                  name="confirmPassword"
                  required
                  disabled
                />

                <MDBInput
                  label="I read and agree with the Terms and Conditions"
                  labelClass="white-text"
                  type="checkbox"
                  id="agreement"
                  required
                  disabled
                />

                {/* {message && (
                  <div
                    className={`alert alert-${
                      isSuccess ? "success" : "warning"
                    } text-center mt-3`}
                  >
                    {message}
                  </div>
                )} */}

                <div className="text-center mt-4">
                  <MDBBtn
                    // disabled={isLoading}
                    disabled
                    type="submit"
                    color="light-blue"
                    rounded
                  >
                    {/* {isLoading ? <MDBIcon icon="spinner" pulse /> : "Sign up"} */}
                    Sign up
                  </MDBBtn>
                  <hr className="hr-light mb-3 mt-4" />

                  {/* <div className="inline-ul text-center d-flex justify-content-center">
                  <MDBIcon
                    fab
                    icon="google"
                    size="lg"
                    className="white-text p-2 m-2 cursor-pointer"
                  />
                  <MDBIcon
                    fab
                    icon="facebook"
                    size="lg"
                    className="white-text p-2 m-2 cursor-pointer"
                  />
                  <MDBIcon
                    fab
                    icon="yahoo"
                    size="lg"
                    className="white-text p-2 m-2 cursor-pointer"
                  />
                </div> */}
                </div>
              </MDBCardBody>
            </MDBCard>
          </form>
        </MDBAnimation>
      </MDBCol>
    </MDBRow>
  );
}
