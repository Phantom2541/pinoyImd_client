import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import PHYSICIAN from "./../../../assets/physician1.jpg";

export default function Physician() {
  return (
    <div>
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showArrows={false}
      >
        <div className="homeSlideStyle">
          <div className="homeSlideContent">
            <div className="homeimageContainerStyle">
              <img src={PHYSICIAN} alt="Slide 1" className="homeimageStyle" />
            </div>
            <div className="hometextContainerStyle">
              <h1>Your Complete Diagnostic Information System</h1>
              <h5>Simplified, Integrated, Scalable.</h5>
              <p>
                Empowering medical providers with seamless laboratory
                management, advanced reporting, and patient-centric care.
              </p>
            </div>
          </div>
        </div>

        <div className="homeSlideStyle">
          <div className="homeSlideContent">
            <div className="homeimageContainerStyle">
              <img src={PHYSICIAN} alt="Slide 2" className="homeimageStyle" />
            </div>
            <div className="hometextContainerStyle">
              <h1>Seamless Device Integration</h1>
              <h5>Connect Your Laboratory Analyzers with Ease.</h5>
              <p>
                Full compatibility with hematology, chemistry, and immunology
                analyzers. HL7-ready for EMR and LIS integration.
              </p>
            </div>
          </div>
        </div>

        <div className="homeSlideStyle">
          <div className="homeSlideContent">
            <div className="homeimageContainerStyle">
              <img src={PHYSICIAN} alt="Slide 3" className="homeimageStyle" />
            </div>
            <div className="hometextContainerStyle">
              <h1>Built for Clinics, Hospitals, and Mobile Units</h1>
              <h5>
                From small clinics to nationwide chains — scalable as you grow.
              </h5>
              <p>
                Manage patient records, results, billing, inventory, and mobile
                laboratory operations — all in one platform.
              </p>
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
