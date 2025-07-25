// RollingNumber.jsx
import React, { useEffect, useRef, useState, memo } from "react";
import "./style.css";

export default function RollingNumber({
  value = 0,
  precision = 0,
  duration = 300,
  prefix = "₱",
}) {
  const isValidNumber = typeof value === "number" && !isNaN(value);

  const paddedValue = isValidNumber
    ? new Intl.NumberFormat("en-PH", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(value)
    : "-";

  const characters = paddedValue.split("");

  const [digitHeight, setDigitHeight] = useState(20);
  const digitRef = useRef(null);
  const previousValue = useRef(paddedValue);
  const [isRolling, setIsRolling] = useState(false);

  // Calculate digit height only once
  useEffect(() => {
    if (digitRef.current) {
      setDigitHeight(digitRef.current.offsetHeight);
    }
  }, []);

  // Rolling state effect
  useEffect(() => {
    if (paddedValue !== previousValue.current) {
      setIsRolling(true);
      const timer = setTimeout(() => setIsRolling(false), duration);
      previousValue.current = paddedValue;
      return () => clearTimeout(timer);
    }
  }, [paddedValue, duration]);

  return (
    <div
      className={`rolling-number ${isRolling ? "rolling" : ""}`}
      aria-label={`${prefix}${paddedValue}`}
    >
      {prefix && <div className="digit-static">{prefix}</div>}

      {characters.map((char, index) => (
        <MemoDigit
          key={index}
          char={char}
          duration={duration}
          digitHeight={digitHeight}
          digitRef={index === 0 ? digitRef : null}
        />
      ))}
    </div>
  );
}

const Digit = ({ char, duration, digitHeight, digitRef }) => {
  const isDigit = /\d/.test(char);
  const position = isDigit ? parseInt(char, 10) : 0;

  const style = {
    transform: `translateY(-${position * digitHeight}px)`,
    transition: `transform ${duration}ms ease-in-out`,
  };

  return (
    <div className="digit-wrapper" style={{ height: digitHeight }}>
      {isDigit ? (
        <div className="digit-strip" style={style}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              ref={i === 0 ? digitRef : null}
              className="digit"
              key={i}
              style={{ height: digitHeight }}
            >
              {i}
            </div>
          ))}
        </div>
      ) : (
        <div className="digit-static">{char}</div>
      )}
    </div>
  );
};

const MemoDigit = memo(Digit);
