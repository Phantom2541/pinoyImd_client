import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow, {
  addEdge,
  useReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
} from "react-flow-renderer";
import { useToasts } from "react-toast-notifications";

import CustomNode from "./customNode";
import CustomEdge from "./customEdge";
import { Cloudinary, properFullname } from "../../../../services/utilities";
import { Policy } from "../../../../services/fakeDb";
import Default from "./../../../../assets/iMD.png";
import { v4 as uuidv4 } from "uuid";
import {
  SAVE,
  RESET,
} from "../../../../services/redux/slices/finance/bookkeeping/orgChart";
import { BROWSE } from "../../../../services/redux/slices/finance/bookkeeping/orgChart";
import Spinner from "../../../../components/spinner";

export default function OrgChart() {
  const { activePlatform, company, token, auth } = useSelector(
      ({ auth }) => auth
    ),
    { org, isLoading, formSubmitted, message, isSuccess } = useSelector(
      ({ orgChart }) => orgChart
    ),
    { isLoading: personnelLoading, collections: personnels } = useSelector(
      ({ personnels }) => personnels
    ),
    { fitView, project } = useReactFlow(),
    [nodes, setNodes, onNodesChange] = useNodesState([]),
    [edges, setEdges, onEdgesChange] = useEdgesState([]),
    [availableNodes, setAvailableNodes] = useState([]),
    [recentlyReturnedId, setRecentlyReturnedId] = useState(null),
    [hoveredNodeId, setHoveredNodeId] = useState(null),
    [layoutMode, setLayoutMode] = useState("tree"),
    wrapperRef = useRef(null),
    dragOriginRef = useRef({}),
    { addToast } = useToasts(),
    dispatch = useDispatch(),
    BANNER = `${Cloudinary.getEndpoint()}/companies/${company.name}/${
      activePlatform?.branch?.name
    }/banner`;

  const edgeTypes = useMemo(() => {
    return {
      custom: (edgeProps) => (
        <CustomEdge {...edgeProps} hoveredNodeId={hoveredNodeId} />
      ),
    };
  }, [hoveredNodeId]);

  const nodeTypes = useMemo(
    () => ({
      customNode: (props) => (
        <CustomNode {...props} setAvailableNodes={setAvailableNodes} />
      ),
    }),
    [setAvailableNodes]
  );

  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
      dispatch(RESET());
    }
  }, [auth, isSuccess, message, dispatch, addToast]);

  //get save orgchart in dbase
  useEffect(() => {
    dispatch(
      BROWSE({
        token,
        key: { branchId: activePlatform?.branchId, userId: auth._id },
      })
    );
  }, [token, dispatch, activePlatform, auth]);

  useEffect(() => {
    dispatch(BROWSE({ token, branchId: activePlatform.branchId }));
  }, [dispatch, activePlatform, token]);

  useEffect(() => {
    const { breakdown = [], edges = [], mode } = org || {};
    if (breakdown.length > 0) {
      const _breakdown = breakdown.map((b) => ({
        ...b,
        position: { x: Number(b?.gps?.x), y: Number(b?.gps?.y) },
      }));
      setNodes(_breakdown);
      setEdges(edges);
      setLayoutMode(mode);
    }
  }, [org, setEdges, setNodes]);

  useEffect(() => {
    if (!isLoading && !personnelLoading) {
      const { breakdown = [] } = org || {};
      const initialNodes = [];
      const topbarNodes = [];
      const _personnels = [...personnels].filter(
        ({ user }) => !breakdown.some(({ data }) => data.eid._id === user._id)
      );
      _personnels.forEach((p) => {
        const { user, contract, position } = p;
        const node = {
          id: uuidv4(),
          type: "customNode",
          position: position?.x != null ? position : { x: 0, y: 0 },
          data: {
            eid: user,
            position: Policy.getPositions(contract?.designation),
          },
        };

        if (position?.x != null) initialNodes.push(node);
        else topbarNodes.push(node);
      });

      setAvailableNodes(topbarNodes);

      if (initialNodes.length) {
        setTimeout(() => fitView({ padding: 0.2 }), 100);
      }
    }
  }, [isLoading, personnelLoading, personnels, fitView, org]);

  // === CONNECTION LOGIC ===
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => {
        const newEdges = addEdge(
          {
            ...params,
            type: "custom",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: "black", strokeWidth: 1.5 },
          },
          eds
        );

        if (layoutMode === "manual") {
          return newEdges;
        }

        setNodes((nds) => {
          if (layoutMode === "tree") {
            const spacingX = 200;
            const spacingY = 60;
            const nodeHeight = 100;

            const updatedNodeMap = Object.fromEntries(
              nds.map((n) => [n.id, { ...n }])
            );

            const getChildren = (parentId) =>
              newEdges
                .filter((e) => e.source === parentId)
                .map((e) => updatedNodeMap[e.target])
                .filter(Boolean);

            const layoutSubtree = (nodeId, centerX, currentY) => {
              const node = updatedNodeMap[nodeId];
              const children = getChildren(nodeId);

              if (children.length === 0) {
                node.position = { x: centerX, y: currentY };
                return { minX: centerX, maxX: centerX };
              }

              const childY = currentY + nodeHeight + spacingY;
              let subtreeWidths = [];
              let currentX = centerX;

              children.forEach((child) => {
                const layout = layoutSubtree(child.id, currentX, childY);
                subtreeWidths.push(layout);
                currentX = layout.maxX + spacingX;
              });

              const minX = subtreeWidths[0].minX;
              const maxX = subtreeWidths[subtreeWidths.length - 1].maxX;
              const midX = (minX + maxX) / 2;

              node.position = { x: midX, y: currentY };

              return { minX, maxX };
            };

            const targetIds = newEdges.map((e) => e.target);
            const rootNodes = nds.filter((n) => !targetIds.includes(n.id));

            if (rootNodes.length === 0) return nds;

            rootNodes.forEach((root) => {
              const originalRootPos = root.position;

              layoutSubtree(root.id, 0, 0);

              const newRoot = updatedNodeMap[root.id];
              const offsetX = originalRootPos.x - newRoot.position.x;
              const offsetY = originalRootPos.y - newRoot.position.y;

              const visited = new Set();

              const applyOffset = (nodeId) => {
                if (visited.has(nodeId)) return;
                visited.add(nodeId);

                const node = updatedNodeMap[nodeId];
                node.position = {
                  x: node.position.x + offsetX,
                  y: node.position.y + offsetY,
                };

                getChildren(nodeId).forEach((child) => applyOffset(child.id));
              };

              applyOffset(root.id);
            });

            return nds.map((n) => updatedNodeMap[n.id]);
          }

          if (layoutMode === "dag") {
            // DAG LOGIC
            const targetId = params.target;
            const spacingX = 200;
            const verticalGap = 100;
            const nodeHeight = 100;

            const parentNodes = newEdges
              .filter((e) => e.target === targetId)
              .map((e) => nds.find((n) => n.id === e.source))
              .filter(Boolean);

            if (!parentNodes.length) return nds;
            const targetNode = nds.find((n) => n.id === targetId);
            if (!targetNode) return nds;

            const updatedNodeMap = {};

            if (parentNodes.length > 1) {
              const spacing = spacingX;
              const alignY =
                parentNodes.reduce((sum, p) => sum + p.position.y, 0) /
                parentNodes.length;

              const centerX =
                parentNodes.reduce((sum, p) => sum + p.position.x, 0) /
                parentNodes.length;

              const startX = centerX - ((parentNodes.length - 1) * spacing) / 2;

              parentNodes.forEach((parent, i) => {
                updatedNodeMap[parent.id] = {
                  ...parent,
                  position: {
                    x: startX + i * spacing,
                    y: alignY,
                  },
                };
              });

              const parentXs = parentNodes.map(
                (p) => updatedNodeMap[p.id]?.position.x ?? p.position.x
              );
              const avgFinalX =
                parentXs.reduce((sum, x) => sum + x, 0) / parentXs.length;

              updatedNodeMap[targetNode.id] = {
                ...targetNode,
                position: {
                  x: avgFinalX,
                  y: alignY + nodeHeight + verticalGap,
                },
              };
            }

            if (parentNodes.length === 1) {
              const parent = parentNodes[0];

              const children = newEdges
                .filter((e) => e.source === parent.id)
                .map((e) => nds.find((n) => n.id === e.target))
                .filter(Boolean);

              if (children.length > 0) {
                const groupedRows = [];
                const rowThreshold = 100;
                const minVerticalGap = 160;

                children.forEach((child) => {
                  const y =
                    child.position?.y ??
                    parent.position.y + nodeHeight + verticalGap;
                  const existingRow = groupedRows.find(
                    (row) => Math.abs(row.y - y) < rowThreshold
                  );
                  if (existingRow) {
                    existingRow.children.push(child);
                  } else {
                    groupedRows.push({ y, children: [child] });
                  }
                });

                groupedRows.forEach((row, rowIndex) => {
                  const spacing = spacingX;
                  const startX =
                    parent.position.x -
                    ((row.children.length - 1) * spacing) / 2;
                  const rowY =
                    parent.position.y +
                    nodeHeight +
                    verticalGap +
                    rowIndex * minVerticalGap;

                  row.children.forEach((child, i) => {
                    updatedNodeMap[child.id] = {
                      ...child,
                      position: {
                        x: startX + i * spacing,
                        y: rowY,
                      },
                    };
                  });
                });
              }
            }

            function applyRecursiveLayout(nodeId, parentX, parentY) {
              const children = newEdges
                .filter((e) => e.source === nodeId)
                .map((e) => nds.find((n) => n.id === e.target))
                .filter(Boolean);

              if (!children.length) return;

              const spacing = spacingX;
              const startX = parentX - ((children.length - 1) * spacing) / 2;
              const childY = parentY + nodeHeight + verticalGap;

              children.forEach((child, i) => {
                const parentCount = newEdges.filter(
                  (e) => e.target === child.id
                ).length;
                if (parentCount > 1) return;

                updatedNodeMap[child.id] = {
                  ...child,
                  position: {
                    x: startX + i * spacing,
                    y: childY,
                  },
                };

                applyRecursiveLayout(child.id, startX + i * spacing, childY);
              });
            }

            Object.values(updatedNodeMap).forEach((updatedNode) => {
              applyRecursiveLayout(
                updatedNode.id,
                updatedNode.position.x,
                updatedNode.position.y
              );
            });

            const updatedEdges = newEdges.map((edge) => {
              const sourceNode =
                updatedNodeMap[edge.source] ||
                nds.find((n) => n.id === edge.source);
              const targetNode =
                updatedNodeMap[edge.target] ||
                nds.find((n) => n.id === edge.target);

              if (!sourceNode || !targetNode) return edge;

              return {
                ...edge,
                style: {
                  ...edge.style,
                  fixOffsetY: 20,
                  fixedTargetY: targetNode.position.y,
                },
              };
            });

            setEdges(updatedEdges);

            return nds.map((n) => updatedNodeMap[n.id] || n);
          }

          return nds;
        });

        return newEdges;
      });
    },
    [setEdges, setNodes, layoutMode]
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

    const newNode = {
      id: uuidv4(),
      type: parsed.type || "customNode",
      position,
      data: {
        ...parsed.data,
      },
    };
    setRecentlyReturnedId(parsed.id);
    setTimeout(() => setRecentlyReturnedId(null), 500);
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

    // 🔁 Recursive function to collect all descendants
    const getAllDescendants = (parentId, allEdges, visited = new Set()) => {
      const directChildren = allEdges
        .filter((e) => e.source === parentId)
        .map((e) => e.target)
        .filter((id) => !visited.has(id));

      directChildren.forEach((childId) => {
        visited.add(childId);
        getAllDescendants(childId, allEdges, visited);
      });

      return visited;
    };

    const descendantIds = getAllDescendants(node.id, edges);

    setNodes((nds) =>
      nds.map((n) => {
        if (descendantIds.has(n.id)) {
          return {
            ...n,
            position: {
              x: n.position.x + dx,
              y: n.position.y + dy,
            },
          };
        }
        return n;
      })
    );

    setEdges((eds) =>
      eds.map((e) => {
        if (e.target === node.id) {
          return {
            ...e,
            style: {
              ...e.style,
              fixedTargetY: node.position.y,
              fixOffsetY: 20,
            },
          };
        }

        if (e.source === node.id || descendantIds.has(e.source)) {
          const targetNode = nodes.find((n) => n.id === e.target);
          if (!targetNode) return e;
          return {
            ...e,
            style: {
              ...e.style,
              fixedTargetY: targetNode.position.y + dy,
              fixOffsetY: 20,
            },
          };
        }

        return e;
      })
    );

    dragOriginRef.current[node.id] = { ...node.position };
  };

  const handleSave = () => {
    const cleanNodes = nodes.map(({ selected, ...n }) => ({
      ...n,
      data: { ...n.data, eid: n.data.eid._id },
      gps: n.position,
    }));
    const cleanEdges = edges.map(({ selected, ...e }) => e);
    dispatch(
      SAVE({
        token,
        data: {
          layoutMode,
          breakdown: cleanNodes,
          edges: cleanEdges,
          branchId: activePlatform.branchId,
          userId: auth._id,
        },
      })
    );
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
  };

  const handleChangeLayout = (mode) => {
    setLayoutMode(mode);
    setNodes([]); // clear chart area
    setEdges([]); // clear edges
    setAvailableNodes((prev) => {
      const map = new Map(prev.map((n) => [n.id, n]));
      nodes.forEach(({ position, ...rest }) => {
        map.set(rest.data.id || rest.id, { ...rest, position: { x: 0, y: 0 } });
      });
      return Array.from(map.values());
    });
  };

  return (
    <div className="orgChart-container">
      {/* === Top Bar === */}
      <div className="orgChart-topbar">
        {personnelLoading || formSubmitted
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
              const { position, eid } = item.data;
              const { email, fullName: name, pid = "" } = eid;
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
                    src={`${Cloudinary.getEndpoint()}/${
                      pid || ""
                    }/users/${email}/profile.png`}
                    alt="profile"
                    className="orgChart-innerCard-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = Default;
                    }}
                  />
                  <div className="orgChart-innerCard-info">
                    <span className="orgChart-innerCard-name">
                      {properFullname(name)}
                    </span>
                    {name?.postnominal && (
                      <span className="orgChart-innerCard-title">
                        {name?.postnominal}
                      </span>
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
          <div className="flow-area-controls">
            <div className="flow-area-controls-saveDelete">
              <button
                className={`flow-area-controls-save bg-success ${
                  nodes.length === 0 ? "hidden" : ""
                }`}
                onClick={handleSave}
                disabled={formSubmitted}
              >
                Save <Spinner formSubmitted={formSubmitted} className="ml-1" />
              </button>
              <button
                className={`flow-area-controls-reset bg-danger ${
                  nodes.length === 0 ? "hidden" : ""
                }`}
                onClick={onReset}
              >
                Reset
              </button>
            </div>
            <div className="flow-area-controls-types">
              <button
                title="Organize as a Tree Structure"
                className={`flow-area-controls-types-tree ${
                  layoutMode === "tree" ? "disabled" : ""
                }`}
                onClick={() => handleChangeLayout("tree")}
                disabled={layoutMode === "tree"}
              >
                Tree
              </button>
              <button
                title="Organize as a Directed Acyclic Graph"
                className={`flow-area-controls-types-dag ${
                  layoutMode === "dag" ? "disabled" : ""
                }`}
                onClick={() => handleChangeLayout("dag")}
                disabled={layoutMode === "dag"}
              >
                DAG
              </button>
              <button
                title="Manually Adjust Node Positions"
                className={`flow-area-controls-types-manual ${
                  layoutMode === "manual" ? "disabled" : ""
                }`}
                onClick={() => handleChangeLayout("manual")}
                disabled={layoutMode === "manual"}
              >
                Manual
              </button>
            </div>
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
