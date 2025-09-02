import { useSelector } from "react-redux";
import { ENDPOINT } from "../../../../../../services/utilities";
import "./style.css";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import ImageDragAndDrop from "../../../../../../components/images/dragAndDrop/dragNdroping";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function LicenseOperate() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch;

  const LTO = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/licenseToOperate.png`;
  const [savedImage, setSavedImage] = useState(null);

  const handleImageChange = (file, imageUrl) => {
    console.log("savedImage", savedImage);

    setSavedImage(imageUrl);
  };

  return (
    <div
      className="template-cards-container d-flex justify-content-center align-items-center"
      style={{ height: "70vh", width: "80vw", padding: 0, margin: 0 }}
    >
      <div
        className="card shadow rounded"
        style={{
          width: "50vw",
          height: "100%",
        }}
      >
        <div className="card-header bg-blue text-dark font-weight-bold">
          DOH-LTO
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop img={LTO} savedImg={handleImageChange} />
        </div>
      </div>
    </div>
  );
}
