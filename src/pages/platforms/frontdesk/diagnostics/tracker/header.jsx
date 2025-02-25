import React from "react";
import { MDBIcon } from "mdbreact";
import { useSelector } from "react-redux";
import { fullName, getAge } from "../../../../../services/utilities";

export default function Header({
  patient,
  handleSearch,
  didSearch,
  searchKey,
  setSearchKey,
  patients,
  selectPatient,
}) {
  const { isLoading } = useSelector(({ users }) => users);

  const { _id, dob, fullName: fullname } = patient;

  return (
    <div className="d-flex align-items-center justify-content-between">
      <h3 className="mb-0">
        {_id ? fullName(fullname) : "Tracker"}
        {_id && getAge(dob)}
      </h3>
      <div className="d-flex align-items-center">
        <div className="cashier-instruction">
          <MDBIcon
            icon="info-circle"
            size="lg"
            className="text-info cursor-pointer"
          />
          <div>
            <p>Last name, First name y Middle name</p>
            <i>Please maintain this order when searching.</i>
          </div>
        </div>
        <form
          onSubmit={handleSearch}
          className={`cashier-search ${didSearch && "active"}`}
        >
          <div className="cashier-search-suggestions">
            {!patients.length ? (
              <small>No Patient Record found...</small>
            ) : (
              <ul>
                {patients?.map((user) => {
                  const { _id, fullName: fullname } = user;

                  return (
                    <li onClick={() => selectPatient(user)} key={_id}>
                      {fullName(fullname)}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <input
            disabled={isLoading}
            value={searchKey}
            onChange={({ target }) => setSearchKey(target.value)}
            placeholder="Search..."
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit">
            <MDBIcon
              pulse={isLoading}
              icon={isLoading ? "spinner" : didSearch ? "times" : "search"}
              className="search-icon"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
