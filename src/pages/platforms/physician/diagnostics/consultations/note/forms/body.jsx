import { useState, useEffect } from "react";
import EditableService from "../../../../../../../components/customizable/searchServices";
import sectionsConfig from "./data.json";
import { useDispatch, useSelector } from "react-redux";
import { SetPATIENT } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
const RequestForm = () => {
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const [other, setOther] = useState(""); // hiwalay na input para sa "Other"'
  const dispatch = useDispatch();

  const { consultation = {} } = appointment;
  const { request = {} } = consultation || {};
  const { services = [] } = request;
  const toggleItem = (item) => {
    var _services = [...(services || [])];

    // siguraduhin array ang ids
    const ids = Array.isArray(item.id) ? item.id : [item.id];

    // check kung kompleto nang naka-select lahat ng ids
    const hasAll = ids.every((id) => _services.includes(id));

    if (hasAll) {
      // alisin lahat ng ids na nasa group
      _services = _services.filter((x) => !ids.includes(x));
    } else {
      // idagdag yung wala pa (prevent duplicates)
      const toAdd = ids.filter((id) => !_services.includes(id));
      _services = [..._services, ...toAdd];
    }

    dispatch(
      SetPATIENT({
        ...appointment,
        consultation: {
          ...consultation,
          request: { ...request, services: _services },
        },
      })
    );
  };

  return (
    <tbody>
      <tr>
        <td colSpan={3} style={testCellStyle}>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              {sectionsConfig.slice(0, 3).map((sec) => (
                <Section
                  key={sec.title}
                  {...sec}
                  selections={services}
                  toggleItem={toggleItem}
                />
              ))}
            </div>

            <div style={{ flex: 1 }}>
              {sectionsConfig.slice(3).map((sec) => (
                <Section
                  key={sec.title}
                  {...sec}
                  selections={services}
                  toggleItem={toggleItem}
                />
              ))}
            </div>
          </div>
          {/* Other (separate searchable input) */}
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                marginBottom: "8px",
              }}
            >
              Other
            </div>
            <EditableService onSelect={setOther} displayName="name" />
          </div>
        </td>
      </tr>
    </tbody>
  );
};

const Section = ({
  title,
  items,
  selections,
  toggleItem,
  indentItems = [],
}) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "8px" }}>
      {title}
    </div>

    {items.map((item, idx) => {
      const key = Array.isArray(item.id) ? item.id.join("-") : item.id;
      const checked = Array.isArray(item.id)
        ? item.id.every((id) => selections.includes(id))
        : selections.includes(item.id);

      return (
        <CheckboxRow
          key={key}
          label={item.label}
          checked={checked}
          onClick={() => toggleItem(item)}
          indent={indentItems.includes(idx)}
        />
      );
    })}
  </div>
);

const CheckboxRow = ({ label, checked, onClick, indent }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      marginBottom: "6px",
      fontSize: "0.9rem",
      marginLeft: indent ? "20px" : 0,
    }}
    onClick={onClick}
  >
    <div style={checkboxBox}>{checked ? "✓" : ""}</div>
    <span>{label}</span>
  </div>
);

const testCellStyle = {
  verticalAlign: "top",
  border: "1px solid #000",
  padding: "10px",
};
const checkboxBox = {
  width: "16px",
  height: "16px",
  border: "1.5px solid #000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
  userSelect: "none",
};

export default RequestForm;
