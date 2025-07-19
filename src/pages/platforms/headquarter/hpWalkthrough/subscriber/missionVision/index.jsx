import React from "react";
import "./style.css";
import LOGO from "./../../../../../../assets/aplhamed.png";
import MISSION from "./../../../../../../assets/mission.jpg";
import VISION from "./../../../../../../assets/vision.jpg";
import VALUE from "./../../../../../../assets/value.jpg";
import ImageDragAndDrop from "../../../../../../components/images/imageDragAndDrop/dragNdroping";
import EditableField from "../../../../../../components/customizable/editableField";

const companyData = {
  brand: {
    name: "AlphaMed",
    logo: LOGO,
    tagline: "committed to compassionate care",
  },
  mission: {
    title: "Our Mission",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere dicta consequatur eaque a corrupti in? Expedita, id a. Minus odio alias et architecto neque autem doloremque at blanditiis quas omnis.",
    image: MISSION,
  },
  vision: {
    title: "Our Vision",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere dicta consequatur eaque a corrupti in? Expedita, id a. Minus odio alias et architecto neque autem doloremque at blanditiis quas omnis.",
    image: VISION,
  },
  values: {
    title: "Our Values",
    text: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facere dicta consequatur eaque a corrupti in? Expedita, id a. Minus odio alias et architecto neque autem doloremque at blanditiis quas omnis.",
    image: VALUE,
  },
  quote: {
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, voluptate.",
  },
};

export default function MissionVision() {
  const { mission, vision, values, quote, brand } = companyData;

  return (
    <div className="subscriber-mission-vision-section mt-5">
      <div className="subscriber-mission-vision-container">
        <div className="subscriber-mission-vision-top">
          <div className="subscriber-mission-vision-topBox">
            <ImageDragAndDrop img={mission.image} />
            {/* <img src={mission.image} alt="Mission" /> */}
          </div>
          <div className="subscriber-mission-vision-topBox">
            <EditableField
              classNameTxt="subscriber-mission-vision-missionTitle"
              fieldData={{
                _id: "missionTitle",
                missionTitle: mission.title,
              }}
              keyForValue="missionTitle"
            />
            <EditableField
              classNameTxt="subscriber-mission-vision-missionText"
              fieldData={{
                _id: "missionText",
                missionText: mission.text,
              }}
              keyForValue="missionText"
            />
            {/* <h1>{mission.title}</h1> */}
            {/* <span>{mission.text}</span> */}
          </div>
          <div className="subscriber-mission-vision-topBox">
            <img src={vision.image} alt="Vision" />
          </div>
        </div>

        <div className="subscriber-mission-vision-middle">
          <div className="subscriber-mission-vision-middleBox">
            <h1>{values.title}</h1>
            <span>{values.text}</span>
          </div>
          <div className="subscriber-mission-vision-middleBox">
            <img src={brand.logo} alt="AlphaMed Logo" />
            <span>{brand.name}</span>
          </div>
          <div className="subscriber-mission-vision-middleBox">
            <h1>{brand.tagline}</h1>
          </div>
        </div>

        <div className="subscriber-mission-vision-bottom">
          <div className="subscriber-mission-vision-botomBox">
            <span>"{quote.text}"</span>
          </div>
          <div className="subscriber-mission-vision-botomBox">
            <img src={values.image} alt="Values" />
          </div>
          <div className="subscriber-mission-vision-botomBox">
            <h1>{vision.title}</h1>
            <span>{vision.text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
