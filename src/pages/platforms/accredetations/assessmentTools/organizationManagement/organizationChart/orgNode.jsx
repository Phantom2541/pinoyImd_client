import React, { useState } from "react";
import { MDBIcon } from "mdbreact";
import PROFILE from "./../../../../../../assets/female.jpg";

const OrgNode = ({ node, onDrop, onDragStart }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children?.length > 0;

  const handleDrop = (e, position) => {
    e.preventDefault();
    const hId = e.dataTransfer.getData("hId");
    const name = e.dataTransfer.getData("id");
    onDrop(hId, node.hId, position, name);
  };

  return (
    <div className="orgChart-node">
      <div
        className="orgChart-box"
        draggable
        onClick={() => setCollapsed(!collapsed)}
        onDragStart={(e) => onDragStart(e, node.hId)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, "center")}
      >
        <div className="orgChart-position bg-primary">
          <span>{node.title}</span>
        </div>
        <div className="orgChart-image">
          <img src={PROFILE} alt={node.name} />
        </div>
        <div className="orgChart-details">
          <div className="orgChart-name">{node.name}</div>
          {hasChildren && (
            <div className="orgChart-toggle">
              <MDBIcon fas icon={collapsed ? "chevron-down" : "chevron-up"} />
            </div>
          )}
        </div>
      </div>

      {["left", "right"].map((pos) => (
        <div
          key={pos}
          className={`drop-zone ${pos}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, pos)}
        />
      ))}

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
                  <div className="orgChart-line-up" />
                  <OrgNode
                    node={child}
                    onDrop={onDrop}
                    onDragStart={onDragStart}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrgNode;
