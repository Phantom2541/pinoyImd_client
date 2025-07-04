import React from "react";
import DATA from "./fakeDB";

export default function Branch({ selectedBranches, onToggleBranch }) {
  const branches = Object.keys(DATA);

  return (
    <div className="headquarter-branch-container">
      <span>Branch List</span>
      <div className="headquarter-branch-list">
        {branches.map((branch) => {
          const branchColor = DATA[branch]?.color || "#ccc";
          const isActive = selectedBranches.includes(branch);

          return (
            <button
              key={branch}
              onClick={() => onToggleBranch(branch)}
              className="headquarter-branch-btn"
              style={{
                borderLeft: `8px solid ${branchColor}`,
                paddingLeft: "12px",
                backgroundColor: isActive ? branchColor : "white",
                color: isActive ? "white" : "#000",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isActive ? "white" : branchColor,
                  marginRight: "8px",
                }}
              />
              {branch}
            </button>
          );
        })}
      </div>
    </div>
  );
}
