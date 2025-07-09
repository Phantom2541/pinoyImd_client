import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetActiveTAB } from "../../../../../services/redux/slices/assets/persons/cardHolder";
import "./style.css";

const Body = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(({ cardHolder }) => cardHolder);
  const handleAccept = () => {
    const isAccredited = false; // Replace with your real logic

    if (!isAccredited) {
      alert("This company is not accredited for this HMO.");
    } else {
      alert("Card accepted successfully!");
      // You can also dispatch an action or update state here
    }
  };

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
          Health Support Card
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-body-content">
        {activeTab === "labRequest" && (
          <div className="template1-card mx-auto">
            <img
              className="template1-card-image"
              src="https://via.placeholder.com/300x160"
              alt="Lab Request"
            />
            <div className="template1-card-body">
              <div className="template1-card-title">Lab Request Card</div>
              <div className="template1-card-subtitle">Laboratory</div>
              <div className="template1-card-description">
                This is the content for the lab request card.
              </div>
              {/* Accept Button */}
              <button className="btn btn-success mt-3" onClick={handleAccept}>
                Accept Card
              </button>
            </div>
          </div>
        )}

        {activeTab === "other" && (
          <div className="template1-card mx-auto">
            <img
              className="template1-card-image"
              src="https://via.placeholder.com/300x160"
              alt="Health Support"
            />
            <div className="template1-card-body">
              <div className="template1-card-title">Health Support Card</div>
              <div className="template1-card-subtitle">Other Department</div>
              <div className="template1-card-description">
                This is the content for the Health Support card.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Body;
