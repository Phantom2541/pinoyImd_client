import { MDBAnimation, MDBIcon } from "mdbreact";
import IMG1 from "./../../../assets/homeImg.jpg";
import IMG2 from "./../../../assets/homeMachine.jpg";
import IMG3 from "./../../../assets/homePatient.jpg";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Register from "../register";
import "./style.css";

const slides = [
  {
    title: "Your Complete Diagnostic Information System",
    subtitle: "Simplified, Integrated, Scalable.",
    description:
      "Empowering medical providers with seamless laboratory management, advanced reporting, and patient-centric care.",
    image: IMG1,
  },
  {
    title: "Seamless Device Integration",
    subtitle: "Connect Your Laboratory Analyzers with Ease.",
    description:
      "Full compatibility with hematology, chemistry, and immunology analyzers. HL7-ready for EMR and LIS integration.",
    image: IMG2,
  },
  {
    title: "Built for Clinics, Hospitals, and Mobile Units",
    subtitle: "From small clinics to nationwide chains — scalable as you grow.",
    description:
      "Manage patient records, results, billing, inventory, and mobile laboratory operations — all in one platform.",
    image: IMG3,
  },
];

export default function SlideShow({ handleFlip, flipped }) {
  return (
    <MDBAnimation reveal type="fadeIn" duration="1000ms">
      <div className="subscriber-register-section">
        <div
          className={`subscriber-flip-container ${
            flipped ? "subscriber-flipped" : ""
          }`}
        >
          <div className="subscriber-flip-card">
            <div className="subscriber-flip-card-front">
              <Carousel
                // autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                showArrows={false}
              >
                {slides.map((slide, i) => (
                  <div className="subscriber-slide-style" key={i}>
                    <div className="subscriber-slide-content">
                      <div className="subscriber-text-container-style">
                        <h1>{slide.title}</h1>
                        <h5>{slide.subtitle}</h5>
                        <p>"{slide.description}"</p>
                      </div>
                      <div className="subscriber-image-container-style">
                        <img src={slide.image} alt={`Slide ${i + 1}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="subscriber-flip-card-back">
              <button className="subscriber-back-button" onClick={handleFlip}>
                <MDBIcon fas icon="arrow-left" />
              </button>
              <Register />
            </div>
          </div>
        </div>
      </div>
    </MDBAnimation>
  );
}
