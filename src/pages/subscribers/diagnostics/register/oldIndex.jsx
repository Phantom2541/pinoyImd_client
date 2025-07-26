import React, { useState, useEffect } from "react";
import {
  MDBAnimation,
  MDBBtn,
  MDBCard,
  MDBCardBody,
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
} from "../../../../services/redux/slices/assets/persons/users";
import { Suffixes } from "../../../../services/fakeDb";
import HOMEIMG from "./../../../assets/homeImg.jpg";

export default function Register() {
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

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("registration-form").reset();
    }
  }, [isSuccess]);

  return (
    // <MDBRow className="flex-center pt-5 mt-3">
    //   <MDBCol md="4" className="text-center text-md-left mb-5">
    //     <MDBAnimation type="fadeInLeft">
    //       <div className="white-text">
    //         <h1 className="h1-responsive font-weight-bold">
    //           Join us right now!
    //         </h1>
    //         <hr className="hr-light" />
    //         <h6>
    //           As a solution provider company, we specialize in understanding and
    //           addressing the needs of our clients by offering tailored and
    //           innovative solutions. Through close collaboration and utilizing
    //           our expertise, we develop comprehensive strategies that encompass
    //           software implementation, process optimization, consultancy
    //           services, and specialized products. Our goal is to deliver
    //           effective and efficient solutions that resolve complex problems
    //           and help our clients achieve their objectives.
    //         </h6>
    //       </div>
    //     </MDBAnimation>
    //   </MDBCol>
    //   <MDBCol md="7" className=" offset-xl-1">
    //     <MDBAnimation type="fadeInRight">
    //       <form
    //         onSubmit={handleSubmit}
    //         id="registration-form"
    //         autoComplete="off"
    //       >
    //         <MDBCard>
    //           <MDBCardBody>
    //             <div className="text-center">
    //               <h3 className="white-text">
    //                 <MDBIcon icon="user" className="white-text" /> Register
    //               </h3>
    //               <hr className="hr-light" />
    //             </div>
    //             <MDBRow>
    //               <MDBCol md="6">
    //                 <MDBInput
    //                   className="white-text"
    //                   label="First Name"
    //                   icon="user"
    //                   type="text"
    //                   labelClass="white-text"
    //                   iconClass="white-text"
    //                   name="fname"
    //                   required
    //                 />
    //               </MDBCol>
    //               <MDBCol md="6">
    //                 <MDBInput
    //                   className="white-text"
    //                   label="Middle Name"
    //                   icon="user"
    //                   type="text"
    //                   labelClass="white-text"
    //                   iconClass="white-text"
    //                   name="mname"
    //                 />
    //               </MDBCol>
    //               <MDBCol md="6">
    //                 <MDBInput
    //                   className="white-text"
    //                   label="Last Name"
    //                   icon="user"
    //                   type="text"
    //                   labelClass="white-text"
    //                   iconClass="white-text"
    //                   name="lname"
    //                   required
    //                 />
    //               </MDBCol>
    //               <MDBCol md="6">
    //                 <MDBSelect
    //                   getValue={value => setSuffix(value[0])}
    //                   label={"Suffix"}
    //                   labelClass="white-text"
    //                   className={`colorful-select dropdown-primary  hidden-md-down white-text`}
    //                 >
    //                   <MDBSelectInput
    //                     name="suffix"
    //                     className="white-text"
    //                     selected={`NONE`}
    //                   />
    //                   <MDBSelectOptions>
    //                     {Suffixes.map(sfx => (
    //                       <MDBSelectOption key={sfx} value={sfx}>
    //                         {sfx}
    //                       </MDBSelectOption>
    //                     ))}
    //                   </MDBSelectOptions>
    //                 </MDBSelect>
    //               </MDBCol>
    //             </MDBRow>

    //             <MDBInput
    //               className="white-text"
    //               label="E-mail Address"
    //               icon="envelope"
    //               type="email"
    //               labelClass="white-text"
    //               iconClass="white-text"
    //               name="email"
    //               required
    //             />
    //             <MDBInput
    //               className="white-text"
    //               label="Password"
    //               minLength={8}
    //               icon={isLocked.password ? "lock" : "unlock"}
    //               onIconMouseEnter={() =>
    //                 setIsLocked({ ...isLocked, password: false })
    //               }
    //               onIconMouseLeave={() =>
    //                 setIsLocked({ ...isLocked, password: true })
    //               }
    //               type={isLocked.password ? "password" : "text"}
    //               labelClass="white-text"
    //               iconClass="white-text"
    //               name="password"
    //               required
    //             />
    //             <MDBInput
    //               className="white-text"
    //               label="Confirm your password"
    //               minLength={8}
    //               icon={isLocked.confirmPassword ? "lock" : "unlock"}
    //               onIconMouseEnter={() =>
    //                 setIsLocked({ ...isLocked, confirmPassword: false })
    //               }
    //               onIconMouseLeave={() =>
    //                 setIsLocked({ ...isLocked, confirmPassword: true })
    //               }
    //               type={isLocked.confirmPassword ? "password" : "text"}
    //               labelClass="white-text"
    //               iconClass="white-text"
    //               name="confirmPassword"
    //               required
    //             />

    //             <MDBInput
    //               label="I read and agree with the Terms and Conditions"
    //               labelClass="white-text"
    //               type="checkbox"
    //               id="agreement"
    //               required
    //             />

    //             {message && (
    //               <div
    //                 className={`alert alert-${
    //                   isSuccess ? "success" : "warning"
    //                 } text-center mt-3`}
    //               >
    //                 {message}
    //               </div>
    //             )}

    //             <div className="text-center mt-4">
    //               <MDBBtn
    //                 disabled={isLoading}
    //                 type="submit"
    //                 color="light-blue"
    //                 rounded
    //               >
    //                 {isLoading ? <MDBIcon icon="spinner" spin /> : "Sign up"}
    //               </MDBBtn>
    //               <hr className="hr-light mb-3 mt-4" />

    //               {/* <div className="inline-ul text-center d-flex justify-content-center">
    //               <MDBIcon
    //                 fab
    //                 icon="google"
    //                 size="lg"
    //                 className="white-text p-2 m-2 cursor-pointer"
    //               />
    //               <MDBIcon
    //                 fab
    //                 icon="facebook"
    //                 size="lg"
    //                 className="white-text p-2 m-2 cursor-pointer"
    //               />
    //               <MDBIcon
    //                 fab
    //                 icon="yahoo"
    //                 size="lg"
    //                 className="white-text p-2 m-2 cursor-pointer"
    //               />
    //             </div> */}
    //             </div>
    //           </MDBCardBody>
    //         </MDBCard>
    //       </form>
    //     </MDBAnimation>
    //   </MDBCol>
    // </MDBRow>
    <MDBRow>
      <MDBCol md="5">
        <div className="d-flex flex-column" style={{ gap: "50px" }}>
          <span className="homeText mt-4">
            Empowering medical providers with seamless laboratory management,
            advanced reporting, and patient-centric care.
          </span>
          <button className="homeRegister">
            Register here <div></div>
          </button>
        </div>
      </MDBCol>
      <MDBCol md="7" className="imgContainer">
        <img src={HOMEIMG} alt="homeImg" className="homeImg" />
        <div className="imgShadow"></div>
      </MDBCol>
    </MDBRow>
  );
}
