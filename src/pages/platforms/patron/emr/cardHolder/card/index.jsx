import { useRef, useState } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { HMO } from "../../../../../../services/fakeDb";
import Card from "./card";

const CardRequest = ({
  hmo = [],
  form,
  setForm,
  setIsValid,
  setActiveStep,
  isValid,
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
          card: {
            ...form.card,
            img: { ...form.card?.img, [baseKey]: base64.split(",")[1] },
          },
        });
        setIsValid(true);
      };
      reader.readAsDataURL(file);
    }
  };
  const { card } = form;
  const { img } = card;

  console.log("isFront", img);

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
              setActiveStep(4);
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
            className="d-flex flex-wrap align-items-center w-100  justify-content-center mt-2"
            style={{ gap: "15px" }}
          >
            <Card
              form={form}
              src={img.front}
              isFront
              isValid={!isValid ? (img.front ? true : false) : true}
              handleUploadClick={handleUploadClick}
            />
            <Card
              form={form}
              isValid={!isValid ? (img.back ? true : false) : true}
              src={img.back}
              handleUploadClick={handleUploadClick}
            />
          </div>
          <div className="d-flex justify-content-center">
            <div
              className="d-flex flex-wrap  mt-3 justify-content-center mx-3"
              style={{ gap: "15px" }}
            >
              <div>
                <span>ID number:</span>
                <input
                  className="form-control"
                  required
                  value={form.card?.id}
                  onChange={({ target }) =>
                    setForm({
                      ...form,
                      card: { ...form.card, id: target.value },
                    })
                  }
                  style={{ width: "400px" }}
                  placeholder="ID number"
                />
              </div>
              <span>
                Expiry Date:
                <input
                  value={form.card?.expiry}
                  onChange={({ target }) =>
                    setForm({
                      ...form,
                      card: { ...form.card, expiry: target.value },
                    })
                  }
                  className="form-control  "
                  style={{ width: "400px" }}
                  placeholder="Date of expiry"
                  type="date"
                />
              </span>
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
