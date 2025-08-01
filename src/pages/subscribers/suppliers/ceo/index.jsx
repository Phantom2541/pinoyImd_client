import React, { useRef, useEffect, useState } from "react";
import "./style.css";

export default function Ceo() {
  const containerRef = useRef(null);
  const [radius, setRadius] = useState("50% 50% 50% 50% / 50% 50% 50% 50%");
  const circleRef = useRef(null);
  const quoteContainerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };
    let frameId;

    const update = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;

      const x = Math.max(Math.min(current.x, 1), -1);
      const y = Math.max(Math.min(current.y, 1), -1);

      // More exaggerated fluid morphing per side
      const tl = 50 + x * 12 + y * 12;
      const tr = 50 - x * 12 + y * 12;
      const br = 50 - x * 12 - y * 12;
      const bl = 50 + x * 12 - y * 12;

      setRadius(`${tl}% ${tr}% ${br}% ${bl}% / ${bl}% ${br}% ${tr}% ${tl}%`);

      container.style.transform = `rotateX(${y * 8}deg) rotateY(${
        x * 8
      }deg) scale(1.03)`;

      frameId = requestAnimationFrame(update);
    };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = (e.clientX - centerX) / (rect.width / 2); // normalized from -1 to 1
      const dy = (e.clientY - centerY) / (rect.height / 2);

      target.x = dx;
      target.y = dy;
    };

    const resetTransform = () => {
      target = { x: 0, y: 0 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", resetTransform);
    update();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", resetTransform);
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const circle = circleRef.current;
    const quoteContainer = quoteContainerRef.current;
    if (!circle || !quoteContainer) return;

    const handleMouseMove = (e) => {
      const rect = quoteContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      circle.style.opacity = 1; // Show circle
    };

    const handleMouseLeave = () => {
      circle.style.opacity = 0; // Hide circle
    };

    quoteContainer.addEventListener("mousemove", handleMouseMove);
    quoteContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      quoteContainer.removeEventListener("mousemove", handleMouseMove);
      quoteContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="supplier-ceo-section">
      <div className="supplier-ceo-title">
        <h1>CEO</h1>
      </div>
      <div className="supplier-ceo-container">
        <div className="supplier-ceo-imgContainer">
          <div
            ref={containerRef}
            className="supplier-ceo-img"
            style={{ borderRadius: radius }}
          >
            <img
              src="https://drive.google.com/thumbnail?id=1a71GS1TCt_D4NsO8TaIN5fPoo_J-SJhN"
              alt="CEO"
            />
          </div>
          <span>Denden Canlas</span>
        </div>
        <div className="supplier-ceo-quoteContainer" ref={quoteContainerRef}>
          <div className="supplier-ceo-quoteCircle" ref={circleRef} />
          <div className="supplier-ceo-quote">
            <span>
              "At the heart of our company is a deep commitment to advancing
              healthcare through innovation, integrity, and reliability. As a
              supplier of medical equipment, we understand that every product we
              deliver plays a critical role in saving lives and supporting
              medical professionals in their mission to heal. It is our
              responsibility—and our honor—to ensure that hospitals, clinics,
              and laboratories are equipped with world-class tools that meet the
              highest standards of safety and precision. We don’t just supply
              equipment; we supply confidence, care, and a promise to always put
              patients first."
            </span>
            <span>— CEO of DEGRAMM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
