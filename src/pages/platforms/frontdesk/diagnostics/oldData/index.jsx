import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBSpinner } from "mdbreact";

import { HUNDREDDATA } from "../../../../../services/redux/slices/commerce/pos/services/deals";
import { Services } from "../../../../../services/fakeDb";
export default function OldData() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ deals }) => deals),
    dispatch = useDispatch();

  /**
   * Fetch source provider from the server and store it in localStorage
   * this data is not slow moving info
   */
  useEffect(() => {
    console.log("outside if");

    if (token && activePlatform.department) {
      console.log("insed if");

      HUNDREDDATA({ token, data: { department: activePlatform.department } });
      console.log("collections", activePlatform.department);
    }
  }, [token, dispatch, activePlatform]);

  const btnHandler = async () => {
    for (const deal of collections) {
      const { _id, ssx, forms: oldForms, rendered = [] } = deal;
      const department =
        activePlatform.department === "Laboratory" ? "LAB" : "RAD";
      const deptIndexMap = {
        LAB: 0,
        RAD: 1,
        CLINIC: 2,
      };

      const deptIndex = deptIndexMap[department];
      const newFormKeys = Object.keys(
        Services.getTemplatesWithIntKey([], department)
      );
      const forms = {
        ...(oldForms || {}),
        [deptIndex]: [
          ...(oldForms?.[deptIndex] || []),
          ...newFormKeys.filter(
            (key) => !(oldForms?.[deptIndex] || []).includes(key)
          ),
        ],
      };

      const _forms = Services.getTemplates([], department);
      console.log("_forms", _forms);

      // Construct final data object
      const data = {
        _id,
        ssx,
        rendered: [
          ...rendered,
          {
            dept: department,
            by: auth._id,
            at: new Date().toLocaleString(),
          },
        ],
        forms,
      };

      console.log("data", data);
    }
  };

  return (
    <MDBCard narrow className="pb-3" style={{ minHeight: "600px" }}>
      <div className="text-center mt-5">
        {" "}
        {collections.length > 0 ? (
          <button onClick={btnHandler}>Generate</button>
        ) : (
          <MDBSpinner />
        )}{" "}
      </div>
    </MDBCard>
  );
}
