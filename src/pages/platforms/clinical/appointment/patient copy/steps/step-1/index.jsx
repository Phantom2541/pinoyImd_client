import { EditableUser } from "../../../../../../../components/customizable";
import visitTypes from "../../../visitTypes.json";
import Register from "./register";
const Step1 = ({ form, setForm }) => {
  return (
    <>
      {form.isRegister ? (
        <Register form={form} setForm={setForm} />
      ) : (
        <div>
          <span style={{ fontWeight: 400 }} className=" d-block grey-text">
            Patient:
          </span>
          <EditableUser
            readOnly
            setUserId={(user) => setForm({ ...form, user })}
            hasRegister
            setRegister={() => setForm({ ...form, isRegister: true })}
            preValue={form?.user}
            returnObj
          />
        </div>
      )}
      <div>
        <span
          style={{ fontWeight: 400 }}
          className="mb-1 d-block grey-text mt-3"
        >
          Visit Type:
        </span>
        <select
          className="form-control"
          value={form?.visitType}
          onChange={(e) => setForm({ ...form, visitType: e.target.value })}
        >
          <option value="">Choose Visit Type</option>
          {visitTypes.map((visit, index) => (
            <option key={index} value={visit}>
              {visit}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Step1;
