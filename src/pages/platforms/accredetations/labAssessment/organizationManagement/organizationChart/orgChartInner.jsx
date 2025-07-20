import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MarkerType,
} from "react-flow-renderer";
import CustomNode from "./customNode";
import { fullName } from "../../../../../../services/utilities";
import { Policy } from "../../../../../../services/fakeDb";
import Header from "./header";

const nodeTypes = { customNode: CustomNode };

function normalizePosition(pos) {
  return Array.isArray(pos)
    ? pos
    : typeof pos === "string"
    ? pos.split(" / ").map((p) => p.trim())
    : [];
}

export default function OrgChartInner({ personnels }) {
  const wrapperRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const [availableNodes, setAvailableNodes] = useState([]);

  useEffect(() => {
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
        const newEdge = {
          ...params,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        };
        const newEdges = addEdge(newEdge, eds);

        setNodes((prev) => {
          const parent = prev.find((n) => n.id === params.source);
          if (!parent) return prev;

          const spacingX = 300;
          const spacingY = 300;

          const children = newEdges
            .filter((e) => e.source === parent.id)
            .map((e) => e.target);

          const exclusive = children.filter(
            (id) => newEdges.filter((e) => e.target === id).length === 1
          );

          const totalWidth = (exclusive.length - 1) * spacingX;
          const startX = parent.position.x - totalWidth / 2;

          return prev.map((node) => {
            if (exclusive.includes(node.id)) {
              const idx = exclusive.indexOf(node.id);
              return {
                ...node,
                position: {
                  x: startX + idx * spacingX,
                  y: parent.position.y + spacingY,
                },
              };
            }

            const isMultiParent =
              children.includes(node.id) && !exclusive.includes(node.id);

            if (isMultiParent) {
              return {
                ...node,
                position: {
                  x: node.position.x,
                  y: parent.position.y + spacingY * 2,
                },
              };
            }

            return node;
          });
        });

        return newEdges;
      });
    },
    [setEdges, setNodes]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    const bounds = wrapperRef.current.getBoundingClientRect();
    const parsed = JSON.parse(e.dataTransfer.getData("application/reactflow"));
    if (!parsed?.data) return;

    const position = project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
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

  const handleDragStart = (e, item) => {
    const payload = {
      id: item.id,
      type: item.type,
      data: {
        ...item.data,
        position: normalizePosition(item.data.position),
      },
    };
    e.dataTransfer.setData("application/reactflow", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="orgChart-container">
      <div className="orgChart-topbar">
        {availableNodes.map((item) => {
          const { name, title, position } = item.data;
          return (
            <div
              key={item.id}
              className="draggable-node"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <strong style={{ textTransform: "capitalize" }}>{name}</strong>
              {title && <div className="small text-muted">{title}</div>}
              {position && (
                <div className="small">{[].concat(position).join(" / ")}</div>
              )}
            </div>
          );
        })}
      </div>

      <Header />

      <div
        className="flow-area"
        ref={wrapperRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        >
          <Background color="#aaa" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
