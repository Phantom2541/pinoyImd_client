import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBSpinner, MDBCardBody } from "mdbreact";

import Header from "./headers";
import Body from "./body";
import "./style.css";
import {
  INSOURCE,
  SETSOURCES,
  RESET,
} from "../../../../../services/redux/slices/assets/providers.js";

export default function Sales() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ taskGenerator }) => taskGenerator),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;

      // Check if the source data for the specific branchId is already in localStorage
      const storedSource = localStorage.getItem(`source_${branchId}`);

      if (storedSource) {
        // If source data is found in localStorage, use it (parse back to an object)
        const sourceData = JSON.parse(storedSource);

        // Optionally dispatch the source data to update the store
        dispatch(SETSOURCES(sourceData));
      } else {
        // If no data in localStorage, make the server request
        dispatch(INSOURCE({ token, key: { vendors: activePlatform.branchId } }))
          .then(({ payload }) => {
            // Assuming the response contains the source data in 'payload'
            const sourceData = payload.payload;
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

  return (
    <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
      <Header />
      <MDBCardBody>
        {isLoading ? (
          <div className="text-center mt-5">
            <MDBSpinner />
          </div>
        ) : (
          <Body />
        )}
      </MDBCardBody>
    </MDBCard>
  );
}
