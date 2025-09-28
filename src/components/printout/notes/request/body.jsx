import sectionsConfig from "./data.json";
const RequestForm = ({ note = {} }) => {
  const { consultation = {} } = note;
  const { request = {} } = consultation || {};
  const { services = [] } = request;

  return (
    <tbody>
      <tr>
        <td colSpan={3} style={testCellStyle}>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              {sectionsConfig.slice(0, 3).map((sec) => (
                <Section key={sec.title} {...sec} selections={services} />
              ))}
            </div>

            <div style={{ flex: 1 }}>
              {sectionsConfig.slice(3).map((sec) => (
                <Section key={sec.title} {...sec} selections={services} />
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
            {/* <EditableService onSelect={setOther} displayName="name" /> */}
          </div>
        </td>
      </tr>
    </tbody>
  );
};

const Section = ({ title, items, selections, indentItems = [] }) => (
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
