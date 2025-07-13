import React from "react";
import { useSelector } from "react-redux";
import "./style.css";
import { ENDPOINT } from "./../../../../../services/utilities";
import QrCodeGenerator from "../../../../../components/qrCode";

export default function QrCodePage() {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const { company, branch } = activePlatform;

  return (
    <div className="QrCode-container" style={{ backgroundColor: "#007dfe" }}>
      <div className="QrCode-header">
        <div className="QrCode-logo">
          <img
            draggable={false}
            src={`${ENDPOINT}/public/companies/${company?.name}/logo.png`}
            alt="logo"
          />
          <div className="QrCode-logo-text">
            <span className="QrCode-name">{company?.name}</span>
            <span className="QrCode-subname">{company?.subName}</span>
            <span className="QrCode-branch">{branch?.name} Branch</span>
          </div>
        </div>
        <span className="QrCode-tagline">{company?.tagline}</span>
      </div>
      <div className="QrCode-body">
        <div className="QrCode-img-container">
          <QrCodeGenerator
            size={200}
            value={`${ENDPOINT}/subscriber/${company?._id}`}
          />
        </div>
        <span className="QrCode-text">Scan here to go to the Website</span>
      </div>

      <div className="QrCode-footer">
        <span>Powered by Pinoy iMD - Pinoy Medical Diagnostic</span>
      </div>
    </div>
  );
}
