import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { MDBAnimation } from "mdbreact";
import "./style.css";
// import LIS from "./../../../assets/LIS.jpg";
import ECG from "./../../../assets/subscriber/Electrocardiogram.jpg";
import MRI from "./../../../assets/subscriber/MRI.jpg";
import CT from "./../../../assets/subscriber/CT.jpg";
import UM from "./../../../assets/subscriber/UM.jpg";
import XRAY from "./../../../assets/subscriber/XRAY.JPG";
import DEFIBRILLATOR from "./../../../assets/subscriber/Defibrillator.jpg";
import VENTILATOR from "./../../../assets/subscriber/Ventilator.jpg";
import IP from "./../../../assets/subscriber/IP.jpeg";

const collections = [
  {
    image: ECG,
    title: "Electrocardiogram (ECG) Machine",
    description:
      "An essential cardiac diagnostic tool that records the electrical activity of the heart, helping physicians detect arrhythmias, heart attacks, and other cardiovascular conditions.",
  },
  {
    image: MRI,
    title: "Magnetic Resonance Imaging (MRI)",
    description:
      "Uses powerful magnets and radio waves to create detailed images of organs and tissues. Ideal for brain, spine, joint, and soft tissue scans without radiation exposure.",
  },
  {
    image: CT,
    title: "Computed Tomography (CT) Scanner",
    description:
      "A cross-sectional imaging system that combines X-ray technology with computing power to visualize internal structures with great clarity, useful for trauma and cancer diagnosis.",
  },
  {
    image: UM,
    title: "Ultrasound Machine",
    description:
      "A real-time imaging system that uses sound waves to monitor internal organs, blood flow, and pregnancies without radiation, making it safe and widely accessible.",
  },
  {
    image: XRAY,
    title: "X-ray Machine",
    description:
      "A standard diagnostic imaging tool that uses low-dose radiation to visualize bones, lungs, and certain tissues, essential in emergency rooms and general practice.",
  },
  {
    image: DEFIBRILLATOR,
    title: "Defibrillator",
    description:
      "A life-saving device that delivers an electric shock to the heart during sudden cardiac arrest, restoring normal rhythm and improving survival chances.",
  },
  {
    image: VENTILATOR,
    title: "Ventilator",
    description:
      "Provides mechanical breathing support for patients with respiratory failure or during surgery, ensuring adequate oxygen delivery and carbon dioxide removal.",
  },
  {
    image: IP,
    title: "Infusion Pump",
    description:
      "Delivers precise amounts of medication, nutrients, or fluids intravenously to patients, commonly used in intensive care, surgery, and chemotherapy settings.",
  },
];

export default function Machines() {
  const cardRefs = useRef([]);
  const [delays, setDelays] = useState([]);

  // Measure layout after rendering
  useLayoutEffect(() => {
    const rowMap = new Map();
    cardRefs.current.forEach((el, index) => {
      if (el) {
        const top = el.offsetTop;
        if (!rowMap.has(top)) rowMap.set(top, []);
        rowMap.get(top).push(index);
      }
    });

    const newDelays = Array(collections.length).fill("0ms");

    rowMap.forEach((rowIndexes) => {
      rowIndexes.forEach((cardIndex, i) => {
        newDelays[cardIndex] = `${i * 150}ms`;
      });
    });

    setDelays(newDelays);
  }, [collections.length, cardRefs, setDelays, delays]);

  useEffect(() => {
    const handleResize = () => {
      setDelays([]); // Reset delays to trigger re-measurement
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <section className="subscriber-aboutUs-section">
      <h1 className="text-center">Features</h1>
      <div className="subscriber-aboutUs-container">
        {collections.map((item, index) => (
          <MDBAnimation
            key={index}
            reveal
            type="fadeInUp"
            delay={delays[index] || "0ms"}
            duration="1000ms"
            className="subscriber-AboutUs-card"
            ref={(el) => (cardRefs.current[index] = el)}
          >
            <div className="subscriber-AboutUs-card-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="subscriber-AboutUs-card-body">
              <div className="subscriber-AboutUs-card-title">{item.title}</div>
              <div className="subscriber-AboutUs-card-description">
                {item.description}
              </div>
            </div>
          </MDBAnimation>
        ))}
      </div>
    </section>
  );
}
