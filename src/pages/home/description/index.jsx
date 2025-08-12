import React from "react";
import "./style.css";
import ABOUTUS from "./../../../assets/Aboutus.png";
import { MDBAnimation } from "mdbreact";

export default function Description() {
  return (
    <section className="d-flex justify-content-center">
      <div className="homePage-description-section">
        <MDBAnimation reveal type="fadeInDown" duration="1.5s" delay="500ms">
          <h1 className="homePage-description-title">
            HOW TO BE AN INSPIRING MEDICAL LEADER
          </h1>
        </MDBAnimation>
        <MDBAnimation reveal type="fadeInDown" duration="1.5s" delay="1000ms">
          <span className="homePage-description-semi-title">
            with Pinoy iMD
          </span>
        </MDBAnimation>
        <div className="homePage-description-container mt-5">
          <MDBAnimation reveal type="fadeIn" duration="1.5s" delay="1000ms">
            <img
              className="homePage-description-image"
              src={ABOUTUS}
              alt="aboutUs"
              width="700px"
            />
          </MDBAnimation>
          <MDBAnimation
            reveal
            type="fadeInRight"
            duration="1.5s"
            className="homePage-description"
          >
            <span>The Pinoy iMD Leadership Mindset:</span>
            <p>
              "True leadership isn’t about micromanaging systems — it’s about
              inspiring people to perform at their best. Pinoy iMD empowers
              healthcare professionals with smart tools and real-time data,
              turning vision into action and teamwork into transformation."
            </p>
          </MDBAnimation>
        </div>
      </div>
    </section>
  );
}
