import { useState, useMemo, useEffect } from "react";
import { MDBIcon } from "mdbreact";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH } from "../../../../../../../services/redux/slices/commerce/catalog/productGenerics";
import Loader from "./loader";
import Results from "./results";

const Search = ({ handleNext = () => {} }) => {
  const { token } = useSelector(({ auth }) => auth);
  const [generics, setGenerics] = useState([]);
  const [genericSearch, setGenericSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const dispatch = useDispatch();

  // debounce generic search
  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey) => {
        if (!searchKey.trim()) {
          setGenerics([]);
          setIsSearch(false);
          return;
        }
        setIsFetching(true);
        dispatch(SEARCH({ token, key: { searchKey } }))
          .then(({ payload }) => {
            if (payload?.payload) {
              setGenerics(payload.payload);
              setIsSearch(true);
            } else {
              setGenerics([]);
              setIsSearch(true);
            }
          })
          .finally(() => setIsFetching(false));
      }, 500),
    [dispatch, token]
  );

  useEffect(() => {
    debouncedSearch(genericSearch);
    return () => debouncedSearch.cancel();
  }, [genericSearch, debouncedSearch]);

  const clearGeneric = () => {
    setGenericSearch("");
    setGenerics([]);
  };

  return (
    <div>
      {/* Generic Search */}
      <div className="position-relative mb-3">
        <MDBIcon
          icon="search"
          className="position-absolute text-muted"
          style={{ top: "50%", left: "12px", transform: "translateY(-50%)" }}
        />
        <input
          type="text"
          className="form-control ps-5 pe-5 rounded-pill shadow-sm"
          placeholder="Search generics..."
          value={genericSearch}
          style={{ paddingLeft: "40px", paddingRight: "40px" }} // <-- fixed
          onChange={(e) => setGenericSearch(e.target.value)}
        />
        {genericSearch && (
          <MDBIcon
            icon="times"
            className="position-absolute text-muted"
            style={{
              top: "50%",
              right: "12px",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            onClick={clearGeneric}
          />
        )}
      </div>

      {isFetching && <Loader />}

      {generics.length > 0 && !isFetching && (
        <Results generics={generics} handleNext={handleNext} />
      )}

      {!isFetching && generics.length === 0 && isSearch && (
        <div className="text-center mt-3 text-muted">
          <div style={{ fontSize: "2rem" }}>🚫</div>
          <p>No results found. try another keywords.</p>
        </div>
      )}
    </div>
  );
};

export default Search;
