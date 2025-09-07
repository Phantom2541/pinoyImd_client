import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GETPATIENTS } from "./../../../services/redux/slices/assets/persons/users";
import { Notification } from "../../searchables";
import { formatNameToObj, fullName } from "../../../services/utilities";
import { MDBIcon } from "mdbreact";
import "./style.css";
import Icons from "./icons";
import Loading from "./loading";
import Results from "./results";
import { useToasts } from "react-toast-notifications";

/**
 * EditableUser Component
 *
 * This component allows selecting and displaying a user with two modes:
 * - Read Only Mode (view)
 * - Editable Mode (input field)
 *
 * @param {boolean} readOnly - Determines the mode.
 *                             false (default) = viewing only
 *                             true  = searching and selecting a user
 *
 * @param {function} setUserId - Callback triggered when a user is selected in Toggle Mode.
 *                               Returns the selected user ID.
 *                               (Required if readOnly is true)
 *
 * @param {string} placeHolder - Input placeholder text for searching users.
 *
 * @param {object} user - User object shown by default in Editable Mode.
 *                        Must contain a unique `key` property.
 *                        (Required if readOnly is false)
 *
 *
 * @param {function} onSave - Callback triggered when the check icon is clicked in Editable Mode.
 *                            Returns the selected user ID.
 *                            (Required if readOnly is false)
 *
 * @param {boolean} formSubmitted - Works together with `isSuccess` in Editable Mode
 *                                  to auto-close the input after submission.
 *                                  (Required only if readOnly is false)
 *
 * @param {boolean} isSuccess - Works together with `formSubmitted` in Editable Mode
 *                              to auto-close the input after submission.
 *                              (Required only if readOnly is false)
 *
 * @returns {JSX.Element} The rendered EditableUser component.
 */

const EditableUser = ({
  onSave = () => {},
  setUserId = () => {},
  user = { key: "No Key" },
  readOnly = false,
  placeHolder = "Search..",
  formSubmitted = false,
  isSuccess: successUpdated = false,
  onUserNotFound = () => {},
}) => {
  const { collections } = useSelector(({ users }) => users),
    { token } = useSelector(({ auth }) => auth),
    [results, setResults] = useState([]),
    [searchKey, setSearchKey] = useState(""),
    [selected, setSelected] = useState({ key: "" }),
    [isSuccess, setIsSuccess] = useState(false),
    [hideMsg, setHideMsg] = useState(false),
    [isFetching, setIsFetching] = useState(false),
    [isEditing, setIsEditing] = useState(false),
    dispatch = useDispatch();
  const { addToast } = useToasts();

  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));

  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey) => {
        const key = formatNameToObj(searchKey);
        dispatch(GETPATIENTS({ token, key })).then(() => {
          setIsFetching(false);
          setIsSuccess(true);
          setHideMsg(false);
        });
      }, 1000),
    [token, dispatch]
  );

  useEffect(() => {
    setResults(collections);
  }, [collections]);

  useEffect(() => {
    if (!readOnly && successUpdated && !formSubmitted) {
      setIsEditing(false);
      setSelected({});
    }
  }, [readOnly, successUpdated, formSubmitted]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  //this is for readOnly false
  useEffect(() => {
    const handleCloseAll = (e) => {
      console.log("closing", instanceId, "exclude", e.detail?.excludeId);
      if (e.detail?.excludeId !== instanceId) {
        setSelected({});
        setIsEditing(false);
      }
    };
    window.addEventListener("close-all-editable", handleCloseAll);
    return () =>
      window.removeEventListener("close-all-editable", handleCloseAll);
  }, [instanceId]);

  const handleSelect = (user) => {
    setUserId(user._id);
    setSelected(user);
    setResults([]);
    if (!readOnly) {
      setHideMsg(true);
      setSearchKey(fullName(user.fullName));
    } else {
      setSearchKey("");
    }
  };

  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);
    setIsSuccess(false);
    setResults([]);

    const searchKey = _searchKey.split(",");
    if (searchKey.length > 1 && searchKey[1].trim()) {
      setIsFetching(true);
      return debouncedSearch(_searchKey);
    }
  };

  if (!readOnly && !isEditing && user?.key !== selected?.key) {
    const name = user?._id ? fullName(user.fullName) : "";
    return (
      <span
        className="cursor-pointer"
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("close-all-editable", {
              detail: { excludeId: instanceId },
            })
          );
          setSearchKey(name);
          setSelected(user);
          setIsEditing(true);
          setHideMsg(true);
          setResults([]);
        }}
      >
        {name ? fullName(user.fullName) : " Click here to select a Guardian"}
      </span>
    );
  }

  const handleCheck = () => {
    if (selected?._id === user?._id) {
      setIsEditing(false);
      setSelected({});
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }
    onSave(selected._id);
  };

  const handleClose = () => {
    setIsEditing(false);
    setSelected({});
  };
  return (
    <div className="position-relative">
      <div className="editable-user-container">
        {selected?._id && readOnly ? (
          <div className="my-">
            <span style={{ fontSize: "0.9rem" }}>
              {fullName(selected.fullName)}
            </span>
            <MDBIcon
              icon="times"
              size="sm"
              className="ml-2 text-danger mt-n3 cursor-pointer"
              title="Remove"
              onClick={() => {
                setSelected({});
              }}
            />
          </div>
        ) : (
          <div className="d-flex align-items-center">
            <Notification size="sm" didSearch={searchKey.length > 0} />
            <input
              type="text"
              placeholder={placeHolder}
              className="editable-user-input w-100 pr-5"
              value={searchKey}
              onChange={(e) => handleChange(e)}
            />

            {!readOnly && (
              <Icons
                formSubmitted={formSubmitted}
                handleCheck={handleCheck}
                handleClose={handleClose}
              />
            )}

            {isFetching ? (
              <Loading />
            ) : searchKey.length > 0 && results.length > 0 ? (
              <Results handleSelect={handleSelect} results={results} />
            ) : (
              <>
                {results.length === 0 &&
                  !hideMsg &&
                  searchKey.length > 0 &&
                  isSuccess && (
                    <ul className="editable-user-results-list">
                      <li
                        className="p-1 text-center my-1 cursor-pointer"
                        onClick={onUserNotFound}
                      >
                        <span role="img" aria-label="physician not found">
                          🚫
                        </span>
                        <span style={{ fontSize: "0.9rem" }}>
                          User Not Found. <br />
                          <span>(Click Here)</span>
                        </span>
                      </li>
                    </ul>
                  )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableUser;
