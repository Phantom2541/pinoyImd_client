import { useEffect, useState, useCallback } from "react";
import "./style.css";
import { fullName, formatNameToObj } from "../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH } from "../../services/redux/slices/assets/persons/physicians";
import { debounce } from "lodash";
import { MDBAnimation, MDBProgress } from "mdbreact";

const InputSelect = ({ onChange = () => {}, formSubmitted, isSuccess }) => {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [didSearch, setDidSearch] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    if (isSuccess && !formSubmitted) {
      setQuery("");
      setDidSearch(false);
    }
  }, [formSubmitted, isSuccess]);

  // 🔁 Debounced search
  const debouncedSearch = useCallback(
    debounce((value) => {
      const key = formatNameToObj(value);
      dispatch(SEARCH({ token, key })).then((action) => {
        const { payload = {} } = action || {};
        setResults(payload?.payload || []);
        setIsSearching(false);
      });
    }, 500),
    [dispatch, token]
  );

  useEffect(() => {
    if (didSearch) {
      onChange(query);
    } else {
      onChange(selectedId);
    }
  }, [didSearch, query, selectedId]);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const searchKey = value.split(",");
    const sanitizedValue = value.trim();
    const isTypingNew =
      sanitizedValue.length > 0 &&
      sanitizedValue !== query.trim() &&
      searchKey.length > 1 &&
      searchKey[1].trim();

    if (isTypingNew) {
      setIsSearching(true);
      debouncedSearch(value);
      setDidSearch(true);
      onChange(value);
    } else {
      setIsSearching(false);
    }
  };

  const handlePick = (item) => {
    const name = fullName(item.user.fullName);
    setQuery(name);
    setSelectedId(item.user._id);
    setResults([]);
    setDidSearch(false);
    onChange(name);
  };

  return (
    <div className="inputSelect-search-container">
      <input
        type="text"
        placeholder="Search physician (Last name, First name)"
        className="inputSelect-search-input form-control form-control-sm"
        value={query}
        onChange={handleInputChange}
      />

      {!isSearching ? (
        <>
          {query && results.length > 0 && (
            <ul className="inputSelect-results-list">
              {results.map((item, index) => (
                <li
                  key={index}
                  className="inputSelect-result-item"
                  onClick={() => handlePick(item)}
                >
                  <div className="inputSelect-result-content">
                    {fullName(item.user.fullName)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="inputSelect-results-list">
          {new Array(5).fill("").map((_, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default InputSelect;
