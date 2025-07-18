import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "./../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import {
  Cellcount,
  Rci as RCI,
} from "./../../../../../../../../../services/fakeDb";
import { Markup } from "interweave";
import { useEffect, useRef } from "react";

export default function Rci({ activeTab, setActiveTab = () => {} }) {
  const { task } = useSelector(({ validator }) => validator),
    dispatch = useDispatch(),
    { Preferences } = Cellcount,
    { Category } = RCI;

  const inputRefs = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target,
      _name = Number(name),
      _value = Number(value),
      _rci = [...task.rci];

    _rci[_name] = _name === 2 ? parseInt(_value) : parseFloat(_value);

    while (_rci.length < 4) {
      _rci.push(0);
    }

    dispatch(SetTASK({ form: task?.form, task: { ...task, rci: _rci } }));
    dispatch(SetPARAMS({ key: "rci", value: _rci }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
        setActiveTab("PLATELET");
      }
    }
  };

  useEffect(() => {
    if (activeTab === "RCI") inputRefs.current[0]?.focus();
  }, [activeTab]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-1">Category</th>
          <th className="py-1">Result</th>
          <th className="py-1">Reference</th>
        </tr>
      </thead>
      <tbody>
        {(!!task.rci.length ? task.rci : [0, 0, 0, 0]).map((value, index) => {
          const category = Category[index],
            { lo, hi, unit } = Preferences.rci[category];

          return (
            <tr key={`rci-${index}`}>
              <td className="py-1">{category}</td>
              <td className="py-1">
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="number"
                  style={{
                    color: value
                      ? value < lo
                        ? "red"
                        : value > hi
                        ? "red"
                        : ""
                      : "",
                  }}
                  name={index}
                  value={String(value)}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-100 text-center fw-bold"
                />
              </td>
              <td className="py-1">
                {lo} - {hi} <Markup content={unit} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
