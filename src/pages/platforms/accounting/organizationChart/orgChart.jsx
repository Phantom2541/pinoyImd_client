import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactFlow, {
  addEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
} from "react-flow-renderer";
import CustomNode from "./customNode";
import CustomEdge from "./customEdge";
import { fullName } from "../../../../services/utilities";
import { Policy } from "../../../../services/fakeDb";
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

export default function OrgChart({ personnels }) {
  const wrapperRef = useRef(null);
  const dragOriginRef = useRef({});
  const { fitView, project } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [availableNodes, setAvailableNodes] = useState([]);
  const [recentlyReturnedId, setRecentlyReturnedId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const edgeTypes = {
    custom: (edgeProps) => (
      <CustomEdge {...edgeProps} hoveredNodeId={hoveredNodeId} />
    ),
  };

  const { activePlatform, company } = useSelector(({ auth }) => auth);
  const BANNER = `${ENDPOINT}/public/companies/${company.name}/${activePlatform?.branch?.name}/banner.png`;

  // === LOAD PERSONNELS ===
  useEffect(() => {
    const initialNodes = [];
    const topbarNodes = [];

    personnels.forEach((p, i) => {
      const { user, contract, position } = p;
      const name = fullName(user?.fullName)?.split(" y ")[0]?.toLowerCase();
      const node = {
        id: `personnel-${i}`,
        type: "customNode",
        position: position?.x != null ? position : { x: 0, y: 0 },
        data: {
          id: `personnel-${i}`,
          name,
          title: user?.fullName?.postnominal,
          position: Policy.getPositions(contract?.designation),
          email: user?.email,
          onReturn: () => {
            setNodes((nds) => nds.filter((n) => n.id !== `personnel-${i}`));
            setAvailableNodes((nds) => [...nds, node]);
          },
        },
      };

      if (position?.x != null) initialNodes.push(node);
      else topbarNodes.push(node);
    });

    setNodes(initialNodes);
    setAvailableNodes(topbarNodes);

    if (initialNodes.length) {
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    }
  }, [personnels, fitView, setNodes]);

  // === CONNECTION LOGIC ===
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            type: "custom",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "black", strokeWidth: 1.5, fixOffsetY: 20 },
          },
          eds
        );

        setNodes((nds) => {
          const updatedNodeMap = {};
          const childOffsetY = 150;
          const parentSpacingX = 200;

          const targetNode = nds.find((n) => n.id === params.target);
          const parentNodes = newEdges
            .filter((e) => e.target === params.target)
            .map((e) => nds.find((n) => n.id === e.source))
            .filter(Boolean);

          if (!targetNode || !parentNodes.length) return nds;

          const alignedY = Math.min(...parentNodes.map((p) => p.position.y));
          const centerX =
            parentNodes.reduce((sum, p) => sum + p.position.x, 0) /
            parentNodes.length;
          const startX =
            centerX - ((parentNodes.length - 1) * parentSpacingX) / 2;

          parentNodes.forEach((p, i) => {
            updatedNodeMap[p.id] = {
              ...p,
              position: { x: startX + i * parentSpacingX, y: alignedY },
            };
          });

          parentNodes.forEach((parent) => {
            const children = newEdges
              .filter((e) => e.source === parent.id)
              .map((e) => nds.find((n) => n.id === e.target))
              .filter(Boolean);

            const uniqueChildren = [
              ...new Map(children.map((c) => [c.id, c])).values(),
            ];

            if (!uniqueChildren.length) return;

            const groupedRows = [];

            uniqueChildren.forEach((child) => {
              const y = child.position?.y ?? parent.position.y + childOffsetY;
              const existing = groupedRows.find((r) => Math.abs(r.y - y) < 20);
              existing
                ? existing.children.push(child)
                : groupedRows.push({ y, children: [child] });
            });

            groupedRows.forEach((row) => {
              const spacingX = 200;
              const startX =
                parent.position.x - ((row.children.length - 1) * spacingX) / 2;

              row.children.forEach((child, idx) => {
                updatedNodeMap[child.id] = {
                  ...child,
                  position: { x: startX + idx * spacingX, y: row.y },
                };

                const edgeIdx = newEdges.findIndex(
                  (e) => e.source === parent.id && e.target === child.id
                );

                if (edgeIdx !== -1) {
                  newEdges[edgeIdx] = {
                    ...newEdges[edgeIdx],
                    style: {
                      ...newEdges[edgeIdx].style,
                      fixedTargetY: row.y,
                      fixOffsetY: 20,
                    },
                  };
                }
              });
            });
          });

          // Align multi-parent target
          if (parentNodes.length > 1) {
            const y = targetNode.position.y;
            updatedNodeMap[targetNode.id] = {
              ...targetNode,
              position: { x: centerX, y },
            };
          }

          return nds.map((n) => updatedNodeMap[n.id] || n);
        });

        return newEdges;
      });
    },
    [setEdges, setNodes]
  );

  // === DRAG / DROP ===
  const handleDrop = (e) => {
    e.preventDefault();
    const bounds = wrapperRef.current.getBoundingClientRect();
    const parsed = JSON.parse(e.dataTransfer.getData("application/reactflow"));
    if (!parsed?.data) return;

    const position = project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    const newId = `${parsed.id}-${Math.random().toString(36).slice(2, 6)}`;
    const newNode = {
      id: newId,
      type: parsed.type || "customNode",
      position,
      data: {
        ...parsed.data,
        position: normalizePosition(parsed.data.position),
        onReturn: () => {
          setNodes((nds) => nds.filter((n) => n.id !== newId));
          setRecentlyReturnedId(parsed.id);
          setAvailableNodes((prev) => [parsed, ...prev]);
          setTimeout(() => setRecentlyReturnedId(null), 500);
        },
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setAvailableNodes((prev) => prev.filter((n) => n.id !== parsed.id));
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        id: item.id,
        type: item.type,
        data: {
          ...item.data,
          position: normalizePosition(item.data.position),
        },
      })
    );
    e.dataTransfer.effectAllowed = "move";
  };

  const handleNodeDrag = (_, node) => {
    const origin = dragOriginRef.current[node.id];
    if (!origin) return;

    const dx = node.position.x - origin.x;
    const dy = node.position.y - origin.y;

    setNodes((nds) =>
      nds.map((n) =>
        edges.some((e) => e.source === node.id && e.target === n.id)
          ? { ...n, position: { x: n.position.x + dx, y: n.position.y + dy } }
          : n
      )
    );

    dragOriginRef.current[node.id] = { ...node.position };
  };

  const handleSave = () => {
    const cleanNodes = nodes.map(({ selected, ...n }) => n);
    const cleanEdges = edges.map(({ selected, ...e }) => e);
    localStorage.setItem("savedNodes", JSON.stringify(cleanNodes));
    localStorage.setItem("savedEdges", JSON.stringify(cleanEdges));
    alert("Chart saved!");
  };

  const onReset = () => {
    setNodes([]);
    setEdges([]);
    setAvailableNodes((prev) => {
      const map = new Map(prev.map((n) => [n.id, n]));
      nodes.forEach(({ position, ...rest }) => {
        map.set(rest.data.id || rest.id, { ...rest, position: { x: 0, y: 0 } });
      });
      return Array.from(map.values());
    });
    localStorage.removeItem("savedNodes");
    localStorage.removeItem("savedEdges");
  };

  return (
    <div className="orgChart-container">
      {/* === Top Bar === */}
      <div className="orgChart-topbar">
        {personnels.length === 0
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="draggable-node skeleton-card">
                <div className="skeleton-image" />
                <div className="orgChart-innerCard-info">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line smaller" />
                </div>
              </div>
            ))
          : availableNodes.map((item) => {
              const { name, title, position, email } = item.data;
              return (
                <div
                  key={item.id}
                  className={`draggable-node ${
                    recentlyReturnedId === item.id ? "node-fade-in" : ""
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <img
                    src={`${ENDPOINT}/public/users/${email}/profile.jpg`}
                    alt="profile"
                    className="orgChart-innerCard-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = Default;
                    }}
                  />
                  <div className="orgChart-innerCard-info">
                    <span className="orgChart-innerCard-name">{name}</span>
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

      {/* === Chart Area === */}
      <div className="orgChart-wrapper">
        <div className="organization-chart-imgContainer">
          <img
            src={BANNER}
            alt="banner"
            className="organization-chart-img"
            draggable={false}
          />
        </div>

        <div
          className="flow-area"
          ref={wrapperRef}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div
            className={`flow-area-controls ${
              nodes.length === 0 ? "hidden" : ""
            }`}
          >
            <button
              className="flow-area-controls-save bg-success"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="flow-area-controls-reset bg-danger"
              onClick={onReset}
            >
              Reset
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDrag={handleNodeDrag}
            onNodeMouseEnter={(_, node) => setHoveredNodeId(node.id)}
            onNodeMouseLeave={() => setHoveredNodeId(null)}
            onNodeDragStart={(_, node) =>
              (dragOriginRef.current[node.id] = { ...node.position })
            }
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            connectionLineStyle={{ stroke: "black", strokeWidth: 1.5 }}
            style={{ height: "100%", width: "100%" }}
          >
            <Background color="#555" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
