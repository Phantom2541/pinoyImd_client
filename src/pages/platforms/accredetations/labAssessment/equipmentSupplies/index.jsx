import { useSelector } from "react-redux";
import { ENDPOINT } from "../../../../../services/utilities";
import "./style.css";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import ImageDragAndDrop from "../../../../../components/images/dragAndDrop/dragNdroping";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PlantEnvironment() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch;

  const inventoryList = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/labEquipments/inventoryList.png`;

  const preventiveMaintenance = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/labEquipments/preventiveMaintenance.png`;

  const calibrationCertificate = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/labEquipments/calibrationCertificate.png`;

  const reagentTracking = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/labEquipments/reagentTracking.png`;

  const inspectionReport = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/labEquipments/inspectionReport.png`;

  const maintenanceDuty = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/labEquipments/maintenanceDuty.png`;

  const [savedImage, setSavedImage] = useState(null);

  const handleImageChange = (file, imageUrl) => {
    console.log("savedImage", savedImage);

    setSavedImage(imageUrl);
  };

  return (
    <div
      className="template-cards-container d-flex justify-content-center align-items-center"
      style={{ height: "80vh", width: "80vw", padding: 0, margin: 0 }}
    >
      <div className="card shadow rounded w-100 h-100">
        <div className="card-header bg-blue text-dark font-weight-bold">
          Inventory List
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop img={inventoryList} savedImg={handleImageChange} />
        </div>
      </div>
      <div className="card shadow rounded w-100 h-100">
        <div className="card-header bg-blue text-dark font-weight-bold">
          Preventive Maintenance Records
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop
            img={preventiveMaintenance}
            savedImg={handleImageChange}
          />
        </div>
      </div>
      <div className="card shadow rounded w-100 h-100">
        <div className="card-header bg-blue text-dark font-weight-bold">
          Calibration Certificates
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop
            img={calibrationCertificate}
            savedImg={handleImageChange}
          />
        </div>
      </div>
      <div className="card shadow rounded w-100 h-100">
        <div className="card-header bg-blue text-dark font-weight-bold">
          Reagent Lot and Expiry Tracking
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop
            img={reagentTracking}
            savedImg={handleImageChange}
          />
        </div>
      </div>
      <div className="card shadow rounded w-100 h-100">
        <div className="card-header bg-blue text-dark font-weight-bold">
          Receiving & Inspection Checklist
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop
            img={inspectionReport}
            savedImg={handleImageChange}
          />
        </div>
      </div>
      <div className="card shadow rounded w-100 h-100">
        <div className="card-header bg-blue text-dark font-weight-bold">
          Assigned Personnel
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop
            img={maintenanceDuty}
            savedImg={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
}
