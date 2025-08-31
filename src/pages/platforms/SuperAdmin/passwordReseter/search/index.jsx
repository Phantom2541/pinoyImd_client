import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "lodash";
import {
  GETPATIENTS,
  SetCOLLECTIONS,
} from "../../../../../services/redux/slices/assets/persons/users";
import { MDBIcon } from "mdbreact";
import Notification from "./notification";
import { formatNameToObj } from "../../../../../services/utilities";

export default function Search() {
  const { token } = useSelector(({ auth }) => auth),
    [didSearch, setDidSearch] = useState(false),
    [isFetching, setIsFetching] = useState(false),
    [searchKey, setSearchKey] = useState(""),
    dispatch = useDispatch();

  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey, isEmail = false) => {
        const key = formatNameToObj(searchKey);
        dispatch(
          GETPATIENTS({
            token,
            key: { ...key, ...(isEmail && { email: searchKey }) },
          })
        ).then(() => {
          setIsFetching(false);
        });
      }, 1000),
    [token, dispatch]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const isEmail = (str) => {
    return /\S+@\S+\.\S+/.test(str); // basic email regex
  };

  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);
    const searchKey = _searchKey.split(",");
    const _isEmail = isEmail(_searchKey);
    if ((searchKey.length > 1 && searchKey[1].trim()) || _isEmail) {
      setDidSearch(true);
      return debouncedSearch(_searchKey, _isEmail);
    }
  };

  return (
    <div className="d-flex align-items-center" style={{ position: "relative" }}>
      <Notification didSearch={didSearch} />
      <div className={`searchable-search `}>
        <input
          value={searchKey}
          onChange={handleChange}
          placeholder="Search..."
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          style={{
            color: "white",
          }}
          disabled={isFetching}
          className={didSearch && !isFetching ? "bg-danger" : ""}
          onClick={
            didSearch
              ? () => {
                  setDidSearch(false);
                  setSearchKey("");
                  dispatch(SetCOLLECTIONS([]));
                }
              : () => console.log("search")
          }
        >
          <MDBIcon
            icon={didSearch && !isFetching ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
}
