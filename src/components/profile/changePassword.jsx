import React, { useState } from "react";
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
import { CHANGEPASSWORD } from "../../services/redux/slices/assets/persons/auth";

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
      value={value}
      onChange={onChange}
    />
  );
};

export default function ChangePassword({ show, toggle }) {
  const { auth, token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  const handleSubmit = () => {
    const { oldPass, newPass, confirmNewPass } = form;

    if (!oldPass || !newPass || !confirmNewPass)
      return Swal.fire({
        icon: "error",
        title: "Invalid Form",
        text: "All field are required.",
      });

    if (newPass !== confirmNewPass)
      return Swal.fire({
        icon: "error",
        title: "Invalid New Password",
        text: "New Passwords does not match!",
      });

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
          oldPass,
          newPass,
        },
      })
    );

    setForm(_form);
    toggle();
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
        <PasswordInput
          label="Confirm New Password"
          value={form.confirmNewPass}
          onChange={(e) => setForm({ ...form, confirmNewPass: e.target.value })}
        />

        <div className="text-center">
          <MDBBtn onClick={handleSubmit} rounded color="primary">
            submit
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
