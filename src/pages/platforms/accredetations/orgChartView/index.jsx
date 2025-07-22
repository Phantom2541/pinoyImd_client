import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ENDPOINT } from "../../../../services/utilities";
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
} from "react-flow-renderer";
import CustomNode from "./../../../platforms/accounting/organizationChart/customNode";
import CustomEdge from "./../../../platforms/accounting/organizationChart/customEdge";
import "./style.css";

const nodeTypes = { customNode: CustomNode };

export default function OrgChartView() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const { activePlatform, company } = useSelector(({ auth }) => auth);

  const BANNER = `${ENDPOINT}/public/companies/${company.name}/${activePlatform?.branch?.name}/banner.png`;

  useEffect(() => {
    try {
      const storedNodes = JSON.parse(
        localStorage.getItem("savedNodes") || "[]"
      );
      const storedEdges = JSON.parse(
        localStorage.getItem("savedEdges") || "[]"
      );

      setNodes(storedNodes);
      setEdges(storedEdges);
    } catch (err) {
      console.error("Error loading org chart data:", err);
    }
  }, []);

  return (
    <div className="orgChart-view-section">
      <div className="orgChart-view-container">
        <img className="orgChart-view-img" src={BANNER} alt="Banner View" />
        <div className="orgChart-view-container-reactFlow">
          <ReactFlowProvider>
            <ReactFlowInner nodes={nodes} edges={edges} />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}

function ReactFlowInner({ nodes, edges }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodes.length > 0) {
      fitView({ padding: 0.5 });
    }
  }, [nodes, fitView]);

  const edgeTypes = {
    custom: CustomEdge,
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      fitView
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      panOnDrag={false}
      elementsSelectable={false}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      selectionOnDrag={false}
    />
  );
}
