import React, { useState } from "react";
import { MDBIcon } from "mdbreact";
import sampleOrgData from "./collections";
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
  return (
    <div className="orgChart-container">
      <div className="orgChart-chart">
        <OrgNode node={sampleOrgData} />
      </div>
    </div>
  );
}
