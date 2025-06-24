import React from "react";

import "./style.css";
import PHYSICIAN1 from "./../../../assets/subscriber/physician1.jpg";
import PHYSICIAN2 from "./../../../assets/homePatient.jpg";
import PHYSICIAN3 from "./../../../assets/male.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const physicians = [
  {
    name: "Dr. Maria Santos",
    location: "Makati Medical Center, Makati City",
    schedule: "Mon–Fri, 9:00 AM – 4:00 PM",
    quote:
      "Compassion is the best medicine. It’s not just about treating symptoms but understanding the journey each patient walks. Healing begins when people feel seen, heard, and cared for.",
    position: "Pediatrician",
    image: PHYSICIAN2,
  },
  {
    name: "Dr. Jose Ramirez",
    location: "St. Luke’s Medical Center, Quezon City",
    schedule: "Tue–Sat, 10:00 AM – 6:00 PM",
    quote:
      "Healing begins with listening. Every diagnosis starts with a story, and every story deserves the patience of a doctor willing to hear it fully and empathetically.",
    position: "Cardiologist",
    image: PHYSICIAN1,
  },
  {
    name: "Dr. Ana Del Rosario",
    location: "The Medical City, Ortigas",
    schedule: "Mon–Thur, 8:00 AM – 12:00 PM",
    quote:
      "Every patient is a unique story waiting to be understood. Medicine is not just science—it’s the art of connection, empathy, and precision coming together for healing.",
    position: "Dermatologist",
    image: PHYSICIAN3,
  },
  {
    name: "Dr. Gabriel Cruz",
    location: "Asian Hospital, Alabang",
    schedule: "Wed–Sat, 1:00 PM – 5:00 PM",
    quote:
      "Prevention is better than cure, but compassion is better than both. I believe in empowering patients through education so they can take control of their health.",
    position: "Family Medicine",
    image: PHYSICIAN1,
  },
  {
    name: "Dr. Regina Tan",
    location: "Cardinal Santos Medical Center, San Juan",
    schedule: "Mon–Fri, 2:00 PM – 7:00 PM",
    quote:
      "Care with competence and heart. Cancer treatment is more than chemo or surgery—it’s about supporting patients emotionally, spiritually, and physically through every step.",
    position: "Oncologist",
    image: PHYSICIAN1,
  },
  {
    name: "Dr. Michael Go",
    location: "Philippine Heart Center, Quezon City",
    schedule: "Mon–Wed, 10:00 AM – 2:00 PM",
    quote:
      "Trust is the heartbeat of healing. As a surgeon, I focus not just on precision but on building a relationship of confidence and calm with every patient.",
    position: "Cardiothoracic Surgeon",
    image: PHYSICIAN1,
  },
  {
    name: "Dr. Liza Mendoza",
    location: "Chinese General Hospital, Manila",
    schedule: "Tues & Thurs, 9:00 AM – 12:00 NN",
    quote:
      "I treat the person, not just the disease. Neurology demands both science and sensitivity—understanding the smallest signals can lead to the biggest breakthroughs.",
    position: "Neurologist",
    image: PHYSICIAN1,
  },
  {
    name: "Dr. Erick Villanueva",
    location: "Perpetual Help Medical Center, Las Piñas",
    schedule: "Mon–Sat, 3:00 PM – 8:00 PM",
    quote:
      "Strong hands, gentle heart. Orthopedic care is about restoring movement, but great care means restoring a patient’s confidence to walk forward in life.",
    position: "Orthopedic Surgeon",
    image: PHYSICIAN1,
  },
];

export default function Doctors() {
  return (
    <div className="subscriber-doctors-section">
      <div className="subscriber-doctors-img">
        <div className="subscriber-doctors-img-mask"></div>
      </div>
      <h1 className="subscriber-doctors-title">Meet Our Doctors</h1>
      <div className="subscriber-doctors-carousel-container">
        <Carousel
          autoPlay
          infiniteLoop
          emulateTouch
          showThumbs={false}
          showStatus={false}
          showArrows={false}
          transitionTime={200}
        >
          {physicians.map((physician, index) => (
            <div className="subscriber-doctors-homeSlideStyle" key={index}>
              <div className="subscriber-doctors-homeimageContainerStyle">
                <img
                  src={physician.image || PHYSICIAN1}
                  alt={physician.name}
                  className="subscriber-doctors-homeimageStyle"
                />
              </div>
              <div className="subscriber-doctors-hometextContainerStyle">
                <h1>{physician.name}</h1>
                <h5>
                  {physician.position} - {physician.schedule}
                </h5>
                <p>"{physician.quote}"</p>
                <h6>- {physician.location}</h6>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
