import React, { useEffect, useRef, useState } from "react";
import { teamImages, firingImages } from "./collections";
import "./style.css";

export default function Gallery() {
  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);

  const defaultSpeed = 0.04; // normal speed
  const scrollSpeed = 0.15; // speed habang scroll
  const [speed, setSpeed] = useState(defaultSpeed);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (leftTrackRef.current && rightTrackRef.current) {
        // gumagalaw left
        leftTrackRef.current.scrollLeft += speedRef.current * delta;
        if (
          leftTrackRef.current.scrollLeft >=
          leftTrackRef.current.scrollWidth / 2
        ) {
          leftTrackRef.current.scrollLeft = 0;
        }
        if (leftTrackRef.current.scrollLeft <= 0) {
          leftTrackRef.current.scrollLeft =
            leftTrackRef.current.scrollWidth / 2;
        }

        // gumagalaw right
        rightTrackRef.current.scrollLeft -= speedRef.current * delta;
        if (rightTrackRef.current.scrollLeft <= 0) {
          rightTrackRef.current.scrollLeft =
            rightTrackRef.current.scrollWidth / 2;
        }
        if (
          rightTrackRef.current.scrollLeft >=
          rightTrackRef.current.scrollWidth / 2
        ) {
          rightTrackRef.current.scrollLeft = 0;
        }
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Speed control kapag nag-scroll
    let scrollTimeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scroll down
        setSpeed(scrollSpeed);
      } else {
        // Scroll up
        setSpeed(-scrollSpeed);
      }

      lastScrollY = currentScrollY;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setSpeed(defaultSpeed * Math.sign(speedRef.current)); // keep direction
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="homePage-gallery-section">
      <h1 className="homePage-gallery-title">Team Adventures</h1>
      <span className="homePage-gallery-subtitle">
        "A collection of moments that tell our story — from the teamwork that
        drives us forward to the adventures that bring us closer. Every image is
        a glimpse into the passion, unity, and memories we’ve built together."
      </span>
      <div className="homePage-gallery-wrapper">
        {/* LEFT SCROLL */}
        <div className="homePage-gallery-container" ref={leftTrackRef}>
          {[...teamImages, ...teamImages].map((src, i) => (
            <img
              key={`team-${i}`}
              src={src}
              alt={`Team Building ${i}`}
              loading="lazy"
            />
          ))}
        </div>

        {/* RIGHT SCROLL */}
        <div className="homePage-gallery-container" ref={rightTrackRef}>
          {[...firingImages, ...firingImages].map((src, i) => (
            <img
              key={`firing-${i}`}
              src={src}
              alt={`Firing ${i}`}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
