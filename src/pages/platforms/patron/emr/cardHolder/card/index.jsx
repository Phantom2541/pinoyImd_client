import { useRef, useState } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import Card from "./card";

const CardRequest = ({
  form,
  setForm,
  setIsValid,
  isValid,
  typeKey = "card",
}) => {
  const [isFront, setIsFront] = useState(true);
  const fileInputRef = useRef(null);

  const handleUploadClick = (_isFront) => {
    setIsFront(_isFront);
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        const baseKey = isFront ? "front" : "back";
        setForm({
          ...form,
          [typeKey]: {
            ...form[typeKey],
            img: { ...form?.[typeKey]?.img, [baseKey]: base64 },
          },
        });
        setIsValid(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const { img } = form[typeKey] || {};

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <div className="w-100">
        <div
          className="d-flex flex-wrap align-items-center w-100 justify-content-center mt-2"
          style={{ gap: "15px" }}
        >
          <Card
            form={form}
            src={img.front}
            isFront
            isValidID={typeKey !== "card"}
            isValid={!isValid ? (img.front ? true : false) : true}
            handleUploadClick={handleUploadClick}
          />
          <Card
            form={form}
            isValid={!isValid ? (img.back ? true : false) : true}
            src={img.back}
            isValidID={typeKey !== "card"}
            handleUploadClick={handleUploadClick}
          />
        </div>

        <div className="d-flex justify-content-center">
          <div
            className="d-flex justify-content-center mt-3  w-100"
            style={{ maxWidth: "800px", gap: "15px" }}
          >
            <div className="w-50">
              <span>ID number:</span>
              <input
                className="form-control"
                required
                value={form?.[typeKey]?.id}
                onChange={({ target }) =>
                  setForm({
                    ...form,
                    [typeKey]: { ...form?.[typeKey], id: target.value },
                  })
                }
                placeholder="ID number"
              />
            </div>
            <div className="w-50">
              <span>
                Expiry Date:
                <input
                  value={form?.[typeKey]?.expiry}
                  onChange={({ target }) =>
                    setForm({
                      ...form,
                      [typeKey]: { ...form?.[typeKey], expiry: target.value },
                    })
                  }
                  className="form-control   "
                  placeholder="Date of expiry"
                  type="date"
                />
              </span>
            </div>
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
