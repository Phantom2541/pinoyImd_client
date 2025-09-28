import React, { useRef, useState, useEffect } from "react";
import "./style.css";

export default function PatientScreen() {
  const screenRef = useRef(null);

  // State para sa now serving & waiting patients
  const [nowServing, setNowServing] = useState({ number: 4, name: "Kevin" });
  const [waitingPatients, setWaitingPatients] = useState([
    { number: 6, name: "Nick" },
    { number: 5, name: "Carl" },
    { number: 99, name: "Evelyn" },
    { number: 99, name: "Evelyn" },

    { number: 99, name: "Evelyn" },
  ]);

  // State para malaman kung fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    if (screenRef.current) {
      if (!document.fullscreenElement) {
        screenRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Listener para malaman kung nagbago fullscreen state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  return (
    <div className="patient-screen-container" ref={screenRef}>
      {/* Fullscreen Button (hide kapag fullscreen) */}
      {!isFullscreen && (
        <button className="fullscreen-btn" onClick={handleFullscreen}>
          ⛶ Fullscreen
        </button>
      )}

      {/* Video */}
      <div className="patient-screen-video">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/Oqt4bDOqQD8?autoplay=1&mute=1"
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Now Serving & Waiting */}
      <div className="patient-screen-number">
        <div className="patient-screen-now-serving-container">
          <label>Now Serving</label>
          <div className="patient-screen-now-serving">
            <span>#{nowServing.number}</span>
            <span>{nowServing.name}</span>
          </div>

          <div className="patient-screen-waiting-patient-container">
            <span className="patient-screen-waiting-patient-title">
              Waiting Patients
            </span>
            <div className="patien-screen-waiting-patient-wrapper">
              {waitingPatients.length > 0 ? (
                waitingPatients.map((patient, index) => (
                  <div key={index}>
                    <span>#{patient.number}</span>
                    <span>{patient.name}</span>
                  </div>
                ))
              ) : (
                <div>No patients waiting</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Marquee */}
      <div className="patient-screen-marquee">
        <marquee>
          ⚠ Please proceed to Window 3 | Keep safe and wear your mask ⚠
        </marquee>
      </div>
    </div>
  );
}
