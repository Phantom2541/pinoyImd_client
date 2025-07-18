import React, { useEffect, useState } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBInput,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  CHANGEPASSWORD,
  RESET,
} from "../../services/redux/slices/assets/persons/auth";
import Spinner from "../spinner";

const _form = {
  oldPass: "",
  newPass: "",
  confirmNewPass: "",
};

const PasswordInput = ({ label, value, onChange }) => {
  const [view, setView] = useState(false);

  return (
    <MDBInput
      icon={view ? "eye" : "eye-slash"}
      onIconMouseEnter={() => setView(true)}
      onIconMouseLeave={() => setView(false)}
      type={view ? "text" : "password"}
      label={label}
      required
      value={value}
      onChange={onChange}
    />
  );
};

export default function ChangePassword({ show, toggle }) {
  const { auth, token, formSubmitted, isSuccess, isRejected, message } =
      useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted) {
      if (isSuccess) {
        toggle();
      }
      if (isRejected) {
        Swal.fire({
          icon: "warning",
          title: "Opss..",
          text: message,
        });
      }
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, isRejected, toggle, dispatch, message]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const { oldPass, newPass } = form;
    if (newPass.length < 8)
      return Swal.fire({
        icon: "error",
        title: "Invalid New Password",
        text: "New Password is too short!",
      });

    dispatch(
      CHANGEPASSWORD({
        token,
        data: {
          _id: auth._id,
          newPass,
          oldPass,
        },
      })
    );

    setForm(_form);
    // toggle();
  };
  return (
    <MDBModal isOpen={show} toggle={() => {}} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-lock" className="mr-2" />
        Change Password
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <PasswordInput
            label="Current Password"
            value={form.oldPass}
            onChange={(e) => setForm({ ...form, oldPass: e.target.value })}
          />
          <PasswordInput
            label="New Password"
            value={form.newPass}
            onChange={(e) => setForm({ ...form, newPass: e.target.value })}
          />

          <div className="text-center">
            <MDBBtn
              onClick={handleSubmit}
              rounded
              color="primary"
              type="submit"
              disabled={formSubmitted}
            >
              Submit <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
