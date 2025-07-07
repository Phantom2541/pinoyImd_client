import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";
import "./style.css";
import { capitalize, get, isEmpty } from "lodash";
import utils from "./utils";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import ConfirmButtons from "./confirmButtons";
import { currency } from "../../../services/utilities";

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
  keyForValue,
  keyForText,
  className = "",
  inputClassName = "",
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
  onChange = () => {},
  onSave = () => {}, //this function is use to editable mode to get the edited data
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
  }, [formSubmitted]);

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
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    } else {
      onSave(editedData);
    }
  };

  const editMode =
    isEditable &&
    keyForValue === editedData?.editingKey &&
    editedData?._id === fieldData?._id;

  const showSelect = !isEditable ? true : editMode;
  return (
    <div className="d-flex align-items-center w-100">
      {showSelect ? (
        <div
          className="d-flex align-items-center"
          style={{
            ...selectStyle,
          }}
        >
          <MDBSelect
            label={!hideLabel && label}
            getValue={handleSelection}
            key={JSON.stringify(isEmpty(preValues) ? preValue : preValues)}
            className={`${className} w-100`}
            multiple={multiple}
            color="primary"
          >
            <MDBSelectInput
              className={inputClassName}
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
                    value={String(value) || "--"}
                  >
                    {capitalize(text) || "--"}
                  </MDBSelectOption>
                );
              })}
            </MDBSelectOptions>
          </MDBSelect>
          <ConfirmButtons
            isEditMode={isEditable && editMode}
            formSubmitted={formSubmitted}
            handleCheck={handleCheck}
            handleClose={() => setEditedData({})}
          />
        </div>
      ) : (
        <h6
          className="cursor-pointer"
          onClick={() => {
            // 📣 Close all others before setting self to edit mode
            window.dispatchEvent(
              new CustomEvent("close-all-editable", {
                detail: { excludeId: instanceId },
              })
            );
            setEditedData({ ...fieldData, editingKey: keyForValue });
          }}
        >
          {isMoney
            ? currency(utils.getValue(keyForText, fieldData))
            : capitalize(utils.getValue(keyForText, fieldData)) || "N/A"}
        </h6>
      )}
    </div>
  );
}
