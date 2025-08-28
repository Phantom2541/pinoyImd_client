import { useSelector } from "react-redux";
import { ENDPOINT } from "../../../../../../services/utilities";
import "./style.css";
import { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import ImageDragAndDrop from "../../../../../../components/images/imageDragAndDrop/dragNdroping";

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ✅ Component to preview only the first page of the PDF
function PDFPreview({ url }) {
  const containerRef = useRef();

  useEffect(() => {
    const renderPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const container = containerRef.current;
      container.innerHTML = ""; // clear previous renders

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        canvas.style.marginBottom = "20px"; // spacing between pages
        container.appendChild(canvas);
      }
    };

    renderPDF();
  }, [url]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", overflowY: "auto", maxHeight: "100%" }}
    />
  );
}

export default function HandlingComplaint() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch;

  const feedback = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/handlingComplaint/feedbackForm.png`;

  const suggestionBoxSetup = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/handlingComplaint/suggestionBoxSetup.png`;

  const protocol = `${ENDPOINT}/public/companies/${encodeURIComponent(
    companyId.name
  )}/Documents/handlingComplaint/protocol.pdf`;

  const [savedImage, setSavedImage] = useState(null);

  const handleImageChange = (file, imageUrl) => {
    console.log("savedImage", savedImage);

    setSavedImage(imageUrl);
  };

  return (
    <div
      className="template-cards-container d-flex justify-content-center align-items-center flex-wrap gap-3"
      style={{ height: "110vh", width: "80vw", padding: 0, margin: 0 }}
    >
      {/* PDF Preview */}
      <div
        className="card shadow rounded"
        style={{ width: "65%", height: "80%" }}
      >
        <div className="card-header bg-blue text-dark font-weight-bold">
          Policy on Handling Complaints
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <PDFPreview url={protocol} />
        </div>
      </div>

      {/* Feedback Form Image */}
      <div
        className="card shadow rounded"
        style={{ width: "65%", height: "120%" }}
      >
        <div className="card-header bg-blue text-dark font-weight-bold">
          Feedback Form
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop img={feedback} savedImg={handleImageChange} />
        </div>
      </div>

      {/* Suggestion Box Setup Image */}
      <div
        className="card shadow rounded"
        style={{ width: "65%", height: "80%" }}
      >
        <div className="card-header bg-blue text-dark font-weight-bold">
          Suggestion Box Setup
        </div>
        <div className="card-img-top w-100 card-preview-container">
          <ImageDragAndDrop
            img={suggestionBoxSetup}
            savedImg={handleImageChange}
          />
        </div>
      </div>
    </div>
  );
}
