import React, { useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBInput,
} from "mdbreact";
import { useSelector } from "react-redux";
import { generateCode } from "../../services/utilities";
import Swal from "sweetalert2";
// import { CODE } from "../../services/redux/slices/mailer";

const sentCode = generateCode();

export default function VerificationCode({ show, toggle }) {
  const { email } = useSelector(({ auth }) => auth),
    [didSend, setDidSend] = useState(false),
    [code, setCode] = useState("");

  const handleCode = () => {
    if (didSend) {
      if (!code)
        return Swal.fire({
          icon: "error",
          title: "Invalid Code",
          text: "This field is required.",
        });

      if (code !== sentCode)
        return Swal.fire({
          icon: "error",
          title: "Invalid Code",
          text: "Codes did not match.",
        });

      console.log(code);

      return;
    }

    // dispatch(
    //   CODE({
    //     token,
    //     key: {
    //       code: sentCode,
    //       to: email,
    //       subject: "E-mail Verification",
    //       username: fullName(auth.fullName),
    //     },
    //   })
    // );
    setDidSend(true);
  };

  return (
    <MDBModal isOpen={show} toggle={() => {}} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="laptop-code" className="mr-2" />
        E-mail Verification
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        {didSend ? (
          <MDBInput
            label="Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        ) : (
          <p style={{ textIndent: "25px" }}>
            An e-mail will be sent to you (<strong>{email}</strong>) which
            contains the code needed for this verification.
          </p>
        )}
        <div className="text-center">
          <MDBBtn
            onClick={handleCode}
            rounded
            color={didSend ? "primary" : "info"}
          >
            {didSend ? "submit" : "send"} code
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
