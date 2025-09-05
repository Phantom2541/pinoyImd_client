import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Banner, Cloudinary } from "../../../../../../services/utilities";
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
} from "react-flow-renderer";
import CustomNode from "../../../../accounting/organizationChart/customNode";
import CustomEdge from "../../../../accounting/organizationChart/customEdge";
import "./style.css";
import { BROWSE } from "../../../../../../services/redux/slices/finance/bookkeeping/orgChart";

const nodeTypes = { customNode: CustomNode };

function ReactFlowInner({ nodes, edges }) {
  const { fitView } = useReactFlow();
  const edgeTypes = { custom: CustomEdge };

  // Automatically fit the view whenever nodes change
  useEffect(() => {
    if (nodes.length > 0) {
      fitView({ padding: 0.2 });
    }
  }, [nodes, fitView]);

  // Prevent zooming unless Ctrl is pressed
  useEffect(() => {
    const flowWrapper = document.querySelector(".react-flow");
    if (!flowWrapper) return;

    const handleWheel = (e) => {
      if (!e.ctrlKey) e.stopPropagation();
    };

    flowWrapper.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    return () =>
      flowWrapper.removeEventListener("wheel", handleWheel, { capture: true });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
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
  const { activePlatform, company, auth, token } = useSelector(
    ({ auth }) => auth
  );
  const { org } = useSelector(({ orgChart }) => orgChart);
  const dispatch = useDispatch();

  // Fetch org chart data
  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        key: { branchId: activePlatform?.branchId, userId: auth._id },
      })
    );
  }, [token, dispatch, activePlatform, auth]);

  // Load nodes and edges from org chart
  useEffect(() => {
    if (!org || !Array.isArray(org.breakdown) || !Array.isArray(org.edges))
      return;

    const nodesFromOrg = org.breakdown.map((n) => ({
      id: n.id,
      type: n.type || "customNode",
      position: n.gps
        ? { x: Number(n.gps.x), y: Number(n.gps.y) }
        : { x: 0, y: 0 },
      data: n.data || { eid: {} },
    }));

    const edgesFromOrg = org.edges.map((e) => ({
      ...e,
      id: e.id || `${e.source}-${e.target}`,
      type: e.type || "custom",
    }));

    setNodes(nodesFromOrg);
    setEdges(edgesFromOrg);
  }, [org]);

  // Sa component
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="orgChart-view-section">
      <div className="orgChart-view-container">
        <Banner company={company.name} branch={activePlatform?.branch?.name} />
        <div className="orgChart-view-container-reactFlow">
          <button className="orgChart-view-print" onClick={handlePrint}>
            Print
          </button>
          <ReactFlowProvider>
            <ReactFlowInner nodes={nodes} edges={edges} />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
