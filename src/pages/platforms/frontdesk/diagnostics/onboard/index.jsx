import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBContainer, MDBSpinner, MDBTypography } from "mdbreact";

import Header from "./headers";
import Card from "./card";
import "./style.css";
// import { fullNameSearch } from "../../../../../services/utilities";
import {
  INSOURCE,
  SETSOURCES,
  RESET,
} from "../../../../../services/redux/slices/assets/providers.js";

export default function Sales() {
  const [searchKey, setSearchKey] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    { collections: sources } = useSelector(({ providers }) => providers),
    [sales, setSales] = useState([]),
    [view, setView] = useState("All"),
    { collections, isLoading } = useSelector(
      ({ taskGenerator }) => taskGenerator
    ),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;

      // Check if the source data for the specific branchId is already in localStorage
      const storedSource = localStorage.getItem(`source_${branchId}`);

      if (storedSource) {
        // If source data is found in localStorage, use it (parse back to an object)
        const sourceData = JSON.parse(storedSource);
        console.log("Using stored source data:", sourceData);

        // Optionally dispatch the source data to update the store
        dispatch(SETSOURCES(sourceData));
      } else {
        // If no data in localStorage, make the server request
        dispatch(INSOURCE({ token, key: { vendors: activePlatform.branchId } }))
          .then(({ payload }) => {
            // Assuming the response contains the source data in 'payload'
            const sourceData = payload.payload;
            console.log("Fetching source data:", sourceData);

            // Store the fetched data in localStorage for future use
            localStorage.setItem(
              `source_${branchId}`,
              JSON.stringify(sourceData)
            );
          })
          .catch((error) => {
            console.error("Error fetching source data:", error);
          });
      }

      // Cleanup function
      return () => {
        dispatch(RESET());
      };
    }
  }, [token, dispatch, activePlatform]);

  useEffect(() => {
    console.log("sources", sources);
  }, [sources]);

  useEffect(() => {
    setSales(collections);
  }, [collections]);

  //Set fetched data for mapping
  useEffect(() => {
    if (!!collections.length) {
      // const _collections = collections.map((c, i) => ({
      //   ...c,
      //   page: collections.length - i,
      // }));
      // if (didSearch) {
      //   setSales(fullNameSearch(searchKey, _collections, "customerId"));
      // } else {
      //   setSales(
      //     view === "All"
      //       ? _collections
      //       : _collections.filter(
      //           ({ perform }) => perform === view.toLowerCase()
      //         )
      //   );
      // }
    }
  }, [collections, view, searchKey]);

  return (
    <MDBContainer fluid>
      <Header
        length={sales.length}
        view={view}
        setView={setView}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <div className="sales-card-wrapper mt-3">
        {!sales.length && !isLoading && (
          <MDBTypography noteColor="info" note>
            Sales are emptys
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
