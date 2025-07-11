import React, { useRef, useState, useEffect } from "react";
import { MDBIcon } from "mdbreact";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";
import "./style.css";

const hmoProviders = [
  /*...unchanged list...*/
];

const extractHMOInfo = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  let provider = "",
    cardNumber = "",
    fullName = "";

  for (let line of lines) {
    const cleanLine = line.replace(/[^a-zA-Z0-9\s:]/g, "");
    const match = hmoProviders.find((prov) =>
      cleanLine.toLowerCase().includes(prov.toLowerCase())
    );
    if (match) provider = match;
    if (!cardNumber && /\d{8,16}/.test(cleanLine)) {
      cardNumber = cleanLine.match(/\d{8,16}/)[0];
    }
    if (!fullName && /name[:\s]/i.test(cleanLine)) {
      fullName = cleanLine.replace(/name[:\s]*/i, "");
    } else if (!fullName && /^[A-Z\s]{8,}$/.test(cleanLine)) {
      fullName = cleanLine;
    }
  }

  return { provider, cardNumber, fullName };
};

const HMOCapture = () => {
  const webcamRef = useRef(null);
  const cameraWrapperRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (fullScreen) {
      document.body.classList.add("camera-open");
    } else {
      document.body.classList.remove("camera-open");
    }
  }, [fullScreen]);

  const openCamera = () => {
    setShowCamera(true);
    setFullScreen(true);
    setTimeout(() => window.scrollTo(0, 0), 50);

    const el = cameraWrapperRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen().catch((err) => console.warn("FS Error:", err));
    } else if (el?.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el?.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  };

  const capture = () => {
    if (!webcamRef.current || !cameraWrapperRef.current) {
      setError("Camera not ready. Please allow camera access.");
      return;
    }

    const screenshot = webcamRef.current.getScreenshot();

    if (!screenshot) {
      setError("Failed to capture image. Please ensure camera is active.");
      return;
    }

    // Create image element
    const img = new Image();
    img.src = screenshot;
    img.onload = () => {
      const container = cameraWrapperRef.current;
      const overlay = container.querySelector(".hmocapture-overlay-frame");

      if (!overlay) {
        setError("Overlay not found.");
        return;
      }

      // Get DOM coordinates
      const overlayRect = overlay.getBoundingClientRect();
      const videoRect = webcamRef.current.video.getBoundingClientRect();

      // Calculate relative position inside video
      const scaleX = img.width / videoRect.width;
      const scaleY = img.height / videoRect.height;

      const cropX = (overlayRect.left - videoRect.left) * scaleX;
      const cropY = (overlayRect.top - videoRect.top) * scaleY;
      const cropWidth = overlayRect.width * scaleX;
      const cropHeight = overlayRect.height * scaleY;

      // Crop with canvas
      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const croppedDataUrl = canvas.toDataURL("image/jpeg");

      setError("");
      setImageSrc(croppedDataUrl);
      processOCR(croppedDataUrl);
    };
  };

  const processOCR = async (img) => {
    setLoading(true);
    setOcrResult(null);
    try {
      const result = await Tesseract.recognize(img, "eng");
      const text = result.data.text;
      const extracted = extractHMOInfo(text);
      setOcrResult({ raw: text, ...extracted });
    } catch (err) {
      console.error("OCR failed", err);
      setOcrResult({ raw: "", error: "OCR failed" });
    }
    setLoading(false);
  };

  const retake = () => {
    setImageSrc(null);
    setOcrResult(null);
    setShowCamera(false);
    setFullScreen(false);
    setError("");

    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .catch((err) => console.warn("Exit FS error:", err));
    }
  };

  return (
    <div
      ref={cameraWrapperRef}
      className={`hmocapture-container ${fullScreen ? "fullscreen" : ""}`}
    >
      {imageSrc ? (
        <>
          <img src={imageSrc} alt="Captured" className="hmocapture-image" />
          {loading ? (
            <p>🔄 Processing OCR...</p>
          ) : ocrResult ? (
            <>
              <h4>Extracted Info</h4>
              <p>
                <strong>Provider:</strong> {ocrResult.provider || "Not found"}
              </p>
              <p>
                <strong>Name:</strong> {ocrResult.fullName || "Not found"}
              </p>
              <p>
                <strong>Card Number:</strong>{" "}
                {ocrResult.cardNumber || "Not found"}
              </p>
              {/* <pre className="hmocapture-pre">{ocrResult.raw}</pre> */}
            </>
          ) : null}
          <button onClick={retake} style={{ marginTop: 10 }}>
            🔁 Retake
          </button>
        </>
      ) : !showCamera ? (
        <button className="hmocapture-photo bg-primary" onClick={openCamera}>
          📷 Take Photo of HMO Card
        </button>
      ) : (
        <>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: fullScreen ? "100vh" : "auto",
            }}
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              onUserMedia={() => setIsWebcamReady(true)}
              onUserMediaError={(err) => {
                console.error("Webcam error", err);
                setError("Camera access was blocked.");
              }}
              videoConstraints={{
                facingMode: "environment",
                width: window.innerWidth,
                height: window.innerHeight,
              }}
              className={`hmocapture-webcam ${fullScreen ? "fullscreen" : ""}`}
            />
            <div className="hmocapture-overlay-frame">
              <span className="hmocapture-corner hmocapture-top-right"></span>
              <span className="hmocapture-corner hmocapture-bottom-left"></span>
            </div>
            <div className="hmocapture-instruction">
              Align your HMO card within the frame
            </div>
            <button
              onClick={capture}
              disabled={!isWebcamReady}
              className="hmocapture-button"
            >
              <div />
            </button>
            <button onClick={retake} className="hmocapture-button-cancel">
              <MDBIcon fas icon="times" />
            </button>
          </div>
          {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default HMOCapture;
