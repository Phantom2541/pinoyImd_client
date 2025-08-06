import { useEffect, useRef } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBIcon } from "mdbreact";
import { ValidID } from "../../../../../services/fakeDb";
import { ENDPOINT } from "../../../../../services/utilities";
import utils from "./utils";
import { useSelector } from "react-redux";

const CardRequest = ({ form, setForm, isValid, setIsValid }) => {
  const { token } = useSelector(({ auth }) => auth);
  const fileInputRef = useRef(null);

  const auth = JSON.parse(localStorage.getItem("auth"));
  const { validID = {} } = auth || {};

  useEffect(() => {
    const getImage = async () => {
      const url = `${ENDPOINT}/public/users/${auth?.email}/portfolio/${validID.name}-front.png`;
      const image = await utils.fetchImageAsBase64(url, token);
      setForm({ ...form, vi: { ...form.vi, img: image } });
    };
    getImage();
  }, [auth?.email, form, setForm, token, validID]);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setForm({ ...form, vi: { ...form.vi, img: base64.split(",")[1] } });
        setIsValid(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <div className="text-center w-100" style={{ maxWidth: "400px" }}>
        <select
          className="form-control mb-3"
          defaultValue=""
          required
          value={form?.vi?.type || validID?.name}
          onChange={({ target }) =>
            setForm({ ...form, vi: { ...form.vi, type: target.value } })
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
          className={!form.vi?.img ? "p-2" : ""}
          style={{
            width: "100%",
            height: "214px",
            borderRadius: "8px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
          }}
        >
          <MDBCardBody
            className="p-0"
            style={{
              borderRadius: "8px",
              border: !form.vi?.img && "1.7px dashed #bfbfbf",
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
                Valid ID is required. Please upload it before proceeding to the
                next step.
              </div>
            )}
            {form.vi.img ? (
              <>
                <img
                  src={`data:image/png;base64,${form.vi.img}`}
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
        <div className="my-2">
          <span className="text-left d-block">ID number:</span>
          <input
            className="form-control"
            placeholder="ID number"
            value={form?.vi?.id || validID?.id}
            onChange={({ target }) =>
              setForm({ ...form, vi: { ...form.vi, id: target.value } })
            }
          />
        </div>
        <div>
          <span className="text-left d-block">Expiry Date:</span>
          <input
            className="form-control"
            type="date"
            value={form?.vi?.expiry || validID?.expiry}
            onChange={({ target }) =>
              setForm({ ...form, vi: { ...form.vi, expiry: target.value } })
            }
          />
        </div>

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
