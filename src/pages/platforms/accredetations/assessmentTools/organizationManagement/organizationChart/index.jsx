import React, { useRef, useState } from "react";
import sampleOrgData from "./collections";
import { MDBIcon } from "mdbreact";
import "./style.css";
import PROFILE from "./../../../../../../assets/female.jpg";

const OrgNode = ({ node }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="orgChart-node">
      <div className="orgChart-box" onClick={() => setCollapsed(!collapsed)}>
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
              {node.children.map((child, index) => (
                <div key={index} className="orgChart-child">
                  <div className="orgChart-line-up"></div>
                  <OrgNode node={child} />
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

  const handleMouseDown = (e) => {
    const target = e.target;
    // Prevent dragging if click is inside a node box
    if (target.closest(".orgChart-box")) return;

    const container = containerRef.current;
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setScroll({ left: container.scrollLeft, top: container.scrollTop });
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
        <OrgNode node={sampleOrgData} />
      </div>
    </div>
  );
}
