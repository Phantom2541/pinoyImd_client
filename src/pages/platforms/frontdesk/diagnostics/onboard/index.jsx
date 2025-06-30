import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBSpinner } from "mdbreact";

import Header from "./headers";
import Body from "./body";
import "./style.css";
import {
  OUTSOURCE,
  SETSOURCES,
  RESET,
} from "../../../../../services/redux/slices/assets/providers.js";

import GenerateTask from "./generateTask/index.jsx";

import Footer from "./footer.jsx";
// import Printout from "./printout";

export default function Sales() {
  const { token, activePlatform, maxPage } = useSelector(({ auth }) => auth),
    { isLoading } = useSelector(({ taskGenerator }) => taskGenerator),
    dispatch = useDispatch();

  /**
   * Fetch source provider from the server and store it in localStorage
   * this data is not slow moving info
   */
  useEffect(() => {
    if (typeof window !== "undefined" && token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;
      const storedSource = localStorage.getItem(`outsource_${branchId}`);

      if (storedSource) {
        const sourceData = JSON.parse(storedSource);
        dispatch(SETSOURCES(sourceData));
      } else {
        dispatch(
          OUTSOURCE({
            token,
            key: { clients: activePlatform.branchId, status: "approved" },
          })
        )
          .then(({ payload }) => {
            const sourceData = payload.payload;
            localStorage.setItem(
              `outsource_${branchId}`,
              JSON.stringify(sourceData)
            );
          })
          .catch((error) => {
            console.error("Error fetching source data:", error);
          });
      }

      return () => dispatch(RESET());
    }
  }, [token, dispatch, activePlatform]);

  return (
    <MDBCard narrow className="" style={{ minHeight: "600px" }}>
      <Header />
      {isLoading ? (
        <div className="text-center mt-5">
          <MDBSpinner />
        </div>
      ) : (
        <Body />
      )}

      {!isLoading && <Footer />}
      <GenerateTask />
    </MDBCard>
  );
}
