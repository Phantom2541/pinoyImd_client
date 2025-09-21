import React, { useEffect, useState } from "react";
import "./style.css";
import Case from "../case";
import { MDBPageItem, MDBPageNav } from "mdbreact";
import { useSelector } from "react-redux";
export default function Toolkit({ activePanels }) {
  const { cluster = [] } = useSelector(({ appointments }) => appointments);
  const [qns, setQns] = React.useState([]);
  const [activeQn, setActiveQn] = useState(-1);

  useEffect(() => {
    if (cluster.length > 0) {
      const _qns = cluster.map((item) => item.qn);
      setActiveQn(_qns[0]);
      setQns(_qns);
    }
  }, [cluster]);

  return (
    <div
      className={`checkup-data-toolkit ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <Case />

      <div className="checkup-data-toolkit-buttons">
        <button className="checkup-data-toolkit-button prev">
          <span data-hover="«">Prev</span>
        </button>
        {qns.map((qn, index) => (
          <button
            className={`checkup-data-toolkit-pagination-item ${
              qn === activeQn ? "active" : ""
            }`}
            key={index}
          >
            <span>{qn}</span>
          </button>
        ))}
        <span style={{ fontWeight: 500 }} className="mr-1">
          ...
        </span>
        <button className="checkup-data-toolkit-button next">
          <span data-hover="»">Next</span>
        </button>
        <button className="checkup-data-toolkit-button done">
          <span data-hover="✓">Done</span>
        </button>
      </div>
    </div>
  );
}
