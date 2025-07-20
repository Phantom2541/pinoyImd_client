import React, { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MarkerType,
  ReactFlowProvider,
  Handle,
  Position,
} from "react-flow-renderer";
import PROFILE from "./../../../../../../assets/female.jpg";
import { draggableNodes } from "./flatCollections";
import Swal from "sweetalert2";
import "./style.css";
// Utility to ensure array format
const normalizePosition = (pos) =>
  Array.isArray(pos)
    ? pos
    : typeof pos === "string"
    ? pos.split(" / ").map((p) => p.trim())
    : [];

// Custom node component
function CustomNode({ data, id }) {
  const { setNodes } = useReactFlow();

  const handleClone = async () => {
    const positions = normalizePosition(data.position);

    if (positions.length < 2) return;

    const { value: selectedPosition } = await Swal.fire({
      title: "Select a position to clone",
      input: "select",
      inputOptions: positions.reduce((acc, pos) => {
        acc[pos] = pos;
        return acc;
      }, {}),
      inputPlaceholder: "Choose a position",
      showCancelButton: true,
    });

    if (!selectedPosition) return;

    setNodes((prevNodes) => {
      const currentNode = prevNodes.find((node) => node.id === id);
      if (!currentNode) return prevNodes;

      const updatedOriginal = {
        ...currentNode,
        data: {
          ...currentNode.data,
          position: positions.filter((pos) => pos !== selectedPosition),
        },
        position: { ...currentNode.position }, // ensure position is a new object
      };

      const clonedNode = {
        id: `${id}-${Math.random().toString(36).substring(2, 9)}`,
        type: currentNode.type,
        position: {
          x: currentNode.position.x + 100,
          y: currentNode.position.y + 100,
        },
        data: {
          ...JSON.parse(JSON.stringify(currentNode.data)), // deep copy data
          position: [selectedPosition],
        },
      };

      return prevNodes
        .map((node) => (node.id === id ? updatedOriginal : node))
        .concat(clonedNode);
    });
  };

  const positions = normalizePosition(data.position);

  return (
    <div className="orgChart-innerCard" style={{ position: "relative" }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          top: 3,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#007bff",
          borderRadius: "50%",
          width: 12,
          height: 12,
          zIndex: 11,
        }}
        isConnectable={true}
      />

      <img className="orgChart-innerCard-image" src={PROFILE} alt="profile" />

      <div className="orgChart-innerCard-info">
        <span className="orgChart-innerCard-name">{data.name}</span>
        <div className="orgChart-innerCard-title-container">
          {Array.isArray(data.title) &&
            data.title.map((title, idx) => (
              <span className="orgChart-innerCard-title" key={idx}>
                {title}
                {idx < data.title.length - 1 && ", "}
              </span>
            ))}
        </div>
        <div className="orgChart-innerCard-position-container">
          {positions.map((pos, idx) => (
            <span className="orgChart-innerCard-position" key={idx}>
              {pos}
              {idx < positions.length - 1 && " / "}
            </span>
          ))}
        </div>
        {positions.length > 1 && (
          <button
            className="orgChart-innerCard-cloneBtn bg-primary"
            onClick={handleClone}
          >
            Clone
          </button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          bottom: 3,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#007bff",
          borderRadius: "50%",
          width: 12,
          height: 12,
          zIndex: 11,
        }}
        isConnectable={true}
      />
    </div>
  );
}

const nodeTypes = { customNode: CustomNode };

function OrgChartInner() {
  const wrapperRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  console.log("nodes", nodes);

  const [availableNodes, setAvailableNodes] = React.useState(draggableNodes);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        );

        setNodes((prevNodes) => {
          const parentNode = prevNodes.find((n) => n.id === params.source);
          if (!parentNode) return prevNodes;

          const childrenIds = newEdges
            .filter((edge) => edge.source === parentNode.id)
            .map((edge) => edge.target);

          const spacingX = 300; // horizontal spacing between siblings
          const spacingY = 300; // vertical spacing from parent to child
          const totalWidth = (childrenIds.length - 1) * spacingX;
          const startX = parentNode.position.x - totalWidth / 2;

          return prevNodes.map((node) => {
            const childIndex = childrenIds.indexOf(node.id);
            if (childIndex === -1) return node;

            return {
              ...node,
              position: {
                x: startX + childIndex * spacingX,
                y: parentNode.position.y + spacingY,
              },
            };
          });
        });

        return newEdges;
      });
    },
    [setEdges, setNodes]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    const reactFlowBounds = wrapperRef.current.getBoundingClientRect();
    const data = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );
    if (!data) return;

    const position = project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id: `${data.id}-${Math.random().toString(36).substring(2, 6)}`,
      type: "customNode",
      position,
      data: {
        ...data,
        position: normalizePosition(data.position),
      },
    };

    setNodes((nds) => [...nds, newNode]);

    // ⛔ Remove from storage panel
    setAvailableNodes((prev) => prev.filter((node) => node.id !== data.id));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDragStart = (event, item) => {
    const cleanedItem = {
      ...item,
      position: normalizePosition(item.position),
    };

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(cleanedItem)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="org-container">
      <div className="topbar">
        {availableNodes.map((item) => (
          <div
            key={item.id}
            className="draggable-node"
            draggable
            onDragStart={(event) => handleDragStart(event, item)}
          >
            <strong>{item.name}</strong>
            <div className="small">
              {normalizePosition(item.position).join(" / ")}
            </div>
          </div>
        ))}
      </div>

      <div
        className="flow-area"
        ref={wrapperRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#aaa" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function OrgChart() {
  return (
    <ReactFlowProvider>
      <OrgChartInner />
    </ReactFlowProvider>
  );
}
