// 📁 index.jsx
import { ReactFlowProvider } from "react-flow-renderer";
import OrgChartInner from "./orgChart";

import "./style.css";

export default function OrgChart() {
  return (
    <div>
      <ReactFlowProvider>
        <OrgChartInner />
      </ReactFlowProvider>
    </div>
  );
}
