import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCRReader = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractText(file);
    }
  };

  const extractText = (file) => {
    setLoading(true);
    setText("");

    Tesseract.recognize(
      file,
      "eng", // Language: English
      {
        logger: (m) => console.log(m), // Optional: progress log
      }
    )
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>HMO Card OCR Scanner</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {image && (
        <img
          src={image}
          alt="HMO Card Preview"
          style={{ marginTop: 20, maxWidth: "100%", maxHeight: 300 }}
        />
      )}

      {loading && <p>🔍 Scanning image...</p>}

      {text && (
        <div style={{ marginTop: 20 }}>
          <h3>📝 Detected Text:</h3>
          <pre style={{ background: "#f4f4f4", padding: 10 }}>{text}</pre>
        </div>
      )}
    </div>
  );
};

export default OCRReader;
