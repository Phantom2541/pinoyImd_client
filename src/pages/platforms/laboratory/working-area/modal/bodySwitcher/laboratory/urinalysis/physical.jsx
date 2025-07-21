import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";
// import { Select } from "../../../../../../../../components/customizable";
import {
  Transparency,
  UrineColors,
  SpecificGravity,
  PH,
} from "../../../../../../../../services/fakeDb";

export default function Physical() {
  const { task } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();
  const { pe } = task;
  const handleSelectChange = (index, value) => {
    const _pe = [...pe];
    _pe[index] = value;

    dispatch(SetPARAMS({ key: "pe", value: _pe }));
    dispatch(SetTASK({ task: { ...task, pe: _pe } }));
  };

  const physicalSelects = [
    {
      label: "Color",
      choices: UrineColors,
    },
    {
      label: "Transparency",
      choices: Transparency,
    },
    {
      label: "Specific Gravity",
      choices: SpecificGravity,
    },
    {
      label: "Reaction / pH",
      choices: PH,
    },
  ];
  return (
    <MDBRow className="text-left">
      {physicalSelects.map(({ label, choices }, index) => {
        return (
          <MDBCol md="6" key={`${label}-${index}`}>
            {/* <Select
            collections={choices}
            label={label}
            preValue={pe[index]}
            texts="str"
            values="index"
            onChange={(e) => handleSelectChange(index, Number(e))}
          /> */}
            <label htmlFor="">{label}</label>

            <select
              value={pe[index]}
              className="form-control mb-2"
              onChange={(e) => handleSelectChange(index, e.target.value)}
            >
              <option></option>
              {choices.map((choice, i) => {
                return (
                  <option key={i} value={i}>
                    {choice}
                  </option>
                );
              })}
            </select>
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
