import { useRef, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import { HMO, ValidID } from "../../../../../services/fakeDb";

const CardRequest = ({ form, setForm, isValid, setIsValid, setActiveStep }) => {
  const fileInputRef = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setForm({ ...form, vi: { ...form.card, img: base64.split(",")[1] } });
        setIsValid(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <div className="text-center w-100" style={{ maxWidth: "400px" }}>
        <MDBBtn
          size="sm"
          color="info"
          className="mb-3"
          onClick={() => {
            setForm({
              ...form,
              vi: { img: "", type: "", id: "", expired: "" },
              haveCard: null,
            });
            setActiveStep(4);
          }}
        >
          <MDBIcon icon="arrow-right" className="mr-2" />
          Skip
        </MDBBtn>

        <select
          className="form-control mb-3"
          defaultValue=""
          required
          value={form?.card?.type}
          onChange={({ target }) =>
            setForm({ ...form, card: { ...form.card, type: target.value } })
          }
        >
          <option value="" disabled>
            Select Valid ID Type
          </option>
          {ValidID.collections.map(({ code, name }, index) => (
            <option value={code} key={index}>
              {name}
            </option>
          ))}
        </select>

        <MDBCard
          style={{
            width: "100%",
            height: "214px",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
          }}
        >
          <MDBCardBody className="p-0">
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
                Valid ID is required. Please upload it before proceeding to the
                next step.
              </div>
            )}
            {form.card.img ? (
              <>
                <img
                  src={`data:image/png;base64,${form.card.img}`}
                  alt="Uploaded Card"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-5px",
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
                  Upload Valid ID
                </MDBBtn>
              </div>
            )}
          </MDBCardBody>
        </MDBCard>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default CardRequest;
