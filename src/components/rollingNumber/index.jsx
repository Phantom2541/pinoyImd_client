// RollingNumber.jsx
import React, { useEffect, useRef, useState, memo } from "react";
import "./style.css";

export default function RollingNumber({
  value = 0,
  precision = 0,
  duration = 1000,
  prefix = "₱",
  color = "#1266f1",
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValue = useRef(value);
  const startTime = useRef(null);

  useEffect(() => {
    let animationFrame;
    const startValue = previousValue.current; // magsisimula sa current value
    const endValue = value;
    previousValue.current = value;
    startTime.current = null;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const paddedValue = new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(displayValue);

  const characters = paddedValue.split("");

  return (
    <div
      className="rolling-number"
      style={{ color }}
      aria-label={`${prefix}${paddedValue}`}
    >
      {prefix && <div className="digit-static">{prefix}</div>}
      {characters.map((char, index) => (
        <MemoDigit key={index} char={char} />
      ))}
    </div>
  );
}

const Digit = ({ char }) => {
  const isDigit = /\d/.test(char);
  return (
    <div className="digit-wrapper">
      {isDigit ? (
        <div className="digit">{char}</div>
      ) : (
        <div className="digit-static">{char}</div>
      )}
    </div>
  );
};

const MemoDigit = memo(Digit);
