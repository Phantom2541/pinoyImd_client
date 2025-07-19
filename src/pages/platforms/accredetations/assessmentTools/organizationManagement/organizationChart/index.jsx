import React, { useEffect } from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import OrgChart from "./orgNode"; // renamed your main component for clarity
import { Policy } from "../../../../../../services/fakeDb";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../../../../services/redux/slices/assets/persons/personnels";

export default function OrgChartWrapper() {
  const { activePlatform, token } = useSelector(({ auth }) => auth);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(BROWSE({ token, branchId: activePlatform.branchId })).then(
      (action) => {
        if (action.type === "assets/persons/personnels/fulfilled") {
          const { payload } = action.payload;

          // Get all designation IDs under the Laboratory department
          const labPositionIds =
            Policy.getPositionsByDepartmentName("Laboratory")?.map(
              (pos) => pos.id
            ) || [];

          // Filter personnel assigned to Laboratory positions
          const _personnel = payload?.filter(({ contract }) =>
            labPositionIds.includes(Number(contract?.designation))
          );

          console.log("_personnel (Laboratory only)", _personnel);
        }
      }
    );
  }, [token, activePlatform, dispatch]);

  return (
    <ReactFlowProvider>
      <OrgChart />
    </ReactFlowProvider>
  );
}
