import { useSelector } from "react-redux";
import { HMO } from "../../../../../../../services/fakeDb";
import { MDBTypography } from "mdbreact";

const Wellness = ({ form, setForm }) => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;
  const { companyId = {} } = branch;
  const { hmo = [] } = companyId;

  return (
    <>
      <MDBTypography
        noteTitle="Tip: "
        note
        noteColor="primary"
        className="mt-4"
      >
        Select an HMO category to include
      </MDBTypography>
      <select
        className="form-control"
        value={form?.hmo || ""}
        onChange={(e) => setForm({ ...form, hmo: e.target.value })}
      >
        <option value="" disabled>
          Select an hmo
        </option>
        {hmo.map(({ code }) => (
          <option value={code}>{HMO.getName(code)}</option>
        ))}
      </select>
    </>
  );
};

export default Wellness;
