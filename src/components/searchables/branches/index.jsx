import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { MDBIcon, MDBInput } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "./../../../services/redux/slices/assets/branches";

const Search = ({ setBranch, setRegister }) => {
  const dispatch = useDispatch();
  const { collections: branches } = useSelector(({ branches }) => branches);
  const [searchKey, setSearchKey] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (searchKey) {
      dispatch(BROWSE({ key: searchKey }));
    } else {
      dispatch(RESET());
    }
  }, [dispatch, searchKey]);

  const handleSearch = debounce((e) => {
    setSearchKey(e.target.value);
  }, 500);

  const handleSelect = (branch) => {
    setSelected(branch);
    setSearchKey("");
    dispatch(RESET());
  };

  return (
    <React.Fragment>
      <MDBInput
        label="Search Branch"
        type="text"
        value={searchKey}
        onChange={handleSearch}
      />
      <ul className="list-unstyled">
        {branches.map((branch) => (
          <li
            key={branch._id}
            onClick={() => handleSelect(branch)}
            className="p-2 border-bottom d-flex justify-content-between"
          >
            <span>{branch.name}</span>
            <MDBIcon icon="angle-right" className="text-primary" />
          </li>
        ))}
      </ul>
      {selected && (
        <p className="p-2 bg-light">
          <strong>Selected Branch:</strong> {selected.name}
        </p>
      )}
    </React.Fragment>
  );
};

export default Search;
