import { useEffect, useState } from "react";
import "./style.css";
import MISSION from "./../../../../assets/mission.jpg";
import VISION from "./../../../../assets/vision.jpg";
import VALUE from "./../../../../assets/value.jpg";
import { Cloudinary } from "../../../../services/utilities";

export default function MissionVision() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("patronCompany");
    if (stored) {
      setCompany(JSON.parse(stored));
    }
  }, []);

  const logoUrl = `${Cloudinary.getEndpoint()}/companies/${company?.name}/logo`;

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
            <span>{company.ms}</span>
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
              {company?.vl?.slice(0, 2).map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
          <div>
            <img src={logoUrl} alt="Company Logo" />
            <span>{company?.name || ""}</span>
          </div>
          <div>
            <h1>Committed to Compassionate Care</h1>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="subscriber-mission-vision-bottom">
          <div>
            <ul>
              {company?.vl?.slice(3, 5).map((value, index) => (
                <li key={index}>{value}</li>
              ))}
            </ul>
          </div>
          <div>
            <img src={VALUE} alt="Values" />
          </div>
          <div>
            <h1>Our Vision</h1>
            <span>{company.vs}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
