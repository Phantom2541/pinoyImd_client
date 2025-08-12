import { useEffect, useState, useRef } from "react";
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
  small: "small",
};

const EditableField = ({
  displayTag = "h6",
  className = "form-control form-control-sm",
  classNameTxt = "",
  placeholder = "",
  keyForValue = "",
  keyForText = "",
  type = "text",
  width = "",
  fieldData = {},
  displayStyle = {},
  inputStyle = {},
  onSave = () => {},
  animationStyle = {},
  animation = false,
  isMoney = false,
  isCapitalize = true,
  enableEditMode = true,
  formSubmitted = false,
  localUpdate = false,
}) => {
  const [editedData, setEditedData] = useState({});
  const { addToast } = useToasts();
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const textareaRef = useRef(null);
  const displayRef = useRef(null);

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
      if (localUpdate) {
        setEditedData({});
      }
    }
  };

  const isEditable =
    enableEditMode &&
    keyForValue === editedData?.editingKey &&
    fieldData?._id === editedData?._id;

  const Tag = tagMap[displayTag] || "h6";
  const text = fieldData[keyForText || keyForValue];
  const formattedText =
    (isMoney
      ? currency.format(fieldData[keyForText || keyForValue])
      : isCapitalize
      ? capitalize(text)
      : text) || "N/A";

  // Auto-resize textarea on edit
  useEffect(() => {
    if (isEditable && type === "textarea" && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditable, type]);

  return (
    <div
      style={{
        width: isEditable && width,
        ...(animation &&
          isEditable && { position: "absolute", ...animationStyle }),
      }}
    >
      {isEditable ? (
        <div
          className={`d-flex align-items-start customizable-input-container ${
            isEditable && animation && "editableField-zoom-in"
          }`}
        >
          {type === "textarea" ? (
            <textarea
              ref={textareaRef}
              placeholder={placeholder}
              style={{
                ...inputStyle,
                width,
                overflow: "hidden",
                resize: "none",
              }}
              className={className}
              value={editedData[keyForValue] || ""}
              onChange={({ target }) => {
                setEditedData({ ...editedData, [keyForValue]: target.value });
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          ) : (
            <input
              placeholder={placeholder}
              style={inputStyle}
              className={className}
              value={editedData[keyForValue] || ""}
              type={type}
              onChange={({ target }) =>
                setEditedData({ ...editedData, [keyForValue]: target.value })
              }
            />
          )}
          <div className="customizable-input-icons">
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
        <Tag
          ref={displayRef}
          style={{
            ...displayStyle,
            whiteSpace: type === "textarea" ? "pre-wrap" : "normal",
            wordBreak: "break-word",
          }}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("close-all-editable", {
                detail: { excludeId: instanceId },
              })
            );
            setEditedData({ ...fieldData, editingKey: keyForValue });
          }}
          className={`cursor-pointer ${classNameTxt}`}
        >
          {formattedText}
        </Tag>
      )}
    </div>
  );
};

export default EditableField;
