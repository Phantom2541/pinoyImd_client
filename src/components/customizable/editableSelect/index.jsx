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
 * A customizable select component with support for single and multiple selections, search, and more.
 *
 * @param {array} [collections=[]] - An array of objects to be used as options.
 * @param {string|number} [preValue=""] - The pre-selected value.
 * @param {array} [preValues=[]] - The pre-selected values.
 * @param {boolean} [getObject=false] - Whether to return the selected object or value.
 * @param {string} [label] - The label text.
 * @param {string} [keys] - The key to use for the value.
 * @param {string} [values] - The key to use for the text.
 * @param {string} [className=""] - The class name to apply to the wrapper element.
 * @param {string} [inputClassName=""] - The class name to apply to the input element.
 * @param {boolean} [disableAll=false] - Whether to disable all options.
 * @param {boolean} [hideLabel=false] - Whether to hide the label.
 * @param {boolean} [multiple=false] - Whether to allow multiple selections.
 * @param {boolean} [soloUpdate=false] - Whether to update a single selected item only.
 * @param {boolean} [blacklisted=false] - Whether to disable all options except the pre-selected ones.
 * @param {boolean} [whitelisted=false] - Whether to disable all options except the pre-selected ones.
 * @param {object} [disableByKey={}] - An object containing key-value pairs to disable options based on.
 * @param {boolean} [disableSearch=false] - Whether to disable the search feature.
 * @param {boolean} [formSubmitted=false] - Whether the form has been submitted.
 * @param {function} [onChange=() => {}] - The function to call when the selected value changes.
 * @param {function} [onSave=() => {}] - The function to call when the check icon is clicked.
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
  keys, // old name values
  values, // old name texts
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
        ? collections?.filter((c) => array.includes(String(c[keys] || c)))
        : array;

      return !isEditable
        ? onChange(selectedItems)
        : setEditedData({ ...editedData, [keys]: selectedItems });
    }

    const selectedItem = getObject
      ? collections?.find(
          (choice) => String(choice[keys] || choice) === String(array[0])
        )
      : array[0];

    return !isEditable
      ? onChange(selectedItem)
      : setEditedData({ ...editedData, [keys]: selectedItem });
  };

  const handleCheck = () => {
    if (String(fieldData[keys]) === String(editedData?.[keys])) {
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
    keys === editedData?.editingKey &&
    editedData?._id === fieldData?._id;

  const showSelect = !isEditable ? true : editMode;

  return (
    <div className="d-flex align-items-center w-100">
      {showSelect ? (
        <div style={selectStyle}>
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
                preValue: isEditable ? fieldData[keys] : preValue,
                values,
                keys,
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
                const key =
                  keys && utils.isArrayOfObjects(collections)
                    ? String(choice[keys]) || ""
                    : choice;
                let value = values?.includes(".")
                  ? get(choice, values)
                  : choice[values] || choice;

                if (typeof value === "object" && !allowObjectValue) {
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
                    value={String(key) || "--"}
                  >
                    {value || "--"}
                  </MDBSelectOption>
                );
              })}
            </MDBSelectOptions>
          </MDBSelect>
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
            setEditedData({ ...fieldData, editingKey: keys });
          }}
        >
          {isMoney
            ? currency(fieldData[keys])
            : capitalize(fieldData[keys]) || "N/A"}
        </h6>
      )}
      <ConfirmButtons
        isEditMode={isEditable && editMode}
        formSubmitted={formSubmitted}
        handleCheck={handleCheck}
        handleClose={() => setEditedData({})}
      />
    </div>
  );
}
