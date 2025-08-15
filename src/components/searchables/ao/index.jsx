import React, { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  BROWSE,
  RESET,
} from "./../../../services/redux/slices/assets/persons/users";
import { MDBIcon, MDBInput, MDBAnimation, MDBProgress } from "mdbreact";
import {
  formatNameToObj,
  fullName,
  getAge,
  getGenderIcon,
} from "./../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import "../style.css";

/**
 * A Search component that allows the user to search for a patient by last name, first name, and middle name.
 * The component will make an API call to search for patients and render a list of results below the search input.
 * The user can select a patient from the list and the setPatient callback will be called with the selected patient.
 * The component also renders a button to register a new patient if no patient record is found with the search key.
 * The setSearchKey callback will be called with the search key when the button is clicked.
 *
 * @param {function} setPatient - A callback function that will be called when a patient is selected from the list.
 * @param {function} setRegister - A callback function that will be called when the button to register a new patient is clicked.
 *
 * @returns {JSX.Element} users
 */
export default function Search({
  label = "Please set a label",
  displayTag = "span",
  classNameTxt = "",
  isToggle = false,
  isRequired = false,
  displayWithLabel = true,
  formSubmitted = false,
  isSuccess = false,
  selectedUser = {},
  setUser = () => {},
  onSave = () => {},
}) {
  const { collections } = useSelector(({ users }) => users),
    { token } = useSelector((state) => state.auth),
    [users, setUsers] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [isFetch, setIsFetch] = useState(false),
    [isEditable, setIsEditable] = useState(false),
    [selected, setSelected] = useState({}),
    [searchKey, setSearchKey] = useState(""),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const [instanceId] = useState(() => Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    const handleCloseAll = (e) => {
      if (e.detail?.excludeId !== instanceId) {
        setIsEditable(false);
        setSelected({});
      }
    };
    window.addEventListener("close-all-editable", handleCloseAll);
    return () =>
      window.removeEventListener("close-all-editable", handleCloseAll);
  }, [instanceId]);

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      setIsEditable(false);
      setSelected({});
    }
  }, [formSubmitted, isSuccess]);

  useEffect(() => {
    setUsers(collections);
  }, [collections]);

  useEffect(() => {
    if (selectedUser?._id && !isToggle) {
      setSelected(selectedUser);
    }
  }, [selectedUser, isToggle]);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey) => {
        const key = formatNameToObj(searchKey);
        dispatch(BROWSE({ token, key }));
        setIsFetch(false);
      }, 1000),
    [dispatch, token]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);
  const handleChange = (e) => {
    const _searchKey = e.target.value;
    if (!_searchKey) {
      setUser({ _id: "" });
      setDidSearch(false);
    }

    setSearchKey(_searchKey);
    const searchKey = _searchKey.split(",");
    if (searchKey.length > 1 && searchKey[1].trim()) {
      setDidSearch(true);
      setIsFetch(true);
      return debouncedSearch(_searchKey);
    }
  };
  const handleSelect = (user) => {
    setUser(user);
    setSelected(user);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  if (isToggle && !isEditable) {
    return React.createElement(
      displayTag,
      {
        className: `cursor-pointer ${classNameTxt}`,
        onClick: () => {
          setIsEditable(true);
          window.dispatchEvent(
            new CustomEvent("close-all-editable", {
              detail: { excludeId: instanceId },
            })
          );
        },
      },
      fullName(selectedUser?.fullName)
    );
  }
  const close = () => {
    setSelected({});
    setUser({});
    setIsEditable(false);
  };
  const handleSave = () => {
    if (selected._id === selectedUser._id) {
      close();
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }
    onSave(selected);
  };

  return (
    <div className="position-relative">
      {selected?._id ? (
        <h6 className="d-flex align-items-center mb-3">
          {displayWithLabel && `${label}:`}
          <strong className="ml-1 ">{fullName(selected.fullName)}</strong>

          <MDBIcon
            icon="times"
            className="ml-2"
            onClick={close}
            title="Close"
            style={{ cursor: "pointer", color: "red" }}
          />
          {isToggle && (
            <MDBIcon
              icon={formSubmitted ? "spinner" : "check"}
              className="ml-2"
              pulse={formSubmitted}
              onClick={handleSave}
              title="Save"
              style={{ cursor: "pointer", color: "blue" }}
            />
          )}
        </h6>
      ) : (
        <div>
          <div className="d-flex align-items-center w-100 ">
            <div className="w-100">
              <MDBInput
                label={label}
                style={{ flexGrow: 1, minWidth: 0 }}
                required={isRequired}
                type="search"
                value={searchKey}
                onChange={handleChange}
                placeholder="Search..."
                autoCorrect="off"
                spellCheck={false}
                className="search-input "
              />
            </div>
            {isToggle && (
              <MDBIcon
                icon="times"
                className="ml-2"
                onClick={close}
                title="Close"
                style={{ cursor: "pointer", color: "red" }}
              />
            )}
          </div>
          {didSearch && (
            <div className="search-results mt-n4">
              {isFetch ? (
                new Array(5).fill("").map((_, index) => (
                  <MDBAnimation
                    key={index}
                    className="p-1 ml-2 mr-2 mt-1"
                    type="flash"
                    infinite
                    delay={`${index + 1}00ms`}
                    duration="3000ms"
                  >
                    <MDBProgress
                      color="light"
                      value={3000}
                      id="progress-table"
                    ></MDBProgress>
                  </MDBAnimation>
                ))
              ) : (
                <>
                  {users.length === 0 && (
                    <h6 className="text-center mt-2">
                      No users Found. Try another keywords
                    </h6>
                  )}
                  <ul>
                    {users?.map((user) => {
                      const { _id, fullName: fullname } = user;
                      return (
                        <li
                          onClick={() => handleSelect(user)}
                          key={_id}
                          className="text-dark text-nowrap"
                        >
                          {getGenderIcon(user.gender)} {fullName(fullname)} |{" "}
                          {getAge(user.dob)}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
