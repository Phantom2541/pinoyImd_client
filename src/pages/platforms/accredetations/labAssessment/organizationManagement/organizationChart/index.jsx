// 📁 index.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactFlowProvider } from "react-flow-renderer";
import OrgChartInner from "./orgChartInner";
import { BROWSE } from "../../../../../../services/redux/slices/assets/persons/personnels";
import { Policy } from "../../../../../../services/fakeDb";
import "./style.css";

export default function OrgChartWrapper() {
  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const [personnels, setPersonnels] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(BROWSE({ token, branchId: activePlatform.branchId })).then(
      (action) => {
        if (action.type === "assets/persons/personnels/fulfilled") {
          const { payload } = action.payload;
          const labPositionIds =
            Policy.getPositionsByDepartmentName("Laboratory")?.map(
              (pos) => pos.id
            ) || [];

          const _personnel = payload?.filter(({ contract }) =>
            labPositionIds.includes(Number(contract?.designation))
          );

          setPersonnels(_personnel);
        }
      }
    );
  }, [token, activePlatform, dispatch]);

  return (
    <div>
      <ReactFlowProvider>
        <OrgChartInner personnels={personnels} />
      </ReactFlowProvider>
    </div>
  );
}
