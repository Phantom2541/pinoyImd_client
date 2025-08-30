import { useEffect, useState } from "react";
import "./style.css";
import LOGO from "./../../../../assets/aplhamed.png";
import MISSION from "./../../../../assets/mission.jpg";
import VISION from "./../../../../assets/vision.jpg";
import VALUE from "./../../../../assets/value.jpg";
import { Cloudinary } from "../../../../services/utilities";

export default function MissionVision() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("patronCompany");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCompany(parsed);
      }
    } catch (err) {
      console.error("Failed to parse patronCompany from localStorage", err);
    }
  }, []);

  const logoUrl = company?.name
    ? `${Cloudinary.getEndpoint()}/companies/${company.name}/logo`
    : LOGO; // fallback to default logo if no company

  // Safely ensure values list is always an array
  const values = Array.isArray(company?.vl) ? company.vl : [];

  return (
    <div className="subscriber-mission-vision-section mt-5">
      <div className="subscriber-mission-vision-container">
        {/* TOP SECTION */}
        <div className="subscriber-mission-vision-top">
          <div>
            <img src={MISSION} alt="Mission" />
          </div>
          <div>
            <h1>Our Mission</h1>
            <span>{company?.ms || "No mission provided."}</span>
          </div>
          <div>
            <img src={VISION} alt="Vision" />
          </div>
        </div>

        {/* MIDDLE SECTION */}
        <div className="subscriber-mission-vision-middle">
          <div>
            <h1>Our Values</h1>
            <ul>
              {values.slice(0, 3).map((value, index) => {
                if (!value) return <li key={index}>N/A</li>;

                const words = value.split(" ");
                return (
                  <li key={index}>
                    <strong>{words[0]}</strong> {words.slice(1).join(" ")}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <img src={logoUrl} alt="Company Logo" />
            <span>{company?.name || "Company"}</span>
          </div>
          <div>
            <h1>Committed to Compassionate Care</h1>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="subscriber-mission-vision-bottom">
          <div>
            <ul>
              {values.slice(3, 6).map((value, index) => {
                if (!value) return <li key={index}>N/A</li>;

                const words = value.split(" ");
                return (
                  <li key={index}>
                    <strong>{words[0]}</strong> {words.slice(1).join(" ")}
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <img src={VALUE} alt="Values" />
          </div>
          <div>
            <h1>Our Vision</h1>
            <span>{company?.vs || "No vision provided."}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
