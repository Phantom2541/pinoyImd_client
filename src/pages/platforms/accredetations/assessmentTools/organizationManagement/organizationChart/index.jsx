import React, { useRef, useState } from "react";
import flatOrgData from "./flatCollections";
import { MDBIcon } from "mdbreact";
import "./style.css";
import PROFILE from "./../../../../../../assets/female.jpg";

// Build tree from hId
function buildTree(flatData) {
  const idMap = {};
  const tree = [];

  flatData.forEach((item) => {
    idMap[item.hId] = { ...item, children: [] };
  });

  flatData.forEach((item) => {
    const parentHid = item.hId.includes("-")
      ? item.hId.split("-").slice(0, -1).join("-")
      : null;

    if (parentHid && idMap[parentHid]) {
      idMap[parentHid].children.push(idMap[item.hId]);
    } else {
      tree.push(idMap[item.hId]);
    }
  });

  return tree;
}

const OrgNode = ({ node, onDrop }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleDragStart = (e) => {
    e.dataTransfer.setData("hId", node.hId);
  };

  const handleDrop = (e, position) => {
    e.preventDefault();
    const draggedHid = e.dataTransfer.getData("hId");
    onDrop(draggedHid, node.hId, position);
  };

  return (
    <div className="orgChart-node">
      <div
        className="orgChart-box"
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, "center")}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="orgChart-position bg-primary">
          <span>{node.title}</span>
        </div>
        <div className="orgChart-image">
          <img alt="profile" src={PROFILE} />
        </div>
        <div className="orgChart-details">
          <div className="orgChart-name">{node.name}</div>
          {hasChildren && (
            <div className="orgChart-toggle">
              {collapsed ? (
                <MDBIcon fas icon="chevron-down" />
              ) : (
                <MDBIcon fas icon="chevron-up" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drop left / right area for reordering */}
      <div
        className="drop-zone left"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, "left")}
      />
      <div
        className="drop-zone right"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, "right")}
      />

      {hasChildren && (
        <>
          <div
            className={`orgChart-line-down ${
              collapsed ? "fade-up-exit" : "fade-up-enter"
            }`}
          />
          <div
            className={`orgChart-children-wrapper ${
              collapsed ? "fade-up-exit" : "fade-up-enter"
            }`}
          >
            <div
              className={`orgChart-children ${
                node.children.length === 1 ? "single-child" : ""
              }`}
            >
              {node.children.map((child) => (
                <div key={child.hId} className="orgChart-child">
                  <div className="orgChart-line-up"></div>
                  <OrgNode node={child} onDrop={onDrop} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function OrganizationChart() {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [scroll, setScroll] = useState({ left: 0, top: 0 });
  const [data, setData] = useState(flatOrgData);

  const handleMouseDown = (e) => {
    if (e.target.closest(".orgChart-box")) return;
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setScroll({
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const container = containerRef.current;
    container.scrollLeft = scroll.left - dx;
    container.scrollTop = scroll.top - dy;
  };

  const handleMouseUp = () => setDragging(false);

  const onDrop = (draggedHid, targetHid, position) => {
    if (!draggedHid || draggedHid === targetHid) return;

    const dragged = data.find((d) => d.hId === draggedHid);
    const target = data.find((d) => d.hId === targetHid);
    if (!dragged || !target) return;

    const draggedParent = dragged.hId.split("-").slice(0, -1).join("-");
    const targetParent = target.hId.split("-").slice(0, -1).join("-");

    if (position === "left" || position === "right") {
      // ✅ Reorder siblings
      if (draggedParent === targetParent) {
        const siblings = data.filter(
          (d) => d.hId.split("-").slice(0, -1).join("-") === draggedParent
        );

        // Remove dragged from siblings
        const ordered = siblings
          .filter((d) => d.hId !== dragged.hId)
          .sort((a, b) => a.hId.localeCompare(b.hId));

        // Find insertion index
        const targetIndex = ordered.findIndex((d) => d.hId === targetHid);
        const insertAt = position === "left" ? targetIndex : targetIndex + 1;

        ordered.splice(insertAt, 0, dragged);

        // Renumber
        const updated = data.map((item) => {
          const isSibling = ordered.find((s) => s.hId === item.hId);
          if (isSibling) {
            const index = ordered.indexOf(isSibling) + 1;
            const newSuffix = String(index).padStart(2, "0");
            const newHid = draggedParent
              ? `${draggedParent}-${newSuffix}`
              : newSuffix;
            return { ...item, hId: newHid };
          }
          return item;
        });

        setData(updated);
        return;
      }
    }

    // ✅ Reparenting (as child)
    const children = data.filter(
      (d) =>
        d.hId.startsWith(targetHid + "-") &&
        d.hId.split("-").length === targetHid.split("-").length + 1
    );

    const max = children.reduce((acc, curr) => {
      const n = parseInt(curr.hId.split("-").at(-1), 10);
      return n > acc ? n : acc;
    }, 0);

    const nextSuffix = String(max + 1).padStart(2, "0");
    const newHid = `${targetHid}-${nextSuffix}`;

    const updated = data.map((item) =>
      item.hId === draggedHid ? { ...item, hId: newHid } : item
    );

    setData(updated);
  };

  const treeData = buildTree(data);

  return (
    <div
      ref={containerRef}
      className="orgChart-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <div className="orgChart-chart">
        {treeData.map((node) => (
          <OrgNode key={node.hId} node={node} onDrop={onDrop} />
        ))}
      </div>
    </div>
  );
}
