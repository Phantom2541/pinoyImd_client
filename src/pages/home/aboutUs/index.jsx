import React from "react";
import "./style.css";
import LIS from "./../../../assets/LIS.jpg";
import RIS from "./../../../assets/RIS.jpg";
import CM from "./../../../assets/CM.jpg";
import EHR from "./../../../assets/EHR.jpg";
import PM from "./../../../assets/PM.jpg";
import UHP from "./../../../assets/UHP.png";
import DOH from "./../../../assets/DOH.jpg";
import Inventory from "./../../../assets/Inventory.jpg";
import HIMS from "./../../../assets/HIMS.jpg";
import { MDBAnimation } from "mdbreact";

export default function AboutUs() {
  const Philhealth = `${process.env.PUBLIC_URL || ""}/assets/logo/philhealth.png`;
  const HMO = `${process.env.PUBLIC_URL || ""}/assets/logo/hmo.png`;

  const collections = [
    {
      image: Philhealth,
      imageClassName: "homePage-AboutUs-card-logo",
      title: "PhilHealth Ready",
      description:
        "Pinoy iMD is designed to meet the requirements of PhilHealth, ensuring seamless integration for eClaims processing, accurate data capture, and compliance with national healthcare standards, making it easier for healthcare providers to manage their PhilHealth obligations efficiently.",
    },
    {
      image: HMO,
      title: "HMO-Compliant Ready",
      description:
        "Pinoy iMD’s HMO-compliant features ensure seamless integration with HMO requirements, facilitating efficient claims processing and maintaining compliance with national healthcare standards.",
    },
    {
      image: LIS,
      title: "Laboratory Information System (LIS)",
      description:
        "LIS is an essential digital tool for modern laboratories, enabling them to deliver fast, reliable, and high-quality diagnostic services while maintaining full traceability, compliance, and operational efficiency.",
    },
    {
      image: RIS,
      title: "Radiology Information System (RIS)",
      description:
        "RIS streamlines imaging workflows, from scan scheduling to result delivery, integrating seamlessly with PACS and EMR to ensure timely and accessible radiology services for both clinicians and patients.",
    },
    {
      image: CM,
      title: "Clinic Management",
      description:
        "Pinoy iMD enables clinics to manage appointments, patient records, and billing all in one platform, improving efficiency, reducing wait times, and enhancing the overall patient experience.",
    },
    {
      image: EHR,
      title: "Electronic Health Records (eHR)",
      description:
        "EMR allows healthcare providers to securely access, update, and share patient records in real time, ensuring continuity of care, faster decision-making, and data-driven healthcare delivery.",
    },
    {
      image: PM,
      title: "Pharmacy Management",
      description:
        "Pinoy iMD’s pharmacy module ensures accurate prescription handling, real-time inventory tracking, and streamlined dispensing, reducing errors and supporting safe medication practices.",
    },
    {
      image: UHP,
      title: "Unified Health Platform",
      description:
        "Pinoy iMD brings together lab, clinic, EMR, pharmacy, and more into one integrated platform, enabling seamless coordination across departments and enhancing the quality and efficiency of care.",
    },
    {
      image: DOH,
      title: "DOH-Compliant Reporting",
      description:
        "Built with national healthcare standards in mind, Pinoy iMD supports Department of Health (DOH) compliance through automated reporting, accurate patient data capture, and timely submissions.",
    },
    {
      image: Inventory,
      title: "Inventory Management",
      description:
        "Pinoy iMD’s inventory system helps clinics and pharmacies manage medical supplies, track stock levels in real time, reduce wastage, and ensure essential resources are always available when needed.",
    },
    {
      image: HIMS,
      title: "Hospital Information Management System",
      description:
        "Pinoy iMD’s HIMS streamlines hospital operations, from patient admission to discharge, ensuring efficient and accurate patient care management.",
    },
  ];

  return (
    <section className="homePage-aboutUs-section">
      <MDBAnimation reveal type="fadeInDown" duration="1.5s" delay="500ms">
        <h1 className="text-center homePage-aboutUs-title">
          Capabilities of the system
        </h1>
      </MDBAnimation>
      <div className="homePage-aboutUs-container">
        {collections.map((item, index) => (
          <MDBAnimation
            reveal
            type="fadeInUp"
            className="homePage-AboutUs-card"
            key={index}
            delay={`${index * 0.2}s`}
          >
            <div className="homePage-AboutUs-card-image">
              <img
                src={item.image}
                alt={item.title}
                className={item.imageClassName || ""}
                loading="lazy"
              />
            </div>
            <div className="homePage-AboutUs-card-body">
              <div className="homePage-AboutUs-card-title">{item.title}</div>
              <div className="homePage-AboutUs-card-description">
                {item.description}
              </div>
            </div>
          </MDBAnimation>
        ))}
      </div>
    </section>
  );
}
