import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

import { MDBCol, MDBRow } from "mdbreact";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
} from "./../../../../../../../../services/fakeDb";

export default function Microscopic() {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const { me } = task;

  const handleChange = (index, value) => {
    const _me = [...me];
    _me[index] = Number(value);
    dispatch(SetPARAMS({ key: "me", value: _me }));
    dispatch(SetTASK({ task: { ...task, me: _me } }));
  };

  const microscopicLabels = [
    "Pus Cells",
    "Red Cells",
    "Epithelial Cells",
    "Mucus Threads",
    "Amorphous Urates",
    "Bacteria",
  ];

  return (
    <MDBRow className="text-left">
      {microscopicLabels.map((label, index) => {
        const isWordResult = index > 1; // indices 2‑5 use words
        const choices = isWordResult
          ? MicroscopicResultInWord
          : MicroscopicInRange;

        return (
          <MDBCol key={`${label}-${index}`} md="6">
            <label className="d-block mb-1">{label}</label>

            {/* WORD RESULTS → RADIO BUTTONS */}
            {isWordResult ? (
              choices.map((choice, i) => (
                <div className="form-check mb-1" key={i}>
                  <input
                    type="radio"
                    className="form-check-input"
                    id={`${label}-${i}`}
                    name={label} // groups radios per label
                    value={i}
                    checked={me[index] === i}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`${label}-${i}`}>
                    {choice}
                  </label>
                </div>
              ))
            ) : (
              /* RANGE RESULTS → SELECT */
              <select
                value={me[index]}
                style={{
                  ...(Number(me[index] > 2) && {
                    color: "red",
                    fontWeight: "bold",
                  }),
                }}
                className="form-control mb-2"
                onChange={(e) => handleChange(index, e.target.value)}
              >
                <option value=""></option>
                {choices.map((choice, i) => (
                  <option key={i} value={i} style={{ color: "black" }}>
                    {choice}
                  </option>
                ))}
              </select>
            )}
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
