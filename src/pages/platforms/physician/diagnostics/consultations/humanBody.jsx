import React, { useRef, useEffect, useState } from "react";
import BODY from "./../../../../../assets/checkup/humanBody.png";

export default function HumanBody({ setSlide, slide }) {
  const containerRef = useRef(null);
  const bodyRef = useRef(null);

  const medicalHistory = ["FMHx", "PMHx", "PSHx", "OB Gyne Hx"];
  const ancillary = ["Laboratory", "Radiology", "Vital"];

  const organs = [
    { name: "heart", style: { top: "25%", left: "42%" } },
    { name: "leftLung", style: { top: "40%", left: "42%" } },
    { name: "liver", style: { top: "60%", left: "42%" } },
    { name: "largeIntestine", style: { top: "75%", left: "42%" } },
    { name: "rightLung", style: { top: "30%", left: "54%" } },
    { name: "stomach", style: { top: "50%", left: "54%" } },
    { name: "smallIntestine", style: { top: "67%", left: "54%" } },
  ];

  const textRefs = useRef({});
  const organRefs = useRef({});
  const [lines, setLines] = useState([]);

  const getLinePoints = () => {
    if (!containerRef.current) return [];
    const rect = containerRef.current.getBoundingClientRect();

    const pairs = [
      ["PMHx", "leftLung"],
      ["FMHx", "heart"],
      ["PSHx", "liver"],
      ["OB Gyne Hx", "largeIntestine"],
      ["Laboratory", "rightLung"],
      ["Radiology", "stomach"],
      ["Vital", "smallIntestine"],
    ];

    return pairs.flatMap(([text, organ]) => {
      const tEl = textRefs.current[text];
      const oEl = organRefs.current[organ];
      if (!tEl || !oEl) return [];

      const tRect = tEl.getBoundingClientRect();
      const oRect = oEl.getBoundingClientRect();

      const side = medicalHistory.includes(text) ? "right" : "left";
      const gap = 6;

      const x1 =
        side === "left"
          ? tRect.left - rect.left - gap
          : tRect.right - rect.left + gap;
      const y1 = tRect.top + tRect.height / 2 - rect.top;

      const x2 = oRect.left + oRect.width / 2 - rect.left;
      const y2 = oRect.top + oRect.height / 2 - rect.top;

      return [{ x1, y1, x2, y2, text }];
    });
  };

  useEffect(() => {
    const update = () => setLines(getLinePoints());
    update();

    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    if (bodyRef.current) bodyRef.current.addEventListener("load", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      if (bodyRef.current) bodyRef.current.removeEventListener("load", update);
    };
  }, []);

  return (
    <div
      className="checkup-data-center-image"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      {/* SVG Lines */}
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        {lines.map((ln, i) => (
          <g key={i}>
            <line
              x1={ln.x1}
              y1={ln.y1}
              x2={ln.x2}
              y2={ln.y2}
              stroke="black"
              strokeWidth={slide === ln.text ? 3 : 1} // Active line thicker
              strokeOpacity={slide === ln.text ? 1 : 0.3} // Active line solid
              strokeLinecap="round"
              style={{
                transition: "stroke-width 0.3s ease, stroke-opacity 0.3s ease",
              }}
            />
            <circle
              cx={ln.x1}
              cy={ln.y1}
              r={slide === ln.text ? 4 : 2} // Active circle bigger
              fill={slide === ln.text ? "black" : "gray"}
              style={{ transition: "r 0.3s ease, fill 0.3s ease" }}
            />
            <circle
              cx={ln.x2}
              cy={ln.y2}
              r={slide === ln.text ? 4 : 2}
              fill={slide === ln.text ? "black" : "gray"}
              style={{ transition: "r 0.3s ease, fill 0.3s ease" }}
            />
          </g>
        ))}
      </svg>

      {/* Medical History Buttons */}
      <div className="checkup-data-center-image-medical-history">
        {medicalHistory.map((text) => (
          <button
            key={text}
            ref={(el) => (textRefs.current[text] = el)}
            onClick={() => setSlide(slide === text ? "" : text)} // toggle
            className={slide === text ? "active" : ""}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Human Body Image & Organs */}
      <div
        className="checkup-data-center-image-full-body"
        style={{ position: "relative" }}
      >
        <img
          alt="human body"
          src={BODY}
          ref={bodyRef}
          className={`checkup-data-center-image-body ${
            slide ? "active-hover" : ""
          }`}
          draggable={false}
          onClick={() => setSlide("")}
        />

        {organs.map(({ name, style }) => (
          <div
            key={name}
            ref={(el) => (organRefs.current[name] = el)}
            style={{ position: "absolute", width: 10, height: 10, ...style }}
          />
        ))}
      </div>

      {/* Ancillary Buttons */}
      <div className="checkup-data-center-image-Ancillary">
        {ancillary.map((text) => (
          <button
            key={text}
            ref={(el) => (textRefs.current[text] = el)}
            onClick={() => setSlide(slide === text ? "" : text)} // toggle
            className={slide === text ? "active" : ""}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
