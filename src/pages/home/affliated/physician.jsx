import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import PHYSICIAN from "./../../../assets/physician1.jpg";

const physicians = [
  {
    name: "Dr. Maria Santos",
    description: "Pediatrician – Makati City",
    logo: PHYSICIAN,
    quote:
      "Every child deserves a healthy start — I’m here to make that happen.",
  },
  {
    name: "Dr. Jose Ramirez",
    description: "Internal Medicine – Quezon City",
    logo: PHYSICIAN,
    quote: "Good health starts from within — prevention is better than cure.",
  },
  {
    name: "Dr. Ana Lopez",
    description: "Cardiologist – Pasig",
    logo: PHYSICIAN,
    quote:
      "The heart is more than a muscle — it's a story of resilience, and I listen to every beat.",
  },
  {
    name: "Dr. Carlo Reyes",
    description: "Dermatologist – Cebu City",
    logo: PHYSICIAN,
    quote: "Healthy skin is the foundation of confidence and care.",
  },
  {
    name: "Dr. Nina de Vera",
    description: "Obstetrician-Gynecologist – Davao City",
    logo: PHYSICIAN,
    quote: "Women's health is community health — I care for both.",
  },
  {
    name: "Dr. Miguel Santiago",
    description: "Neurologist – Baguio City",
    logo: PHYSICIAN,
    quote: "Understanding the brain helps us unlock healing and hope.",
  },
  {
    name: "Dr. Liza Mendoza",
    description: "Ophthalmologist – Iloilo City",
    logo: PHYSICIAN,
    quote: "Helping you see the world clearly is my daily mission.",
  },
  {
    name: "Dr. Enrico Tan",
    description: "Orthopedic Surgeon – Taguig City",
    logo: PHYSICIAN,
    quote: "Movement is life — and I’m here to help you move better every day.",
  },
];

export default function Physician() {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div style={{ width: "90%" }}>
      <Carousel
        selectedItem={currentSlide}
        onChange={(index) => setCurrentSlide(index)}
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showArrows={false} // we’ll use custom bottom arrows instead
        renderIndicator={() => null} // we’ll handle indicators manually
      >
        {physicians.map((physician, index) => (
          <div className="homeSlideStyle-affliated" key={index}>
            <div className="homeSlideContent-affliated">
              <div className="homeimageContainerStyle-affliated">
                <img
                  src={physician.logo}
                  alt={physician.name}
                  className="homeimageStyle-affliated"
                />
              </div>
              <div className="hometextContainerStyle-affliated">
                <h1>{physician.name}</h1>
                <h5>{physician.description}</h5>
                <p>"{physician.quote}"</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Bottom Indicator + Arrows */}
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? physicians.length - 1 : prev - 1
            )
          }
          className="affliated-indicator-arrow"
        >
          ‹
        </button>

        {/* Indicator Lines */}
        {physicians.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              cursor: "pointer",
              height: "4px",
              width: currentSlide === index ? "25px" : "20px",
              backgroundColor:
                currentSlide === index
                  ? "rgba(255, 255, 255, 1)"
                  : "rgba(221, 221, 221, .8)",
              display: "inline-block",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        ))}

        {/* Right Arrow */}
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === physicians.length - 1 ? 0 : prev + 1
            )
          }
          className="affliated-indicator-arrow"
        >
          ›
        </button>
      </div>
    </div>
  );
}
