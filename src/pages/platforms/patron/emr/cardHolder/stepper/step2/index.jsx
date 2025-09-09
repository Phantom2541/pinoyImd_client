import { MDBBtn, MDBIcon } from "mdbreact";
import Card from "../../card";
import { HMO } from "../../../../../../../services/fakeDb";
import { useEffect } from "react";
import { Cloudinary } from "../../../../../../../services/utilities";

const Step2 = ({ form, setForm, setActiveStep, hmo, isValid, setIsValid }) => {
  const authLS = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    setForm((prev) => {
      const { healthCard: card, email } = authLS;
      console.log("card", card);
      const { img, type, isPrimary = false } = card;
      const getPath = (isFront = false) =>
        `${Cloudinary.getEndpoint()}/${
          img?.[isFront ? "front" : "back"]
        }/users/${email}/portfolio/${type}/${isFront ? "front" : "back"}`;
      return {
        ...prev,
        card: {
          ...card,
          type: type,
          isPrimary,
          img: {
            front: getPath(true),
            back: getPath(false),
          },
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!form.haveCard)
    return (
      <>
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
                setForm({ ...form, haveCard: null });
                setActiveStep(4);
              }}
              size="sm"
            >
              <MDBIcon icon="times-circle" className="mr-1" />
              No, I don’t have one
            </MDBBtn>
          </div>
        )}
      </>
    );

  return (
    <div>
      <div className="w-100">
        <div className="d-flex justify-content-center  ">
          <div
            className="d-flex w-100  flex-wrap align-items-center justify-content-center"
            style={{ maxWidth: "400px" }}
          >
            <div>
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
            </div>

            <div className="  d-flex align-items-center justify-content-center">
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
      </div>
      <Card
        form={form}
        setForm={setForm}
        isValid={isValid}
        setIsValid={setIsValid}
      />
    </div>
  );
};

export default Step2;
