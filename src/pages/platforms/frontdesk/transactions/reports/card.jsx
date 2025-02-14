import React from "react";
import "./index.css";
import { MDBIcon } from "mdbreact";

export default function Card({ hasDone, name }) {
  return (
    <div className={`task-card ${!hasDone && "not-done"}`}>
      <div className="task-details task-name">
        <small className="walkIn">Walk-in</small>
        <p>{name}</p>
      </div>
      <div className="task-details task-service">
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
        <small className="service">Test</small>
      </div>
      <div className="task-details task-action button-end">
        <button className="edit">
          <MDBIcon icon="pencil-alt" />
        </button>
        <button className="print">
          <MDBIcon icon="print" />
        </button>
        <button className="list">
          <MDBIcon icon="list" />
        </button>
        <button className="view">
          <MDBIcon icon="eye" />
        </button>
      </div>
    </div>
  );
}
