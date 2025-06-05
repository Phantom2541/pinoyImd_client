import { useEffect, useState } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
import { useToasts } from "react-toast-notifications";

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
 */
const EditableField = ({
  className = "form-control",
  formSubmitted = false,
  placeholder = "",
  keyForValue = "", //this key is for value
  type = "text",
  width = "",
  value = "No props for value",
  fieldData = {},
  onSave = () => {},
}) => {
  const [editedData, setEditedData] = useState({}),
    { addToast } = useToasts();

  useEffect(() => {
    if (!formSubmitted) {
      setEditedData({});
    }
  }, [formSubmitted]);

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
    keyForValue === editedData?.editingKey &&
    fieldData?._id === editedData?._id;

  return (
    <div style={{ width: isEditable && width }}>
      {isEditable ? (
        <div className="d-flex align-items-center customizable-input-container">
          <input
            placeholder={placeholder}
            className={className}
            value={editedData[keyForValue] || ""}
            type={type}
            onChange={({ target }) => {
              setEditedData({ ...editedData, [keyForValue]: target.value });
            }}
          />
          <div className="customizable-input-icons mt-2">
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
        <h6
          onClick={() =>
            setEditedData({ ...fieldData, editingKey: keyForValue })
          }
          className="cursor-pointer"
        >
          {value || "N/A"}
        </h6>
      )}
    </div>
  );
};

export default EditableField;
