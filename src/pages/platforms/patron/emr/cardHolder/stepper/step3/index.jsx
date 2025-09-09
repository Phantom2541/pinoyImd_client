import { useEffect, useRef } from "react";
import { ValidID } from "../../../../../../../services/fakeDb";
import Card from "../../card";
import { Cloudinary } from "../../../../../../../services/utilities";

const Step3 = ({ form, setForm, isValid, setIsValid }) => {
  const authLS = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    setForm((prev) => {
      const { validID, email } = authLS;
      const { img, type } = validID;
      const getPath = (isFront = false) =>
        `${Cloudinary.getEndpoint()}/${
          img?.[isFront ? "front" : "back"]
        }/users/${email}/portfolio/${type}/${isFront ? "front" : "back"}`;
      return {
        ...prev,
        vi: {
          ...validID,
          type,
          img: {
            front: getPath(true),
            back: getPath(false),
          },
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="text-center w-100" style={{ maxWidth: "400px" }}>
          <select
            className="form-control"
            defaultValue=""
            required
            value={form?.vi?.type}
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
        </div>
      </div>
      <Card
        form={form}
        setForm={setForm}
        isValid={isValid}
        setIsValid={setIsValid}
        typeKey="vi"
        isValidID
      />
    </div>
  );
};

export default Step3;
