import { useEffect, useState } from "react";
import { MDBBadge, MDBIcon } from "mdbreact";
import "./style.css";
import { useToasts } from "react-toast-notifications";
import { currency } from "../../../services/utilities";
import { capitalize } from "lodash";

const tagMap = {
  badge: MDBBadge,
  h6: "h6",
  p: "p",
  span: "span",
};

/**
 * EditableField Component
 *
 * A reusable inline-edit input component with support for toggling between
 * display mode and editable mode on click. Useful for editable fields in tables
 * or forms with custom save handling.
 *
 * @component
 *
 * @param {string} [className="form-control"] - Custom CSS classes for the input element.
 * @param {boolean} [formSubmitted=false] - Flag indicating if the form is in submitting state (disables actions while true).
 * @param {string} [placeholder=""] - Placeholder text for the input element.
 * @param {string} [keyForValue=""] - The property key in `fieldData` to be edited.
 * @param {string} [type="text"] - The type of the input element (e.g., "text", "number", "email").
 * @param {string} [width=""] - Optional width to apply when the field is in editable mode.
 * @param {string} [value="No props for value"] - The display value shown when not in editable mode.
 * @param {object} [fieldData={}] - The full data object representing the current row or item.
 * @param {function} [onSave=() => {}] - Callback function fired when the check icon is clicked to save changes.
 *
 * @returns {JSX.Element} Editable inline input with save/cancel icons.
 *
 */
const EditableField = ({
  displayTag = "h6", //h6,badge this is available tag for this component
  className = "form-control",
  placeholder = "",
  keyForValue = "", //this key is for value
  keyForText = "",
  type = "text",
  width = "",
  fieldData = {},
  displayStyle = {},
  inputStyle = {},
  onSave = () => {},
  isMoney = false,
  enableEditMode = true,
  formSubmitted = false,
}) => {
  const [editedData, setEditedData] = useState({}),
    { addToast } = useToasts();

  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    if (!formSubmitted) {
      setEditedData({});
    }
  }, [formSubmitted]);

  useEffect(() => {
    const handleCloseAll = (e) => {
      if (e.detail?.excludeId !== instanceId) {
        setEditedData({});
      }
    };
    window.addEventListener("close-all-editable", handleCloseAll);
    return () =>
      window.removeEventListener("close-all-editable", handleCloseAll);
  }, [instanceId]);

  const handleCheck = () => {
    if (fieldData[keyForValue] === editedData[keyForValue]) {
      setEditedData({});
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    } else {
      onSave(editedData);
    }
  };

  const isEditable =
    enableEditMode &&
    keyForValue === editedData?.editingKey &&
    fieldData?._id === editedData?._id;

  const Tag = tagMap[displayTag] || "h6";
  const displayValue = (
    <Tag
      style={displayStyle}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("close-all-editable", {
            detail: { excludeId: instanceId },
          })
        );
        setEditedData({ ...fieldData, editingKey: keyForValue });
      }}
      className="cursor-pointer"
    >
      {(isMoney
        ? currency(fieldData[keyForText || keyForValue])
        : capitalize(fieldData[keyForText || keyForValue])) || "N/A"}
    </Tag>
  );

  return (
    <div style={{ width: isEditable && width }}>
      {isEditable ? (
        <div className="d-flex align-items-center customizable-input-container">
          <input
            placeholder={placeholder}
            style={inputStyle}
            className={className}
            value={editedData[keyForValue] || ""}
            type={type}
            onChange={({ target }) => {
              setEditedData({ ...editedData, [keyForValue]: target.value });
            }}
          />
          <div className="customizable-input-icons ">
            {!formSubmitted ? (
              <MDBIcon
                icon="check"
                onClick={() => handleCheck()}
                style={{
                  color: "blue",
                  fontSize: "1rem",
                  marginRight: "10px",
                  marginLeft: "7px",
                }}
                className="cursor-pointer"
              />
            ) : (
              <MDBIcon
                icon="spinner"
                pulse
                style={{
                  color: "black",
                  fontSize: "1rem",
                  marginRight: "10px",
                }}
              />
            )}
            <MDBIcon
              icon="times"
              onClick={() => setEditedData({})}
              disabled={formSubmitted}
              className="cursor-pointer"
              style={{ color: "red", fontSize: "1rem" }}
            />
          </div>
        </div>
      ) : (
        <>{displayValue}</>
      )}
    </div>
  );
};

export default EditableField;
