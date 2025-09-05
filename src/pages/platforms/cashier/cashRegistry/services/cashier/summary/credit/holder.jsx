import { useEffect, useMemo, useState } from "react";
import { Notification } from "../../../../../../../../components/searchables";
import { SEARCH as SEARCH_PHYSICIAN } from "../../../../../../../../services/redux/slices/assets/persons/physicians";
import { SEARCH as SEARCH_PERSONNELS } from "../../../../../../../../services/redux/slices/assets/persons/personnels";
import {
  employment,
  formatNameToObj,
  fullName,
} from "../../../../../../../../services/utilities";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { MDBAnimation, MDBIcon, MDBProgress } from "mdbreact";

import "./style.css";
import { Policy } from "../../../../../../../../services/fakeDb";
const emoji = {
  physician: {
    male: "👨‍⚕️",
    female: "👩‍⚕️",
  },
  employee: {
    male: "👨‍🔬",
    female: "👩‍🔬",
  },
  bm: {
    male: "👨‍💼",
    female: "👩‍💼",
  },
};

const notFound = {
  employee: "Employee",
  physician: "Physician",
  bm: "Stock Holder",
};
const Holder = ({ refNo = {}, setRefNo = () => {} }) => {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { searchResults: physicians } = useSelector(
    ({ physicians }) => physicians
  );
  const { searchResults: personnels } = useSelector(
    ({ personnels }) => personnels
  );
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selected, setSelected] = useState({});
  const dispatch = useDispatch();

  const { careOf: credit = {} } = refNo || {};
  const { category: holder = "" } = credit;

  const debouncedSearch = useMemo(
    () =>
      debounce((searchKey) => {
        const bannedStats = employment.nonEmployed.map(({ abbr }) => abbr);
        const employeesIDS = Policy.getDesignationIDS(
          activePlatform.department
        );
        const boardIDS = Policy.getBoardMembersIds();
        const key = formatNameToObj(searchKey);
        const SEARCH =
          holder === "physician"
            ? SEARCH_PHYSICIAN({
                token,
                key: { ...key, branchID: activePlatform?.branchId },
              })
            : SEARCH_PERSONNELS({
                token,
                key: {
                  ...key,
                  branchID: activePlatform?.branchId,
                  bannedStats,
                  designations: holder === "employee" ? employeesIDS : boardIDS,
                },
              });
        dispatch(SEARCH).then(() => {
          setIsFetching(false);
          setIsSuccess(true);
        });
      }, 1000),
    [token, dispatch, activePlatform, holder]
  );

  useEffect(() => {
    if (holder) {
      //reset the selected after changing the holder
      setSelected({});
      setResults([]);
      setQuery("");
    }
  }, [holder]);
  useEffect(() => {
    setResults(holder === "physician" ? physicians : personnels);
  }, [physicians, personnels, holder]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const _searchKey = e.target.value;
    setQuery(_searchKey);
    setIsSuccess(false);
    setResults([]);
    const searchKey = _searchKey.split(",");
    if (searchKey.length > 1 && searchKey[1].trim()) {
      setIsFetching(true);
      return debouncedSearch(_searchKey);
    }
  };

  const handleSelect = (user) => {
    setSelected(user);
    setRefNo({ ...refNo, careOf: { ...refNo.careOf, user: user._id } });
  };
  return (
    <tr>
      <td colSpan={2} className="p-1">
        <div className="position-relative">
          <div className="holder-search-container">
            {selected._id ? (
              <div className="my-">
                <span style={{ fontSize: "0.9rem" }} className="text-primary">
                  {fullName(selected.fullName)}
                </span>
                <MDBIcon
                  icon="times"
                  size="sm"
                  className="ml-2 text-danger mt-n3 cursor-pointer"
                  title="Remove"
                  onClick={() => {
                    setSelected({});
                    setRefNo({
                      ...refNo,
                      careOf: { ...refNo.careOf, user: "" },
                    });
                  }}
                />
              </div>
            ) : (
              <div className="d-flex align-items-center">
                <Notification size="sm" didSearch={query.length > 0} />
                <input
                  type="search"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => handleChange(e)}
                />

                {isFetching ? (
                  <div className="holder-results-list">
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
                        />
                      </MDBAnimation>
                    ))}
                  </div>
                ) : query.length > 0 && results.length > 0 ? (
                  <ul className="holder-results-list">
                    {results.map((item, index) => (
                      <li
                        key={index}
                        className="holder-result-item"
                        onClick={() => handleSelect(item?.user)}
                      >
                        <div className="holder-result-content">
                          <span style={{ fontSize: "1.1rem" }}>
                            {emoji?.[holder]?.[
                              item?.user?.isMale ? "male" : "female"
                            ] || ""}
                          </span>
                          {fullName(item?.user?.fullName)}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    {results.length === 0 && query.length > 0 && isSuccess && (
                      <ul className="holder-results-list">
                        <li className="p-1 text-center my-1">
                          <span role="img" aria-label="physician not found">
                            🚫
                          </span>
                          <span style={{ fontSize: "0.9rem" }}>
                            {notFound?.[holder] || ""} Not Found. <br />
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
      </td>
    </tr>
  );
};

export default Holder;
