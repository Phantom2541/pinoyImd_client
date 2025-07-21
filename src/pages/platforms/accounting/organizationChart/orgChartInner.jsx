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
import { fullName } from "../../../../services/utilities";
import { Policy } from "../../../../services/fakeDb";
import Header from "./header";
import Default from "./../../../../assets/iMD.png";
import { ENDPOINT } from "../../../../services/utilities";

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
  const [recentlyReturnedId, setRecentlyReturnedId] = useState(null);
  const dragOriginRef = useRef({});

  useEffect(() => {
    console.log("🟢 Nodes with position:", nodes);
  }, [nodes]);

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
        const newEdges = addEdge(
          {
            ...params,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        );

        setNodes((nds) => {
          const updatedNodeMap = {};
          const childSpacingX = 200;
          const childOffsetY = 150;
          const maxPerRow = 4; // Max children per row under one parent

          const targetNode = nds.find((n) => n.id === params.target);
          const parentNodes = newEdges
            .filter((e) => e.target === params.target)
            .map((e) => nds.find((n) => n.id === e.source))
            .filter(Boolean);

          if (!targetNode || parentNodes.length === 0) return nds;

          // === 1. Align PARENTS in same row ===
          const alignedParentY = Math.min(
            ...parentNodes.map((p) => p.position.y)
          );
          const parentSpacingX = 200;
          const parentCenterX =
            parentNodes.reduce((sum, p) => sum + p.position.x, 0) /
            parentNodes.length;
          const parentStartX =
            parentCenterX - (parentSpacingX * (parentNodes.length - 1)) / 2;

          parentNodes.forEach((parent, index) => {
            updatedNodeMap[parent.id] = {
              ...parent,
              position: {
                x: parentStartX + index * parentSpacingX,
                y: alignedParentY,
              },
            };
          });

          // === 2. Align CHILDREN of each parent by row (same y), and space X evenly ===
          parentNodes.forEach((parent) => {
            const childNodes = newEdges
              .filter((e) => e.source === parent.id)
              .map((e) => nds.find((n) => n.id === e.target))
              .filter(Boolean);

            const uniqueChildren = [
              ...new Map(childNodes.map((child) => [child.id, child])).values(),
            ];

            if (uniqueChildren.length === 0) return;

            const groupedRows = [];

            // Group children into rows if their Y values are close (within 20px)
            uniqueChildren.forEach((child) => {
              const y = child.position?.y ?? parent.position.y + childOffsetY;
              const existingRow = groupedRows.find(
                (row) => Math.abs(row.y - y) < 20
              );

              if (existingRow) {
                existingRow.children.push(child);
              } else {
                groupedRows.push({ y, children: [child] });
              }
            });

            // Align each row
            groupedRows.forEach((row) => {
              const spacingX = 200;
              const centerX = parent.position.x;
              const startX =
                centerX - ((row.children.length - 1) * spacingX) / 2;

              row.children.forEach((child, idx) => {
                updatedNodeMap[child.id] = {
                  ...child,
                  position: {
                    x: startX + idx * spacingX,
                    y: row.y, // force shared row y
                  },
                };
              });
            });
          });

          // === 3. If target node has multiple parents, center horizontally — preserve its Y ===
          if (parentNodes.length > 1) {
            const original = nds.find((n) => n.id === params.target);
            const manualY =
              original?.position?.y ?? alignedParentY + childOffsetY;

            const multiParentCenterX =
              parentNodes.reduce((sum, p) => sum + p.position.x, 0) /
              parentNodes.length;

            updatedNodeMap[params.target] = {
              ...targetNode,
              position: {
                x: multiParentCenterX,
                y: manualY, // DO NOT override Y
              },
            };
          }

          // === 3. CENTER target node if it has multiple parents ===
          if (parentNodes.length > 1) {
            const multiParentCenterX =
              parentNodes.reduce((sum, p) => sum + p.position.x, 0) /
              parentNodes.length;

            const maxY = Math.max(...parentNodes.map((p) => p.position.y));
            updatedNodeMap[params.target] = {
              ...targetNode,
              position: {
                x: multiParentCenterX,
                y: maxY + childOffsetY,
              },
            };
          }

          // === 4. Apply all updates ===
          return nds.map((node) => updatedNodeMap[node.id] || node);
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

    // Create a new unique ID for this instance
    const newId = `${parsed.id}-${Math.random().toString(36).substring(2, 6)}`;

    const newNode = {
      id: newId,
      type: parsed.type || "customNode",
      position,
      data: {
        ...parsed.data,
        position: normalizePosition(parsed.data.position),
        onReturn: () => {
          // 1. Fade out node from canvas (done in CustomNode)
          setNodes((nds) => nds.filter((n) => n.id !== newId));

          // 2. Remove x/y from returned node
          const { position, ...parsedWithoutXY } = parsed;

          // 3. Mark node as recently returned (to trigger fade-in in topbar)
          setRecentlyReturnedId(parsed.id);

          // 4. Restore to topbar
          setAvailableNodes((prev) => [parsedWithoutXY, ...prev]);

          // 5. Clear the fade-in flag after 500ms
          setTimeout(() => setRecentlyReturnedId(null), 500);
        },
      },
    };

    setNodes((nds) => [...nds, newNode]);

    // Remove from topbar by matching original id
    setAvailableNodes((prev) =>
      prev.filter((n) => (n.id === parsed.id ? false : true))
    );
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
          const { name, title, position, email } = item.data;
          return (
            <div
              key={item.id}
              className={`draggable-node ${
                recentlyReturnedId === item.id ? "node-fade-in" : ""
              }`}
              s
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <img
                className="orgChart-innerCard-image"
                src={`${ENDPOINT}/public/users/${email}/profile.jpg`}
                alt="profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Default;
                }}
              />
              <div className="orgChart-innerCard-info">
                <span
                  className="orgChart-innerCard-name"
                  style={{ textTransform: "capitalize" }}
                >
                  {name}
                </span>
                {title && (
                  <span className="orgChart-innerCard-title">{title}</span>
                )}
                {position && (
                  <span className="orgChart-innerCard-position">
                    {[].concat(position).join(" / ")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="orgChart-wrapper">
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
            onNodeDragStart={(e, node) => {
              dragOriginRef.current[node.id] = { ...node.position };
            }}
            style={{ height: "100%", width: "100%" }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          />
        </div>
      </div>
    </div>
  );
}
