import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import "./style.css";
import { get, isEmpty } from "lodash";
import utils from "./utils";
import React, { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import ConfirmButtons from "./confirmButtons";
import { capitalize, currency } from "../../../services/utilities";

/**
 * EditableSelect is a dynamic select component with support for:
 * - Single or multiple selection
 * - Inline editing
 * - Optional label, search, and formatting
 * - Predefined selected values
 * - Support for monetary display, blacklisting, whitelisting, and custom logic
 *
 * Props:
 * @param {Array} collections - List of option values (either primitive or objects).
 * @param {string|number} preValue - Pre-selected value (for single selection).
 * @param {Array} preValues - Pre-selected values (for multi-selection).
 * @param {boolean} getObject - If true, returns full object instead of value on select.
 * @param {boolean} allowObjectValue - If true, allows complex objects as select values.
 * @param {string} label - Optional label to display above the select.
 * @param {string} keyForValue - Key to use for option value mapping (e.g., "id").
 * @param {string} keyForText - Key to use for option label mapping (e.g., "name").
 * @param {string} className - Custom class for select wrapper.
 * @param {string} inputClassName - Custom class for the select input display.
 * @param {boolean} disableAll - Disables all options.
 * @param {boolean} hideLabel - Hides the select label.
 * @param {boolean} multiple - Enables multiple selection mode.
 * @param {boolean} isEditable - Enables inline editing (toggle between text and select).
 * @param {boolean} blacklisted - Disables all options except those in preValues.
 * @param {boolean} whitelisted - Enables only the options in preValues.
 * @param {Object} disableByKey - An object where keys are values to disable, value is boolean.
 * @param {boolean} disableSearch - Disables search functionality inside the dropdown.
 * @param {boolean} isMoney - Formats value using currency display if true.
 * @param {boolean} formSubmitted - Indicates whether the parent form was submitted.
 * @param {Function} onChange - Callback when selection changes.
 * @param {Function} onSave - Callback when user confirms value change.
 * @param {Object} fieldData - Original field data for comparison/edit tracking.
 * @param {Object} selectStyle - Inline styles for the select wrapper.
 */
export default function EditableSelect({
  collections = [],
  preValue = "",
  preValues = [],
  fieldData = {},
  selectStyle = {},
  getObject = false,
  allowObjectValue = false, // if true its mean the value is  a object because we have a emoji so hinid na niya ichecheck kung object ba yung value irerender parin niya
  label,
  title = "",
  keyForValue,
  keyForText,
  className = "",
  classNameTxt = "",
  inputClassName = "",
  parentClassName = "d-flex align-items-center",
  disableAll = false,
  hideLabel = false,
  multiple = false,
  isEditable = false, // New prop to control single or multiple updates
  blacklisted = false,
  whitelisted = false,
  disableByKey = {},
  disableSearch = false,
  isMoney = false,
  formSubmitted = false,
  iSuccess = false,
  animationStyle = { width: "100%" },
  animation = false,
  isCapitalize = true,
  displayTag = "small", //this is for editable display value tag
  startOpen = false,
  onChange = () => {},
  onClose = () => {},
  onSave = () => {}, //this function is use to editable mode to get the edited data
  _key = "",
}) {
  const [editedData, setEditedData] = useState(null);
  const { addToast } = useToasts();

  const isDisableByKey = Object.keys(disableByKey)?.length;

  // Generate unique ID per instance
  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    if (!formSubmitted) {
      setEditedData({});
    }
  }, [formSubmitted, iSuccess]);

  // 🔊 Listen to "close-all-editable" to reset own state
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

  useEffect(() => {
    if (!isEditable || !startOpen || !fieldData?._id || !keyForValue) return;

    setEditedData((prev) => {
      if (
        prev?.editingKey === keyForValue &&
        prev?._id === fieldData?._id
      ) {
        return prev;
      }

      return { ...fieldData, editingKey: keyForValue };
    });
  }, [fieldData, isEditable, keyForValue, startOpen]);

  const handleSelection = (array) => {
    if (multiple) {
      const selectedItems = getObject
        ? collections?.filter((c) =>
            array.includes(String(c[keyForValue] || c))
          )
        : array;

      return !isEditable
        ? onChange(selectedItems)
        : setEditedData({ ...editedData, [keyForValue]: selectedItems });
    }

    const selectedItem = getObject
      ? collections?.find(
          (choice) => String(choice[keyForValue] || choice) === String(array[0])
        )
      : array[0];

    return !isEditable
      ? onChange(selectedItem)
      : setEditedData({
          ...editedData,
          [keyForValue ? keyForValue : "value"]: selectedItem,
        });
  };

  const handleCheck = () => {
    if (String(fieldData[keyForValue]) === String(editedData?.[keyForValue])) {
      setEditedData({});
      onClose();
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    } else {
      const { editingKey, ...rest } = editedData; // tanggalin yung keyForValue
      onSave(rest);
      onClose();
    }
  };

  const editMode =
    isEditable &&
    keyForValue === editedData?.editingKey &&
    editedData?._id === fieldData?._id;

  const showSelect = !isEditable ? true : editMode;
  return (
    <div
      className={parentClassName}
      style={{
        ...(animation &&
          showSelect && { position: "absolute", ...animationStyle }),
      }}
    >
      {showSelect ? (
        <div
          className={`d-flex align-items-center w-100 ${
            animation && showSelect && "editableSelect-zoom-in"
          } `}
          style={{
            ...selectStyle,
          }}
        >
          <MDBSelect
            label={!hideLabel && label}
            getValue={handleSelection}
            key={
              _key || JSON.stringify(isEmpty(preValues) ? preValue : preValues)
            }
            className={`${className} w-100 p-0 m-0`}
            multiple={multiple}
            color="primary"
            required={true}
          >
            <MDBSelectInput
              className={inputClassName}
              required
              selected={utils.getSelectedText({
                preValue: preValue ? preValue : fieldData[keyForValue],
                keyForText,
                keyForValue,
                getObject,
                multiple,
                preValues,
                collections,
              })}
            />

            <MDBSelectOptions
              search={utils.disableSearch(disableSearch, collections)}
            >
              {collections?.map((choice, index) => {
                const isCollectionsOfObjects =
                  utils.isArrayOfObjects(collections);
                const value =
                  keyForValue && isCollectionsOfObjects
                    ? String(choice[keyForValue]) || ""
                    : choice;
                let text = isCollectionsOfObjects
                  ? get(choice, keyForText)
                  : choice;

                if (typeof text === "object" && !allowObjectValue) {
                  console.warn(
                    "%c[Select] Invalid Values:",
                    "color: orange; font-weight: bold;",
                    "Ensure 'values' prop is correctly provided."
                  );
                  return "";
                }
                return (
                  <MDBSelectOption
                    key={`${label}-${index}`}
                    className={utils.disablingChoices({
                      whitelisted,
                      blacklisted,
                      isDisableByKey,
                      disableAll,
                      preValue,
                      value,
                      disableByKey,
                      obj: choice,
                      preValues,
                    })}
                    checked={utils.isChecked(
                      value,
                      multiple,
                      preValues,
                      preValue
                    )}
                    value={String(value) || "N/A"}
                  >
                    {(isCapitalize ? capitalize(text) : text) || "N/A"}
                  </MDBSelectOption>
                );
              })}
            </MDBSelectOptions>
          </MDBSelect>
          <ConfirmButtons
            isEditMode={isEditable && editMode}
            formSubmitted={formSubmitted}
            handleCheck={handleCheck}
            handleClose={() => {
              setEditedData({});
              onClose();
            }}
          />
        </div>
      ) : (
        React.createElement(
          displayTag,
          {
            title,
            className: `cursor-pointer ${classNameTxt}`,
            onClick: () => {
              window.dispatchEvent(
                new CustomEvent("close-all-editable", {
                  detail: { excludeId: instanceId },
                })
              );
              setEditedData({ ...fieldData, editingKey: keyForValue });
            },
          },
          isMoney
            ? currency.format(utils.getValue(keyForText, fieldData))
            : (isCapitalize
                ? capitalize(utils.getValue(keyForText, fieldData))
                : utils.getValue(keyForText, fieldData)) || "N/A"
        )
      )}
    </div>
  );
}
