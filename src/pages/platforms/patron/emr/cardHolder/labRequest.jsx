import { useRef, useState } from "react";
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from "mdbreact";

const LabRequest = ({
  isValid = true,
  form,
  setForm = () => {},
  setIsValid = () => {},
}) => {
  const fileInputRef = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, form: reader.result.split(",")[1] });
        setIsValid(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <MDBCard
        className={!form.form ? "p-2" : ""}
        style={{
          width: "794px",
          height: "300px",
          borderRadius: "8px",
          position: "relative",
          backgroundColor: "#f9f9f9",
          overflow: "hidden",
        }}
      >
        <MDBCardBody
          className="p-0"
          style={{
            height: "100%",
            position: "relative",
            borderRadius: "8px",
            border: !form.form && "1.7px dashed #bfbfbf",
          }}
        >
          {!isValid && (
            <div
              className="alert alert-danger mb-0 d-flex align-items-center justify-content-center mb-n5"
              style={{
                borderRadius: "0",
                fontWeight: "500",
                textAlign: "center",
                padding: "12px 16px",
                backgroundColor: "#f8d7da",
                color: "#721c24",
              }}
            >
              Lab request form is required. Please upload it before proceeding
              to the next step.
            </div>
          )}

          {form.form ? (
            <>
              <div
                style={{
                  height: "100%",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                <img
                  src={`data:image/png;base64,${form.form}`}
                  alt="Uploaded Lab Request"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  right: "0",
                }}
              >
                <MDBBtn size="sm" color="warning" onClick={handleUploadClick}>
                  <MDBIcon icon="redo" className="mr-2" />
                  Change Image
                </MDBBtn>
              </div>
            </>
          ) : (
            <div className="d-flex h-100 w-100 align-items-center justify-content-center">
              <MDBBtn size="md" color="warning" onClick={handleUploadClick}>
                <MDBIcon icon="upload" className="mr-2" />
                Upload Lab Request Form
              </MDBBtn>
            </div>
          )}
        </MDBCardBody>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </MDBCard>
    </div>
  );
};

export default LabRequest;
