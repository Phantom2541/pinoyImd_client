import { MDBCol, MDBInput, MDBRow } from "mdbreact";
import { useSelector } from "react-redux";
import { HMO as utils } from "../../../../../../services/fakeDb";

const HMO = ({ form, setForm }) => {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch,
    { hmo = [] } = companyId;

  const { hmo: hmos } = form;
  const getValue = (code) => {
    const match = hmos?.find((obj) => Object.keys(obj)[0] === code);
    return match ? match[code] : 0;
  };

  const handleChange = (code, value) => {
    const index = hmos.findIndex((obj) => Object.keys(obj)[0] === code);
    const _hmos = [...hmos];
    if (index > -1) {
      _hmos[index] = { [code]: Number(value) };
    } else {
      _hmos.push({ [code]: Number(value) });
    }
    setForm({ ...form, hmo: _hmos });
  };

  console.log("form", form);

  return (
    <MDBRow>
      {hmo.map(({ code }) => (
        <MDBCol md="4">
          <MDBInput
            label={
              <span
                title={utils.getName(code)}
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "60%",
                }}
              >
                {utils.getName(code)}
              </span>
            }
            labelClass="text-ellipsis-label"
            type="number"
            value={String(getValue(code))}
            onChange={({ target }) => handleChange(code, target.value)}
          />
        </MDBCol>
      ))}
    </MDBRow>
  );
};

export default HMO;
