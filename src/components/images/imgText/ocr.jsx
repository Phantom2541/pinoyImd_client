import React, { useState } from "react";
// import Tesseract from "tesseract.js";
import HMONAME from "../../../services/fakeDb/hmo/collections.json";

const OCRReader = () => {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [rawText, setRawText] = useState("");
  const [parsedText, setParsedText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usePreprocessing, setUsePreprocessing] = useState(true);

  const handleFile = (file) => {
    const fileURL = URL.createObjectURL(file);
    setImage(fileURL);

    const img = new Image();
    img.src = fileURL;
    img.onload = () => {
      const fullImage = usePreprocessing ? preprocessImage(img) : fileURL;
      if (usePreprocessing) setProcessedImage(fullImage);
      extractText(fullImage);
    };
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const preprocessImage = (img) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scale = 3;
    const width = img.width * scale;
    const height = img.height * scale;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    let imageData = ctx.getImageData(0, 0, width, height);
    let data = imageData.data;

    // Step 1: Grayscale
    const gray = new Uint8ClampedArray(data.length);
    for (let i = 0; i < data.length; i += 4) {
      const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      gray[i] = gray[i + 1] = gray[i + 2] = g;
      gray[i + 3] = 255;
    }

    // Step 2: Blur for unsharp mask
    const blurred = new Uint8ClampedArray(data.length);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            sum += gray[idx];
          }
        }
        const avg = sum / 9;
        const i = (y * width + x) * 4;
        blurred[i] = blurred[i + 1] = blurred[i + 2] = avg;
        blurred[i + 3] = 255;
      }
    }

    // Step 3: Unsharp mask (sharpen)
    for (let i = 0; i < gray.length; i += 4) {
      const orig = gray[i];
      const blur = blurred[i];
      const sharp = orig + (orig - blur);
      const clamped = Math.max(0, Math.min(255, sharp));
      data[i] = data[i + 1] = data[i + 2] = clamped;
      data[i + 3] = 255;
    }

    // Step 4: Contrast boost
    const contrast = 1.5; // adjust between 1.2 to 2.0
    const midpoint = 128;
    for (let i = 0; i < data.length; i += 4) {
      const adjust = (val) =>
        Math.max(0, Math.min(255, contrast * (val - midpoint) + midpoint));

      data[i] = adjust(data[i]); // R
      data[i + 1] = adjust(data[i + 1]); // G
      data[i + 2] = adjust(data[i + 2]); // B
      // alpha remains 255
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  };

  const extractText = (imageSrc) => {
    setLoading(true);
    setRawText("");
    setParsedText(null);

    // Tesseract.recognize(imageSrc, "eng", {
    //   logger: (m) => console.log(m),
    // })
    //   .then(({ data: { text } }) => {
    //     console.log("OCR TEXT:", text);
    //     setRawText(text);
    //     setParsedText(parseText(text));
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setLoading(false);
    //   });
  };

  const detectHMO = (text) => {
    const cleanedText = text.toLowerCase().replace(/\s+/g, "");
    const match = HMONAME.find((item) =>
      cleanedText.includes(item.abbr.toLowerCase().replace(/\s+/g, ""))
    );
    return match?.abbr || "Not Detected";
  };

  const cleanNumber = (raw) => {
    const digits = raw
      .replace(/[DO]/gi, "0")
      .replace(/[Il|]/g, "1")
      .replace(/[^0-9]/g, "");

    if (!digits || digits.length < 8) return "Not Detected";

    return digits.match(/.{1,4}/g)?.join(" ");
  };

  const extractNumber = (text) => {
    const lines = text.split("\n").map((line) => line.trim());

    for (let line of lines) {
      // 1. Remove non-digit characters
      const digitsOnly = line.replace(/[^\d]/g, "");

      // 2. Accept numbers with 8 to 20 digits
      if (digitsOnly.length >= 8 && digitsOnly.length <= 20) {
        return cleanNumber(digitsOnly);
      }

      // 3. Optionally check for grouped number formats
      const spaced = line.match(/(?:\d{4}[\s-]?){2,5}/g);
      if (spaced) {
        return cleanNumber(spaced[0]);
      }
    }

    return "Not Detected";
  };

  const parseText = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    let hmo = "Not Detected";
    let name = "Not Detected";
    let number = extractNumber(text);

    for (let line of lines) {
      const detected = detectHMO(line);
      if (detected !== "Not Detected") hmo = detected;

      if (
        /^[A-Z ]{8,}$/.test(line) &&
        line.includes(" ") &&
        name === "Not Detected"
      ) {
        name = line;
      }
    }

    return { hmo, number, name };
  };
  console.log(parseText("sample"));

  return (
    <div style={{ padding: 20 }}>
      <h2>HMO Card OCR Scanner</h2>

      <label style={{ marginBottom: 10, display: "block" }}>
        <input
          type="checkbox"
          checked={usePreprocessing}
          onChange={(e) => setUsePreprocessing(e.target.checked)}
        />
        Enable Preprocessing
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #aaa",
          padding: 40,
          borderRadius: 10,
          textAlign: "center",
          backgroundColor: "#fafafa",
          marginBottom: 20,
        }}
      >
        <p>📂 Drag and drop an image here</p>
        <p>or</p>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {image && (
        <>
          <h4>🖼 Original Image</h4>
          <img
            src={image}
            alt="HMO Card Preview"
            style={{ maxWidth: "100%", maxHeight: 300, marginBottom: 10 }}
          />
        </>
      )}

      {processedImage && (
        <>
          <h4>🎨 Enhanced Image for OCR</h4>
          <img
            src={processedImage}
            alt="Enhanced for OCR"
            style={{ maxWidth: "100%", maxHeight: 300, marginTop: 10 }}
          />
        </>
      )}

      {loading && <p>🔍 Scanning image...</p>}

      {parsedText && (
        <div style={{ marginTop: 20 }}>
          <h3>🧾 Extracted Details:</h3>
          <ul style={{ listStyle: "none", background: "#f4f4f4", padding: 10 }}>
            <li>
              <strong>HMO Card:</strong> {parsedText.hmo}
            </li>
            <li>
              <strong>Number:</strong> {parsedText.number}
            </li>
            <li>
              <strong>Name:</strong> {parsedText.name}
            </li>
          </ul>
        </div>
      )}

      {rawText && (
        <details style={{ marginTop: 10 }}>
          <summary style={{ cursor: "pointer" }}>📄 Raw OCR Output</summary>
          <pre style={{ background: "#eee", padding: 10, marginTop: 10 }}>
            {rawText}
          </pre>
        </details>
      )}
    </div>
  );
};

export default OCRReader;
