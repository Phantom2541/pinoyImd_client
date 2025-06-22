import React from "react";
import "./style.css";
import ABOUTUS from "./../../../assets/Aboutus.png";

export default function Description() {
  return (
    <section className="d-flex justify-content-center">
      <div className="homePage-description-section">
        <h1 className="homePage-description-title">
          HOW TO BE AN INSPIRING MEDICAL LEADER
        </h1>
        <span className="homePage-description-semi-title">with Pinoy iMD</span>
        <div className="homePage-description-container mt-5">
          <img src={ABOUTUS} alt="aboutUs" width="700px" />
          <div className="homePage-description">
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
