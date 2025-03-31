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

  /**
   * Fetch source provider from the server and store it in localStorage
   * this data is not slow moving info
   */
  useEffect(() => {
    if (token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;
      const storedSource = localStorage.getItem(`source_${branchId}`);

      if (storedSource) {
        const sourceData = JSON.parse(storedSource);
        dispatch(SETSOURCES(sourceData));
      } else {
        dispatch(INSOURCE({ token, key: { vendors: activePlatform.branchId } }))
          .then(({ payload }) => {
            const sourceData = payload.payload;
            localStorage.setItem(
              `source_${branchId}`,
              JSON.stringify(sourceData)
            );
          })
          .catch((error) => {
            console.error("Error fetching source data:", error);
          });
      }

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
