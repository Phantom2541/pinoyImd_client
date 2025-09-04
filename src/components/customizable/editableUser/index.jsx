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
 * Editable User Component
 * This component is use to select a user and the result will be display in a tag
 * @param {function} onSave - function will be called when a user is click the check icon
 * and this function will be return userID
 * @param {function} setUserId - function will be called when a select a user
 * and this function will be return userID
 * @param {object} user - this props is required if isToggle is false and make sure this user props is we have a key property
 * and make sure the value of key is unique
 * @param {boolean} isToggle - if false= editable mode else toggle mode
 * @param {string} placeHolder - the placeholder of the input
 * @param {boolean} formSubmitted - this props is required if isToggle is false to auto close the input
 * @param {boolean} isSuccess - isSuccess updated
 * @returns {JSX.Element}
 */
const EditableUser = ({
  onSave = () => {},
  setUserId = () => {},
  user = {},
  isToggle = false,
  placeHolder = "Search..",
  formSubmitted = false,
  isSuccess: successUpdated = false,
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
    if (!isToggle && successUpdated && !formSubmitted) {
      setIsEditing(false);
      setSelected({});
    }
  }, [isToggle, successUpdated, formSubmitted]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  //this is for isToggle false
  useEffect(() => {
    const handleCloseAll = (e) => {
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
    if (!isToggle) {
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

  if (!isToggle && !isEditing && user?.key !== selected?.key) {
    return (
      <span
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent("close-all-editable", {
              detail: { excludeId: instanceId },
            })
          );
          setSearchKey(fullName(user.fullName));
          setSelected(user);
          setIsEditing(true);
          setHideMsg(true);
          setResults([]);
        }}
      >
        {fullName(user.fullName)}
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
        {selected?._id && isToggle ? (
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

            {!isToggle && (
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
                      <li className="p-1 text-center my-1">
                        <span role="img" aria-label="physician not found">
                          🚫
                        </span>
                        <span style={{ fontSize: "0.9rem" }}>
                          User Not Found. <br />
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
