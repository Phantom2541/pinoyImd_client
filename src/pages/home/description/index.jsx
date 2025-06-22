import React from "react";
import "./index.css";
import ABOUTUS from "./../../../assets/Aboutus.png";

export default function Description() {
  return (
    <section className="d-flex justify-content-center">
      <div className="homePage-aboutUs-section">
        <h1 className="homePage-aboutUs-title">
          HOW TO BE AN INSPIRING MEDICAL LEADER
        </h1>
        <span className="homePage-aboutUs-semi-title">with Pinoy iMD</span>
        <div className="homePage-aboutUs-container mt-5">
          <img src={ABOUTUS} alt="aboutUs" width="700px" />
          <div className="homePage-aboutUs-description">
            <span>The Pinoy iMD Leadership Mindset:</span>
            <p>
              "True leadership isn’t about micromanaging systems — it’s about
              inspiring people to perform at their best. Pinoy iMD empowers
              healthcare professionals with smart tools and real-time data,
              turning vision into action and teamwork into transformation."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
