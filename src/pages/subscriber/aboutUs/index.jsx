import React from "react";
import "./style.css";
import LIS from "./../../../assets/LIS.jpg";

const collections = [
  {
    image: LIS,
    title: "Laboratory Information System (LIS)",
    description:
      "LIS is an essential digital tool for modern laboratories, enabling them to deliver fast, reliable, and high-quality diagnostic services while maintaining full traceability, compliance, and operational efficiency.",
  },
  {
    image: LIS,
    title: "Radiology Information System (RIS)",
    description:
      "RIS streamlines imaging workflows, from scan scheduling to result delivery, integrating seamlessly with PACS and EMR to ensure timely and accessible radiology services for both clinicians and patients.",
  },
  {
    image: LIS,
    title: "Clinic Management",
    description:
      "Pinoy iMD enables clinics to manage appointments, patient records, and billing all in one platform, improving efficiency, reducing wait times, and enhancing the overall patient experience.",
  },
  {
    image: LIS,
    title: "Electronic Medical Records (EMR)",
    description:
      "EMR allows healthcare providers to securely access, update, and share patient records in real time, ensuring continuity of care, faster decision-making, and data-driven healthcare delivery.",
  },
  {
    image: LIS,
    title: "Pharmacy Management",
    description:
      "Pinoy iMD’s pharmacy module ensures accurate prescription handling, real-time inventory tracking, and streamlined dispensing, reducing errors and supporting safe medication practices.",
  },
  {
    image: LIS,
    title: "Unified Health Platform",
    description:
      "Pinoy iMD brings together lab, clinic, EMR, pharmacy, and more into one integrated platform, enabling seamless coordination across departments and enhancing the quality and efficiency of care.",
  },
  {
    image: LIS,
    title: "DOH-Compliant Reporting",
    description:
      "Built with national healthcare standards in mind, Pinoy iMD supports Department of Health (DOH) compliance through automated reporting, accurate patient data capture, and timely submissions.",
  },
  {
    image: LIS,
    title: "Inventory Management",
    description:
      "Pinoy iMD’s inventory system helps clinics and pharmacies manage medical supplies, track stock levels in real time, reduce wastage, and ensure essential resources are always available when needed.",
  },
];

export default function AboutUs() {
  return (
    <section className="homePage-aboutUs-section">
      <h1 className="text-center">Capabilities of the system</h1>
      <div className="homePage-aboutUs-container">
        {collections.map((item, index) => (
          <div className="homePage-AboutUs-card" key={index}>
            <div className="homePage-AboutUs-card-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="homePage-AboutUs-card-body">
              <div className="homePage-AboutUs-card-title">{item.title}</div>
              <div className="homePage-AboutUs-card-description">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
