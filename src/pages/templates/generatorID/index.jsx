// GeneratorID.js
import React, { useState } from "react";
import Setting from "./setting";
import "./style.css";
import Canvas from "./canvas";
import Properties from "./properties";
import Header from "./header";
import idSizes from "./preset";

export default function GeneratorID() {
  const [selectedSize, setSelectedSize] = useState(idSizes[0]);
  const [mode, setMode] = useState(null); // null | "text"

  return (
    <div>
      <Header
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        setMode={setMode}
        mode={mode}
      />
      <div className="d-flex justify-content-between">
        <Setting />
        <Canvas selectedSize={selectedSize} mode={mode} setMode={setMode} />
        <Properties />
      </div>
    </div>
  );
}
