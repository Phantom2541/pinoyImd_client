import { useRef, useState } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import { HMO } from "../../../../../services/fakeDb";

const CardRequest = ({
  hmo = [],
  form,
  setForm,
  isValid,
  setIsValid,
  setActiveStep,
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
        const base64 = reader.result;
        setForm({ ...form, card: { ...form.card, img: base64.split(",")[1] } });
        setIsValid(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      {form.haveCard === null && (
        <div className="text-center mb-4">
          <h6 className="font-weight-bold mb-3 mt-2">
            Do you have a health card (HMO) ?
          </h6>
          <MDBBtn
            color="success"
            className="mr-2"
            size="sm"
            onClick={() => setForm({ ...form, haveCard: true })}
          >
            <MDBIcon icon="check-circle" className="mr-1" />
            Yes, I have a card
          </MDBBtn>
          <MDBBtn
            color="light"
            onClick={() => {
              setForm({ ...form, haveCard: true });
              setActiveStep(3);
            }}
            size="sm"
          >
            <MDBIcon icon="times-circle" className="mr-1" />
            No, I don’t have one
          </MDBBtn>
        </div>
      )}

      {form.haveCard === true && (
        <div className="w-100">
          <div className="d-flex justify-content-center ">
            <div className="d-flex w-100 justify-content-center flex-wrap align-items-center ">
              <select
                className="form-control mb-3 "
                defaultValue=""
                required
                value={form?.card?.type}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    card: { ...form.card, type: target.value },
                  })
                }
              >
                <option value="" disabled>
                  Select Card Type
                </option>
                {hmo
                  .map(({ code }) => ({
                    code,
                    label: HMO.getName(code),
                  }))
                  .map(({ code, label }, index) => (
                    <option value={code} key={index}>
                      {label}
                    </option>
                  ))}
              </select>

              <div className="form-check  d-flex align-items-center justify-content-center">
                <span className="mr-2">Is this a primary card holder?</span>
                <div className="mr-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="no"
                    onChange={() =>
                      setForm({
                        ...form,
                        card: { ...form.card, primary: !form.card.primary },
                      })
                    }
                    checked={!form.card.primary}
                  />
                  <label className="form-check-label" htmlFor="no">
                    No
                  </label>
                </div>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="yes"
                  onChange={() =>
                    setForm({
                      ...form,
                      card: { ...form.card, primary: !form.card.primary },
                    })
                  }
                  checked={form.card.primary}
                />
                <label className="form-check-label" htmlFor="yes">
                  Yes
                </label>
              </div>
            </div>
          </div>
          <div
            className="d-flex flex-wrap align-items-center w-100  justify-content-center"
            style={{ gap: "15px" }}
          >
            <MDBCard
              style={{
                width: "400px",
                height: "auto",
                borderRadius: "8px",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#f9f9f9",
              }}
            >
              <MDBCardBody className="p-0 d-flex flex-wrap">
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
                    Card ID is required. Please upload it before proceeding to
                    the next step.
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
                      <MDBBtn
                        size="sm"
                        color="warning"
                        onClick={handleUploadClick}
                      >
                        <MDBIcon icon="redo" className="mr-2" />
                        Change Image
                      </MDBBtn>
                    </div>
                  </>
                ) : (
                  <div className="d-flex h-100 w-100 align-items-center justify-content-center">
                    <MDBBtn
                      size="md"
                      color="warning"
                      onClick={handleUploadClick}
                    >
                      <MDBIcon icon="upload" className="mr-2" />
                      Upload Card
                    </MDBBtn>
                  </div>
                )}
              </MDBCardBody>
            </MDBCard>
            <div
              className="d-flex flex-wrap flex-column"
              style={{ gap: "5px" }}
            >
              <input className="form-control" />
              <input className="form-control  " />
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {form.haveCard === false && (
        <div className="text-center mt-4">
          <p>You may continue without uploading any health card.</p>
          <MDBBtn size="sm" color="secondary">
            <MDBIcon icon="arrow-left" className="mr-2" />
            Back
          </MDBBtn>
        </div>
      )}
    </div>
  );
};

export default CardRequest;
