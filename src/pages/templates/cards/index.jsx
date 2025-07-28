import React, { useState } from "react";
import "./style.css";
import MRI from "./../../../assets/subscriber/MRI.jpg";
import Tutorial from "../../../components/tutorial";
import { instructionSteps } from "./instruction";

export default function Cards() {
  const [showInstructions, setShowInstructions] = useState(true);
  return (
    <div className="template-cards-container">
      {showInstructions && (
        <Tutorial
          steps={instructionSteps}
          onFinish={() => setShowInstructions(false)}
        />
      )}
      <div className="d-flex flex-column">
        <h5 className="text-center fw-bold">Card 1</h5>
        {/* start copy here  */}
        <div className="template1-card">
          <img
            src="https://drive.google.com/thumbnail?id=1r9GSLgSh2r92poO5M-31eZRrl9TX6WyV"
            alt="Card"
            className="template1-card-image"
          />
          <div className="template1-card-body">
            <h2 className="template1-card-title">Card Title</h2>
            <h4 className="template1-card-subtitle">Card Subtitle</h4>
            <p className="template1-card-description">
              This is a sample description. Use this space to give more context
              or details about the content of the card.
            </p>
            <div className="template1-card-buttons">
              <button
                id="template1-card-btn"
                className="template1-card-btn template1-primary"
              >
                Learn More
              </button>
              <button className="template1-card-btn template1-secondary">
                Contact
              </button>
            </div>
          </div>
        </div>
        {/* end copy here  */}
      </div>
      <div className="d-flex flex-column">
        <h5 className="text-center fw-bold">Card 2</h5>
        {/* start copy here */}
        <div className="template6-card">
          <img src={MRI} alt="Card Visual" className="template6-card-image" />
          <div className="template6-card-body">
            <h3 className="template6-card-title">Health Scan</h3>
            <h5 className="template6-card-subtitle">Full Body MRI</h5>
            <p className="template6-card-description">
              Experience a comprehensive full-body scan using advanced MRI
              technology. Quick, safe, and accurate results for your peace of
              mind.
            </p>
          </div>
        </div>
        {/* end copy here */}
      </div>
      <div className="d-flex flex-column">
        <h5 className="text-center fw-bold">Card 3</h5>
        {/* start copy here */}
        <div className="template3-card">
          <div className="template3-card-body">
            <h2 className="template3-card-title">Card Title</h2>
            <h4 className="template3-card-subtitle">Card Subtitle</h4>
            <p className="template3-card-description">
              This is a sample card without an image. You can use this for
              text-only content like announcements, summaries, or notifications.
            </p>
            <div className="template3-card-buttons">
              <button className="template3-card-btn template3-primary">
                Action
              </button>
              <button className="template3-card-btn template3-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* end copy here */}
      </div>
      <div className="d-flex flex-column">
        <h5 className="text-center fw-bold">Card 4</h5>
        {/* start copy here */}
        <div className="template4-card">
          <div className="template4-card-header">
            <h3 className="template4-card-title">Notice</h3>
          </div>
          <div className="template4-card-body">
            <p className="template4-card-text">
              This card has no image but includes a header section. It's great
              for alerts, announcements, or featured content with a clean look.
            </p>
            <div className="template4-card-buttons">
              <button className="template4-card-btn template4-primary">
                Got it
              </button>
              <button className="template4-card-btn template4-secondary">
                Dismiss
              </button>
            </div>
          </div>
        </div>
        {/* end copy here */}
      </div>
      <div className="d-flex flex-column">
        <h5 className="text-center fw-bold">Card 5</h5>
        {/* start copy here */}
        <div className="template5-card">
          <h3 className="template5-card-title">System Update</h3>
          <h5 className="template5-card-subtitle">Scheduled Maintenance</h5>
          <p className="template5-card-description">
            Please be advised that the system will undergo scheduled maintenance
            on Sunday from 1:00 AM to 3:00 AM. Services may be temporarily
            unavailable during this time.
          </p>
          <input id="template5-card-input" type="text" />
        </div>
        {/* end copy here */}
      </div>
    </div>
  );
}
