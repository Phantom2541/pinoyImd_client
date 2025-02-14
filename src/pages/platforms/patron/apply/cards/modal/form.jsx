import React, { useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBContainer,
  MDBInputGroup,
  MDBTextArea,
  MDBTypography,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { UPLOAD } from "../../../../../../redux/slices/assets/persons/auth";
import { toast } from "react-toastify";
import {
  SAVE,
  UPDATE,
} from "../../../../../../redux/slices/assets/persons/users";
// import { ENDPOINT } from "../../../../../../components/utilities";
import { PresetUser, ENDPOINT } from "../../../../../../services/utilities";

export default function ApplicationForm({ branchId, companyId, roles }) {
  const { theme, token, auth } = useSelector(({ auth }) => auth),
    [selectedRole, setSelectedRole] = useState("manager"),
    { record } = useSelector(({ petitions }) => petitions),
    [file, setFile] = useState(""),
    [preview, setPreview] = useState(""),
    [message, setMessage] = useState(""),
    dispatch = useDispatch();

  const handleSubmit = () => {
    if (file || record.status) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          dispatch(
            UPLOAD({
              data: {
                path: `bio`,
                base64: reader.result.split(",")[1],
                name: `${auth.email}.pdf`,
              },
              token,
              willRefresh: false,
            })
          );
          setFile({});
          setSelectedRole("Manager");
          setMessage("");
        };
        reader.readAsDataURL(file);
      }
      if (record.status) {
        dispatch(
          UPDATE({
            id: record._id,
            token,
            data: {
              status: "pending",
              companyId,
              branchId,
              message,
              role: selectedRole,
            },
          })
        );
      } else {
        dispatch(
          SAVE({
            form: {
              userId: auth._id,
              role: selectedRole,
              companyId,
              branchId,
              message,
            },
            token,
          })
        );
      }
    } else {
      toast.warn("Upload your Curriculum Vitae first!");
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    if (file.type === "application/pdf") {
      setFile(file);
    } else {
      toast.warn("Please do not change required file type.");
    }
  };

  return (
    <MDBContainer fluid>
      <MDBTypography
        tag="h4"
        className="mb-3 d-flex align-items-center justify-content-between"
      >
        <span>{record.status ? "Resend" : "Send"} Application form</span>
        {record.status && (
          <MDBBadge color="danger" className="text-uppercase">
            {record.status}
          </MDBBadge>
        )}
      </MDBTypography>
      <MDBInputGroup textBefore={<span>Position</span>}>
        <select
          className={`form-control`}
          onChange={(e) => setSelectedRole(e.target.value)}
          value={selectedRole || record.role}
        >
          {roles.map((role, index) => (
            <option key={`role-${index}-select`} value={role.role}>
              {role?.name}
            </option>
          ))}
        </select>
      </MDBInputGroup>
      <MDBTextArea
        className="mt-3"
        onChange={(e) => setMessage(e.target.value)}
        label="Message"
        contrast={theme.dark}
        value={message || record.message}
      />
      <label
        htmlFor={`resume-upload-${branchId}`}
        className="w-100 btn btn-primary my-3"
      >
        upload pdf
      </label>

      <div className="ratio ratio-16x9">
        <iframe
          src={preview || `${ENDPOINT}/assets/bio/${auth.email}.pdf`}
          title="Your CV."
        />
      </div>

      {(preview || record.status) && (
        <div className="text-end mt-3">
          <MDBBtn onClick={handleSubmit}>
            {record.status ? "Resubmit" : "submit"}
          </MDBBtn>
        </div>
      )}

      <input
        id={`resume-upload-${branchId}`}
        accept="application/pdf"
        onChange={handleChange}
        className="d-none"
        type="file"
      />
    </MDBContainer>
  );
}
