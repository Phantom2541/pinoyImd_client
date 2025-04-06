import { MDBInput } from "mdbreact";
import React, { useRef, useEffect, useState } from "react";
import "./style.css";
// import { Select } from "../../customizable/select";

const USERS = [
  { _id: 1, name: "Darrel" },
  { _id: 2, name: "Julia" },
  { _id: 3, name: "Thom" },
  { _id: 4, name: "Rovan" },
  { _id: 5, name: "Jasper" },
];
const UsersSelect = () => {
  const [selected, setSelected] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const selectRef = useRef(null);

  const handleSelect = (newSelected) => {
    const _selected = [...selected];
    const index = _selected.findIndex(({ _id }) => _id === newSelected._id);
    if (index > -1) {
      _selected.splice(index, 1);
    } else {
      _selected.push(newSelected);
    }
    setSelected(_selected);
  };

  // Function to check clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="position-relative" ref={selectRef}>
        <MDBInput
          style={{ width: "100%" }}
          type="search"
          placeholder="Search..."
          autoCorrect="off"
          spellCheck={false}
          className="search-input"
        />
        {isOpen && (
          <div className="selectUsers-results">
            <ul>
              {USERS.map((user, index) => {
                const isChecked = selected.some((u) => u._id === user._id);
                return (
                  <li key={index} className={isChecked ? "selected" : ""}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      id={user._id}
                      onClick={() => handleSelect(user)}
                      className="form-check-input"
                    />
                    <label htmlFor={user._id}>{user.name}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default UsersSelect;
