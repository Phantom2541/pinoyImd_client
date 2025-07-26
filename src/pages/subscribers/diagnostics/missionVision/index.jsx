import "./style.css";
import LOGO from "./../../../../assets/aplhamed.png";
import MISSION from "./../../../../assets/mission.jpg";
import VISION from "./../../../../assets/vision.jpg";
import VALUE from "./../../../../assets/value.jpg";

export default function MissionVision() {
  return (
    <div className="subscriber-mission-vision-section mt-5">
      <div className="subscriber-mission-vision-container">
        <div className="subscriber-mission-vision-top">
          <div>
            <img src={MISSION} alt="" />
          </div>
          <div>
            <h1>our mission</h1>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere
              dicta consequatur eaque a corrupti in? Expedita, id a. Minus odio
              alias et architecto neque autem doloremque at blanditiis quas
              omnis.
            </span>
          </div>
          <div>
            <img src={VISION} alt="" />
          </div>
        </div>
        <div className="subscriber-mission-vision-middle">
          <div>
            <h1>our values</h1>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere
              dicta consequatur eaque a corrupti in? Expedita, id a. Minus odio
              alias et architecto neque autem doloremque at blanditiis quas
              omnis.
            </span>
          </div>
          <div>
            <img src={LOGO} alt="" />
            <span>AlphaMed</span>
          </div>
          <div>
            <h1>committed to compassionate care</h1>
          </div>
        </div>
        <div className="subscriber-mission-vision-bottom">
          <div>
            <span>
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae,
              voluptate."
            </span>
          </div>
          <div>
            <img src={VALUE} alt="" />
          </div>
          <div>
            <h1>our vision</h1>
            <span>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere
              dicta consequatur eaque a corrupti in? Expedita, id a. Minus odio
              alias et architecto neque autem doloremque at blanditiis quas
              omnis.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
