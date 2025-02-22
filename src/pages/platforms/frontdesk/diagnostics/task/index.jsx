import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBContainer, MDBSpinner, MDBTypography } from "mdbreact";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/commerce/taskGenerator.js";
import Header from "./header";
import Card from "./card";
import "./index.css";
import { fullNameSearch } from "../../../../../services/utilities";

export default function Sales() {
  const [searchKey, setSearchKey] = useState([]),
    [didSearch, setDidSearch] = useState(false),
    [sales, setSales] = useState([]),
    [view, setView] = useState("All"),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections, isLoading } = useSelector(
      ({ taskGenerator }) => taskGenerator
    ),
    dispatch = useDispatch();

  useEffect(() => {
    console.log("collections has updated:", collections);
    setSales(collections);
  }, [collections]);
  //Initial Browse and Fetch Data
  useEffect(() => {
    if (token && activePlatform?.branchId && auth._id) {
      dispatch(
        BROWSE({
          key: {
            branchId: activePlatform?.branchId,
            createdAt: new Date().setHours(0, 0, 0, 0),
          },
          token,
        })
      );
    }

    return () => {
      dispatch(RESET());
    };
  }, [token, dispatch, activePlatform, auth]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      const _collections = collections.map((c, i) => ({
        ...c,
        page: collections.length - i,
      }));

      if (didSearch) {
        setSales(fullNameSearch(searchKey, _collections, "customerId"));
      } else {
        setSales(
          view === "All"
            ? _collections
            : _collections.filter(
                ({ perform }) => perform === view.toLowerCase()
              )
        );
      }
    }
  }, [collections, view, didSearch, searchKey]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (didSearch && searchKey) setSearchKey("");

    setDidSearch(!didSearch);
  };

  return (
    <MDBContainer fluid>
      <Header
        length={sales.length}
        view={view}
        setView={setView}
        handleSearch={handleSearch}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
        didSearch={didSearch}
      />
      <div className="sales-card-wrapper mt-3">
        {!sales.length && !isLoading && (
          <MDBTypography noteColor="info" note>
            Sales are empty
          </MDBTypography>
        )}
        {isLoading ? (
          <div className="text-center mt-5">
            <MDBSpinner />
          </div>
        ) : (
          sales?.map((sale, index) => <Card item={sale} index={index} />)
        )}
      </div>
    </MDBContainer>
  );
}
