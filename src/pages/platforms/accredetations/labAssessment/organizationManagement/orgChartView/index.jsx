import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ENDPOINT } from "../../../../../../services/utilities";
import ReactFlow, { ReactFlowProvider } from "react-flow-renderer";
import CustomNode from "../../../../accounting/organizationChart/customNode";
import CustomEdge from "../../../../accounting/organizationChart/customEdge";
import "./style.css";

const nodeTypes = { customNode: CustomNode };

function ReactFlowInner({ nodes, edges }) {
  const edgeTypes = { custom: CustomEdge };

  const handleInit = (instance) => {
    if (nodes.length > 0) {
      instance.fitView({ padding: 0.5 });
    }
  };

  useEffect(() => {
    const flowWrapper = document.querySelector(".react-flow");
    if (!flowWrapper) return;

    const handleWheel = (e) => {
      if (!e.ctrlKey) {
        e.stopPropagation();
      }
    };

    flowWrapper.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      flowWrapper.removeEventListener("wheel", handleWheel, {
        capture: true,
      });
    };
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      fitView
      onInit={handleInit} // ✅ correct for v10
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
