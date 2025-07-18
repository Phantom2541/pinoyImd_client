import React from "react";
import { MDBAnimation, MDBIcon } from "mdbreact";
import "./style.css";
import ECG from "./../../../../../../assets/subscriber/Electrocardiogram.jpg";
import MRI from "./../../../../../../assets/subscriber/MRI.jpg";
import CT from "./../../../../../../assets/subscriber/CT.jpg";
import UM from "./../../../../../../assets/subscriber/UM.jpg";
import XRAY from "./../../../../../../assets/subscriber/XRAY.JPG";
import DEFIBRILLATOR from "./../../../../../../assets/subscriber/Defibrillator.jpg";
import VENTILATOR from "./../../../../../../assets/subscriber/Ventilator.jpg";
import IP from "./../../../../../../assets/subscriber/IP.jpeg";
import ImageDragAndDrop from "../../../../../templates/imageDragAndDrop/dragNdroping";
import EditableField from "../../../../../../components/customizable/editableField";

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
  return (
    <section className="subscriber-aboutUs-section">
      <h1 className="subscriber-aboutUs-title">Features</h1>
      <div className="subscriber-aboutUs-container">
        {collections.map((item, index) => (
          <MDBAnimation
            key={index}
            reveal
            type="fadeInUp"
            duration="1000ms"
            className="subscriber-AboutUs-card"
          >
            <div className="subscriber-AboutUs-card-image">
              <ImageDragAndDrop img={item.image} />
            </div>
            <div className="subscriber-AboutUs-card-body">
              <EditableField
                classNameTxt="subscriber-AboutUs-card-title"
                fieldData={{
                  _id: "title",
                  title: item.title,
                }}
                keyForValue="title"
              />
              <EditableField
                classNameTxt="subscriber-AboutUs-card-description"
                fieldData={{
                  _id: "description",
                  description: item.description,
                }}
                keyForValue="description"
              />
            </div>
            <button className="subscriber-AboutUs-card-deleteBtn bg-danger">
              <MDBIcon icon="trash" />
            </button>
          </MDBAnimation>
        ))}
      </div>
    </section>
  );
}
