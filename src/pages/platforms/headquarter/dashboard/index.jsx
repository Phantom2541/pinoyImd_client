import React, { useState } from "react";
import "./style.css";
import Branch from "./branch";
import DATA from "./fakeDB";
import Body from "./body";

export default function Dashboard() {
  const allBranches = Object.keys(DATA);
  const [selectedBranches, setSelectedBranches] = useState(allBranches); // All shown by default

  const handleToggleBranch = (branch) => {
    setSelectedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
  };

  return (
    <div className="headerquarter-dashboard-section">
      <Body selectedBranches={selectedBranches} fullData={DATA} />
      <Branch
        selectedBranches={selectedBranches}
        onToggleBranch={handleToggleBranch}
      />
    </div>
  );
}
