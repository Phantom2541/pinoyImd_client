import React, { useRef, useEffect, useState } from "react";
import "./style.css";

export default function Marquee({
  message = "This Content is Exclusively Intended for Demonstration and is not to be Used for Official Purposes.",
  className = "",
  speed = 300, // pixels per second (fixed speed)
  daysLeft = 1, // number of days left
  baseShowAfter = 5, // starting value
  baseHideAfter = 5, // starting value
}) {
  const spanRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(1);
  const [duration, setDuration] = useState(0);
  const [visible, setVisible] = useState(false);

  // 🟢 Compute dynamic show/hide based on daysLeft
  const showAfter = Math.max(0.5, baseShowAfter * (daysLeft / 10));
  const hideAfter = (baseHideAfter * (11 - daysLeft)) / 10 + baseHideAfter;

  useEffect(() => {
    let timerId;

    const toggleVisibility = () => {
      setVisible((prev) => !prev);
      const nextDelay = (visible ? hideAfter : showAfter) * 1000;
      timerId = setTimeout(toggleVisibility, nextDelay);
    };

    timerId = setTimeout(toggleVisibility, showAfter * 1000);

    return () => clearTimeout(timerId);
  }, [showAfter, hideAfter, daysLeft, visible]);

  useEffect(() => {
    const span = spanRef.current;
    if (!span) return;

    const spanWidth = span.offsetWidth;
    const containerWidth = window.innerWidth;
    const count = Math.ceil((containerWidth * 2) / spanWidth) + 1;
    setRepeatCount(count);

    const totalWidth = spanWidth * count;
    setDuration(totalWidth / speed);
  }, [message, speed]);

  return (
    <div
      className={`demo-notice-container ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <div className="demo-notice-marquee">
        <div
          className="demo-notice-marquee-content"
          style={{ animationDuration: `${duration}s` }}
        >
          {Array.from({ length: repeatCount }).map((_, i) => (
            <span key={i} ref={i === 0 ? spanRef : null}>
              {message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
