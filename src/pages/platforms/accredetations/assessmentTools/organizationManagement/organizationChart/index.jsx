import React from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import OrgChart from "./orgNode"; // renamed your main component for clarity

export default function OrgChartWrapper() {
  return (
    <ReactFlowProvider>
      <OrgChart />
    </ReactFlowProvider>
  );
}
