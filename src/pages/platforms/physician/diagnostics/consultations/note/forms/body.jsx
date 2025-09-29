import { useEffect, useState } from "react";
import EditableService from "../../../../../../../components/customizable/searchServices";
import sectionsConfig from "./data.json";
import { useDispatch, useSelector } from "react-redux";
import {
  SetCLUSTER,
  SetPATIENT,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { UPDATE } from "../../../../../../../services/redux/slices/diagnostics/clinic/consultations";
import { useToasts } from "react-toast-notifications";
const RequestForm = ({ togglePanel }) => {
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const { token } = useSelector(({ auth }) => auth);
  const { cluster } = useSelector(({ appointments }) => appointments);
  const { isSuccess } = useSelector(({ consultations }) => consultations);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [other, setOther] = useState([]); // hiwalay na input para sa "Other"'
  const [localServices, setLocalServices] = useState([]);
  const mergedServices = [...localServices, ...other];

  const { consultation = {} } = appointment;
  const { request = {} } = consultation || {};
  const { services = [] } = request;

  // Extract all IDs from sectionsConfig (flattening arrays like [14,15,16])
  const sectionIds = sectionsConfig.flatMap((section) =>
    section.items.flatMap((item) =>
      Array.isArray(item.id) ? item.id : [item.id]
    )
  );

  // Get the numbers in `services` that are NOT in `sectionIds`
  const uniqueServices = services.filter((id) => !sectionIds.includes(id));

  useEffect(() => {
    setLocalServices(services);
  }, [services]);

  useEffect(() => {
    if (isSuccess) {
      addToast("Request Saved successfully", { appearance: "success" });
    }
  }, [isSuccess, addToast]);

  const toggleItem = (item) => {
    let _services = [...localServices];
    const ids = Array.isArray(item.id) ? item.id : [item.id];
    const hasAll = ids.every((id) => _services.includes(id));

    if (hasAll) {
      _services = _services.filter((x) => !ids.includes(x));
    } else {
      _services = [
        ..._services,
        ...ids.filter((id) => !_services.includes(id)),
      ];
    }

    setLocalServices(_services);
  };

  const handleSave = () => {
    const payload = {
      patient: appointment.patient._id,
      appointment: appointment._id,
      ...consultation,
      request: { ...request, services: mergedServices },
    };

    dispatch(UPDATE({ data: payload, token })).then(({ payload }) => {
      const _cluster = [...cluster];
      const apptIndex = _cluster.findIndex((p) => p._id === appointment?._id);
      _cluster[apptIndex] = { ...appointment, consultation: payload };

      dispatch(SetCLUSTER(_cluster));
      dispatch(SetPATIENT({ ...appointment, consultation: payload }));
    });
    togglePanel("request");
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
                  selections={mergedServices}
                  toggleItem={toggleItem}
                />
              ))}
            </div>

            <div style={{ flex: 1 }}>
              {sectionsConfig.slice(3).map((sec) => (
                <Section
                  key={sec.title}
                  {...sec}
                  selections={mergedServices}
                  toggleItem={toggleItem}
                />
              ))}
            </div>
            <button
              className="checkup-data-note-save bg-success"
              style={{ marginBottom: "30px" }}
              onClick={handleSave}
            >
              Save
            </button>
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
            <EditableService
              onSelect={setOther}
              servicesId={uniqueServices}
              displayName="name"
            />
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
