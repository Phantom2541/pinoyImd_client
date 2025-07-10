import React, { useMemo } from "react";
import "./style.css";

export default function CardioGraph({
  color = "#00f1ff",
  waves = 8,
  className = "",
}) {
  const baseline = 50;

  // ✅ Generate a unique path ID for each wave instance
  const pathId = useMemo(
    () => `ecg-path-${Math.random().toString(36).substring(2, 9)}`,
    []
  );

  // ✅ Wave pattern templates (with random heights)
  const waveTypes = [
    // Normal ECG beat
    (x) => {
      let d = "";
      const p = baseline - (8 + Math.random() * 4);
      const q = baseline + (8 + Math.random() * 4);
      const r = baseline - (35 + Math.random() * 5);
      const s = baseline + (20 + Math.random() * 10);
      const t = baseline - (5 + Math.random() * 3);
      d += ` L${(x += 10)},${baseline}`;
      d += ` L${(x += 5)},${p.toFixed(0)}`;
      d += ` L${(x += 5)},${baseline}`;
      d += ` L${(x += 5)},${q.toFixed(0)}`;
      d += ` L${(x += 5)},${r.toFixed(0)}`;
      d += ` L${(x += 5)},${s.toFixed(0)}`;
      d += ` L${(x += 5)},${baseline}`;
      d += ` L${(x += 5)},${t.toFixed(0)}`;
      d += ` L${(x += 5)},${baseline}`;
      return { d, x };
    },

    // Flat line
    (x) => {
      let d = ` L${(x += 60)},${baseline}`;
      return { d, x };
    },

    // Small pulse
    (x) => {
      let d = "";
      const h = 15 + Math.random() * 10;
      d += ` L${(x += 10)},${baseline}`;
      d += ` L${(x += 5)},${baseline - h}`;
      d += ` L${(x += 5)},${baseline + h}`;
      d += ` L${(x += 5)},${baseline}`;
      return { d, x };
    },

    // Double bump
    (x) => {
      let d = "";
      const h1 = 10 + Math.random() * 5;
      const h2 = 12 + Math.random() * 6;
      d += ` L${(x += 10)},${baseline}`;
      d += ` L${(x += 5)},${baseline - h1}`;
      d += ` L${(x += 5)},${baseline}`;
      d += ` L${(x += 5)},${baseline - h2}`;
      d += ` L${(x += 5)},${baseline}`;
      return { d, x };
    },

    // Sharp spike
    (x) => {
      let d = "";
      const r = baseline - (35 + Math.random() * 5);
      const s = baseline + (20 + Math.random() * 10);
      d += ` L${(x += 5)},${r}`;
      d += ` L${(x += 5)},${s}`;
      d += ` L${(x += 5)},${baseline}`;
      return { d, x };
    },
  ];

  // ✅ Construct path with randomized wave types
  const pathData = useMemo(() => {
    let d = `M0,${baseline}`;
    let currentX = 0;

    // Generate random x positions for the waves
    const positions = Array.from(
      { length: waves },
      () => Math.floor(Math.random() * (3000 - 200)) // leave space at end
    ).sort((a, b) => a - b);

    for (const pos of positions) {
      // Fill flat line up to the wave start
      if (currentX < pos) {
        d += ` L${pos},${baseline}`;
        currentX = pos;
      }

      const randomWave =
        waveTypes[Math.floor(Math.random() * waveTypes.length)];
      const result = randomWave(currentX);
      d += result.d;
      currentX = result.x;

      // Optional: add random spacing after wave
      currentX += 10 + Math.random() * 10;
    }

    // Finish with flat line to end
    d += ` L3000,${baseline}`;
    return d;
  }, [waves]);

  return (
    <div className={`ecg-wrapper ${className}`}>
      <svg
        viewBox="0 0 3000 100"
        preserveAspectRatio="none"
        className="ecg-line"
      >
        <defs>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dot-glow">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          id={pathId}
          d={pathData}
          stroke={color}
          strokeWidth="2"
          fill="none"
          filter="url(#line-glow)"
          opacity="0.1"
        />
      </svg>

      <svg
        className="ecg-dot-layer"
        viewBox="0 0 3000 100"
        preserveAspectRatio="xMinYMid meet"
      >
        <circle r="6" fill={color} filter="url(#dot-glow)" opacity="0.3">
          <animateMotion dur="20s" repeatCount="indefinite">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      </svg>
    </div>
  );
}
