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
  placeholder = "-",
  keyForValue, // optional
  keyForText = "",
  type = "text",
  width = "13rem",
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
  utility = {},
}) => {
  const [editedData, setEditedData] = useState({});
  const { addToast } = useToasts();
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));
  const textareaRef = useRef(null);
  const displayRef = useRef(null);

  // auto-detect editable key if not provided
  const effectiveKeyForValue =
    keyForValue || Object.keys(fieldData).find((k) => k !== "_id");

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
    if (fieldData[effectiveKeyForValue] === editedData[effectiveKeyForValue]) {
      setEditedData({});
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    } else {
      const { editingKey, ...filteredData } = editedData;
      onSave(filteredData);
      if (localUpdate) {
        setEditedData({});
      }
    }
  };

  const isEditable =
    enableEditMode &&
    effectiveKeyForValue === editedData?.editingKey &&
    fieldData?._id === editedData?._id;

  const Tag = tagMap[displayTag] || "h6";

  // dito fix:
  const rawValue = isEditable
    ? editedData[effectiveKeyForValue]
    : fieldData[keyForText || effectiveKeyForValue];

  const applyUtility = () => {
    if (typeof utility === "function") {
      return utility(rawValue);
    }
    if (typeof utility.format === "function") {
      return utility.format(rawValue);
    }
    return null;
  };

  const formattedText =
    (applyUtility() ??
      (isMoney
        ? currency.format(rawValue)
        : isCapitalize
        ? capitalize(rawValue)
        : rawValue)) ||
    "N/A";

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
              value={editedData[effectiveKeyForValue] || ""}
              onChange={({ target }) => {
                setEditedData({
                  ...editedData,
                  [effectiveKeyForValue]: target.value,
                });
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          ) : (
            <input
              placeholder={placeholder}
              style={inputStyle}
              className={className}
              value={editedData[effectiveKeyForValue] || ""}
              type={type}
              onChange={({ target }) =>
                setEditedData({
                  ...editedData,
                  [effectiveKeyForValue]: target.value,
                })
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
            width: "fit-content",
          }}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("close-all-editable", {
                detail: { excludeId: instanceId },
              })
            );
            setEditedData({
              ...fieldData,
              editingKey: effectiveKeyForValue,
            });
          }}
          className={`cursor-pointer editableFied-text ${classNameTxt}`}
        >
          {formattedText}
        </Tag>
      )}
    </div>
  );
};

export default EditableField;
