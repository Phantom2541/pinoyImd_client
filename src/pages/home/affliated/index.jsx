import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import PHYSICIAN from "./../../../assets/physician1.jpg";
import Physician from "./physician";

const suppliers = [
  {
    name: "MediPlus Supplies",
    description: "Trusted medical and surgical supplier.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Medline_Logo.svg/2560px-Medline_Logo.svg.png",
  },
  {
    name: "HealthCare Direct",
    description: "Distributor of high-quality hospital equipment.",
    logo: "https://www.halyardhealth.com/-/media/Images/Halyard/logo/halyard-logo.png",
  },
  {
    name: "BioLab Solutions",
    description: "Provider of diagnostic reagents and lab tools.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Bio-Rad_logo.svg/2560px-Bio-Rad_logo.svg.png",
  },
];

const diagnostics = [
  {
    name: "NovaLab Diagnostics",
    description: "ISO-certified diagnostic center with nationwide branches.",
    logo: "/images/diagnostics/novalab.png",
  },
  {
    name: "LabCheck PH",
    description: "Affordable lab testing and diagnostics in Luzon.",
    logo: "/images/diagnostics/labcheck.png",
  },
  {
    name: "MetroScan Imaging",
    description: "CT, X-Ray, and Ultrasound specialists.",
    logo: "/images/diagnostics/metroscan.png",
  },
];

const physicians = [
  {
    name: "Dr. Maria Santos",
    description: "Pediatrician – Makati City",
    logo: PHYSICIAN,
  },
  {
    name: "Dr. Jose Ramirez",
    description: "Internal Medicine – Quezon City",
    logo: PHYSICIAN,
  },
  {
    name: "Dr. Ana Lopez",
    description: "Cardiologist – Pasig",
    logo: PHYSICIAN,
  },
];

export default function Affliated() {
  const [activeTab, setActiveTab] = useState("physicians");

  const physiciansRef = useRef(null);
  const diagnosticsRef = useRef(null);
  const suppliersRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: "0px",
    width: "0px",
  });

  const updateIndicator = (tab) => {
    let ref;
    if (tab === "physicians") ref = physiciansRef;
    else if (tab === "diagnostics") ref = diagnosticsRef;
    else ref = suppliersRef;

    const left = ref.current.offsetLeft + "px";
    const width = ref.current.offsetWidth + "px";
    setIndicatorStyle({ left, width });
  };

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab]);
  return (
    <div className="homePage-affliated-section">
      <h1 className="text-center">Who We’re Affiliated With</h1>
      <div className="homePage-affliated-container">
        <div className="homePage-affliated-tabs">
          <div
            className="tab-indicator"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          ></div>

          <button
            ref={physiciansRef}
            onClick={() => setActiveTab("physicians")}
          >
            Physicians
          </button>
          <button
            ref={diagnosticsRef}
            onClick={() => setActiveTab("diagnostics")}
          >
            Diagnostics
          </button>
          <button ref={suppliersRef} onClick={() => setActiveTab("suppliers")}>
            Suppliers
          </button>
        </div>
        <div
          className={`homePage-affliated-physicians ${
            activeTab === "physicians" ? "active" : ""
          }`}
        >
          <div
            className={`homePage-affliated-content-physicians ${
              activeTab === "physicians" ? "active" : ""
            }`}
          >
            <Physician />
          </div>
        </div>
        <div
          className={`homePage-affliated-diagnostics ${
            activeTab === "diagnostics" ? "active" : ""
          }`}
        >
          <div
            className={`homePage-affliated-content-diagnostics ${
              activeTab === "diagnostics" ? "active" : ""
            }`}
          >
            diagnostics
          </div>
        </div>
        <div
          className={`homePage-affliated-suppliers ${
            activeTab === "suppliers" ? "active" : ""
          }`}
        >
          <div
            className={`homePage-affliated-content-suppliers ${
              activeTab === "suppliers" ? "active" : ""
            }`}
          >
            suppliers
          </div>
        </div>
      </div>
    </div>
  );
}
