import React, { useCallback, useEffect, useRef, useState } from "react";
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
import Swal from "sweetalert2";
import "./style.css";
import { Policy } from "../../../../../../services/fakeDb";
import { fullName, ENDPOINT } from "../../../../../../services/utilities";
import Default from "./../../../../../../assets/iMD.png";

// Normalize position field
const normalizePosition = (pos) =>
  Array.isArray(pos)
    ? pos
    : typeof pos === "string"
    ? pos.split(" / ").map((p) => p.trim())
    : [];

function CustomNode({ data, id }) {
  const { setNodes } = useReactFlow();

  const handleClone = async () => {
    const positions = normalizePosition(data.position);
    if (positions.length < 2) return;

    const { value: selectedPosition } = await Swal.fire({
      title: "Select a position to clone",
      input: "select",
      inputOptions: Object.fromEntries(positions.map((p) => [p, p])),
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
      };

      const clonedNode = {
        ...updatedOriginal,
        id: `${id}-${Math.random().toString(36).substring(2, 9)}`,
        position: {
          x: currentNode.position.x + 100,
          y: currentNode.position.y + 100,
        },
        data: {
          ...updatedOriginal.data,
          position: [selectedPosition],
        },
      };

      return prevNodes
        .map((node) => (node.id === id ? updatedOriginal : node))
        .concat(clonedNode);
    });
  };

  const positions = normalizePosition(data.position);
  const titles = Array.isArray(data.title)
    ? [...new Set(data.title)]
    : [...new Set((data.title || "").split(",").map((s) => s.trim()))];

  const profile = `${ENDPOINT}/public/users/${data?.email}/profile.jpg`;

  useEffect(() => {
    console.log("Profile image URL:", profile);
  }, [profile]);

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
        isConnectable
      />
      <img
        className="orgChart-innerCard-image"
        src={profile}
        alt="profile"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = Default;
        }}
      />
      <div className="orgChart-innerCard-info">
        <span className="orgChart-innerCard-name">
          {data.name?.toLowerCase() || "No name"}
        </span>

        {titles.length > 0 && (
          <div className="orgChart-innerCard-title-container">
            <span className="orgChart-innerCard-title">
              {titles.join(", ")}
            </span>
          </div>
        )}

        {positions.length > 0 && (
          <div className="orgChart-innerCard-position-container">
            {positions.map((pos, idx) => (
              <span className="orgChart-innerCard-position" key={idx}>
                {pos}
                {idx < positions.length - 1 && " / "}
              </span>
            ))}
          </div>
        )}
        {positions.length > 1 && (
          <button onClick={handleClone} className="orgChart-innerCard-cloneBtn">
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
        isConnectable
      />
    </div>
  );
}

const nodeTypes = { customNode: CustomNode };

function OrgChartInner({ personnels }) {
  const wrapperRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const [availableNodes, setAvailableNodes] = useState([]);

  useEffect(() => {
    if (!Array.isArray(personnels)) return;

    const mapped = personnels.map((p, i) => {
      const { user, contract } = p;
      const name = fullName(user?.fullName)?.split(" y ")[0]?.toLowerCase();
      const title = user?.fullName?.postnominal;
      const position = Policy.getPositions(contract?.designation);
      const email = user?.email;

      return {
        id: `personnel-${i}`,
        type: "customNode",
        position: { x: 0, y: 0 },
        data: { id: `personnel-${i}`, name, title, position, email },
      };
    });

    setAvailableNodes(mapped);
  }, [personnels]);

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

        setNodes((prev) => {
          const parent = prev.find((n) => n.id === params.source);
          if (!parent) return prev;

          const childrenIds = newEdges
            .filter((e) => e.source === parent.id)
            .map((e) => e.target);

          const spacingX = 300;
          const spacingY = 300;
          const startX =
            parent.position.x - ((childrenIds.length - 1) * spacingX) / 2;

          return prev.map((node) => {
            const idx = childrenIds.indexOf(node.id);
            if (idx === -1) return node;

            return {
              ...node,
              position: {
                x: startX + idx * spacingX,
                y: parent.position.y + spacingY,
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
    const bounds = wrapperRef.current.getBoundingClientRect();
    const parsed = JSON.parse(
      event.dataTransfer.getData("application/reactflow")
    );
    if (!parsed?.data) return;

    const position = project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const newNode = {
      id: `${parsed.id}-${Math.random().toString(36).substring(2, 6)}`,
      type: parsed.type || "customNode",
      position,
      data: {
        ...parsed.data,
        position: normalizePosition(parsed.data.position),
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setAvailableNodes((prev) => prev.filter((n) => n.id !== parsed.id));
  };

  const handleDragStart = (event, item) => {
    const payload = {
      id: item.id,
      type: item.type,
      data: {
        ...item.data,
        position: normalizePosition(item.data.position),
      },
    };
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(payload)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="org-container">
      <div className="topbar">
        {availableNodes.map((item) => {
          const { name, title, position } = item.data || {};
          const titles = Array.isArray(title) ? title : [title].filter(Boolean);
          const positions = Array.isArray(position)
            ? position
            : [position].filter(Boolean);

          return (
            <div
              key={item.id}
              className="draggable-node"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <strong style={{ textTransform: "capitalize" }}>{name}</strong>
              {titles.length > 0 && (
                <div className="small text-muted">{titles.join(", ")}</div>
              )}
              {positions.length > 0 && (
                <div className="small">{positions.join(" / ")}</div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="flow-area"
        ref={wrapperRef}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        }}
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

export default function OrgChart({ personnels }) {
  return (
    <ReactFlowProvider>
      <OrgChartInner personnels={personnels} />
    </ReactFlowProvider>
  );
}
