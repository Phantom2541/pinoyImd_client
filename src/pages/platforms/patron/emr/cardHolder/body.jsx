import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetActiveTAB } from "../../../../../services/redux/slices/assets/persons/cardHolder";
import "./style.css";

const Body = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(({ cardHolder }) => cardHolder);

  return (
    <div className="tab-wrapper">
      {/* Tab Panel */}
      <div className="tab-panel-horizontal">
        <button
          className={`tab-button-horizontal ${
            activeTab === "labRequest" ? "active-tab" : ""
          }`}
          onClick={() => dispatch(SetActiveTAB("labRequest"))}
        >
          Lab Request Card
        </button>
        <button
          className={`tab-button-horizontal ${
            activeTab === "other" ? "active-tab" : ""
          }`}
          onClick={() => dispatch(SetActiveTAB("other"))}
        >
          Health Suport Card
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-body-content">
        {activeTab === "labRequest" && (
          <div className="template1-card">
            <img
              className="template1-card-image"
              src="https://via.placeholder.com/300x160"
              alt="Lab Request"
            />
            <div className="template1-card-body">
              <div className="template1-card-title">Request Lab Card</div>
              <div className="template1-card-subtitle">Lab Department</div>
              <div className="template1-card-description">
                This is the lab request card content.
              </div>
            </div>
          </div>
        )}

        {activeTab === "other" && (
          <div className="template1-card">
            <img
              className="template1-card-image"
              src="https://via.placeholder.com/300x160"
              alt="Other"
            />
            <div className="template1-card-body">
              <div className="template1-card-title">Card Title Other</div>
              <div className="template1-card-subtitle">Other Department</div>
              <div className="template1-card-description">
                This is the content for the Other tab.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
