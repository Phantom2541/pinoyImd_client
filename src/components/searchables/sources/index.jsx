import { useEffect, useState, useMemo } from "react";
import { debounce, isEmpty } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  SEARCH,
  RESET,
} from "./../../../services/redux/slices/assets/branches";
import { MDBIcon } from "mdbreact";
import { globalSearch } from "./../../../services/utilities";
import Notification from "./notifications";
import {
  SetSEARCHRESULTS,
  ToggleDidSearch,
} from "../../../services/redux/slices/assets/providers";
import "./style.css";
import SummaryLoading from "../../../pages/platforms/cashier/cashRegistry/services/deals/summary/loading";

export default function Search({
  setSource = () => {},
  handleRegister = () => {},
}) {
  const { token } = useSelector((state) => state.auth);
  const { collections, isLoading, isSuccess } = useSelector(
    ({ branches }) => branches
  );
  const { filtered: providerCollections = [] } = useSelector(
    ({ providers }) => providers
  );

  const [results, setResults] = useState([]);
  const [isFetch, setIsFetch] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [didSearch, setDidSearch] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const removeExisting = collections?.filter(
      (item) =>
        !providerCollections?.some(
          ({ clients = { _id: "" } }) => clients?._id === item?._id
        )
    );
    setResults(removeExisting || []);
  }, [collections, providerCollections]);

  useEffect(() => {
    if (!isLoading && isSuccess) {
      setIsFetch(false);
      dispatch(RESET());
    }
  }, [isSuccess, isLoading, dispatch]);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey) => {
        const searchResultProviders = globalSearch(
          providerCollections,
          searchKey
        );
        dispatch(SetSEARCHRESULTS(searchResultProviders));
        dispatch(SEARCH({ token, key: searchKey }));
      }, 1000),
    [dispatch, providerCollections, token]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setSearchKey(_searchKey);
    setDidSearch(!!_searchKey);
    setIsFetch(true);
    dispatch(ToggleDidSearch(!!_searchKey));

    debouncedSearch(_searchKey);
  };

  const handleSelect = (selected) => {
    setSource(selected);
    setSearchKey("");
    dispatch(RESET());
    setDidSearch(false);
  };

  const handleSubmit = () => {
    if (!didSearch) return;
    setDidSearch(false);
    setResults([]);
    setSearchKey("");
    dispatch(ToggleDidSearch(false));
  };
  return (
    <div className="d-flex align-items-center">
      <Notification didSearch={didSearch} />
      <div className={`sources-search ${didSearch && "active"}`}>
        <div className="sources-search-suggestions">
          {isEmpty(results) && !isFetch ? (
            <div>
              <small className="grey-text">
                No branch found In Database...
              </small>
              <h6 className="text-dark">
                <p>
                  <span
                    className="text-primary mr-1 cursor-pointer"
                    onClick={() => {
                      handleRegister(searchKey);
                      setDidSearch(false);
                      setSearchKey("");
                    }}
                    style={{ textDecoration: "underline" }}
                  >
                    Click here
                  </span>
                  to register a branch
                </p>
              </h6>
            </div>
          ) : (
            <ul>
              <span className="grey-text mb-2 text-nowrap">
                {isFetch
                  ? "Searching from database"
                  : !isFetch && "External provider, not in your records"}
              </span>
              {!isFetch ? (
                <>
                  {results?.map((result) => {
                    const {
                      _id,
                      isGhost = false,
                      displayname = "",
                      name = "",
                    } = result;
                    const text = displayname || name;

                    return (
                      <li
                        onClick={() => handleSelect(result)}
                        key={_id}
                        className="d-flex"
                        title={
                          isGhost
                            ? "This is a ghost physician not registered as a user"
                            : ""
                        }
                      >
                        <MDBIcon icon="database" className="mr-2 mt-1" />
                        <small>{text}</small>
                      </li>
                    );
                  })}
                </>
              ) : (
                <SummaryLoading className={"mt-2"} rowCount={4} />
              )}
            </ul>
          )}
        </div>
        <input
          value={searchKey}
          onChange={handleChange}
          placeholder="Search..."
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className={didSearch ? "bg-danger" : "bg-primary"}
          rounded
        >
          <MDBIcon
            icon={didSearch ? "times" : "search"}
            className="search-icon"
          />
        </button>
      </div>
    </div>
  );
}
