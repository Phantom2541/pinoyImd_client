import { useEffect, useState } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";

export default function Tutorial({ steps }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [boxDirection, setBoxDirection] = useState("right");

  const step = steps[stepIndex];

  useEffect(() => {
    if (!showTutorial) return;

    const updateRect = () => {
      const el = document.querySelector(step.target);
      if (el) {
        const rect = el.getBoundingClientRect();
        const newRect = {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
        setTargetRect(newRect);

        const estimatedBoxWidth = 340;
        const margin = 12;
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;

        setBoxDirection(
          spaceRight < estimatedBoxWidth + margin &&
            spaceLeft > estimatedBoxWidth + margin
            ? "left"
            : "right"
        );

        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 100);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [step, showTutorial]);

  const highlightStyle = targetRect
    ? {
        position: "fixed",
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }
    : { display: "none" };

  const instructionStyle = targetRect
    ? {
        position: "fixed",
        top: targetRect.top,
        left:
          boxDirection === "right"
            ? targetRect.left + targetRect.width + 12
            : targetRect.left - 340 - 12,
      }
    : { display: "none" };

  const startTutorial = () => {
    setStepIndex(0);
    setShowTutorial(true);
  };

  const endTutorial = () => {
    setShowTutorial(false);
    setTargetRect(null);
  };

  return (
    <>
      {/* Button to trigger tutorial */}
      <button className="tutorial-button" onClick={startTutorial}>
        <MDBIcon fas icon="question" />
      </button>

      {/* Show tutorial overlays only if active */}
      <div className={`tutorial-wrapper ${showTutorial ? "show" : "hide"}`}>
        <div className="tutorial-overlay">
          {targetRect && (
            <>
              <div className="overlay top" style={{ height: targetRect.top }} />
              <div
                className="overlay left"
                style={{
                  top: targetRect.top,
                  height: targetRect.height,
                  width: targetRect.left,
                }}
              />
              <div
                className="overlay right"
                style={{
                  top: targetRect.top,
                  height: targetRect.height,
                  left: targetRect.left + targetRect.width,
                }}
              />
              <div
                className="overlay bottom"
                style={{ top: targetRect.top + targetRect.height }}
              />
            </>
          )}
        </div>

        <div className="highlight-box" style={highlightStyle} />

        <div className="instruction-box" style={instructionStyle}>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
          <div className="instruction-buttons">
            <button
              onClick={() => setStepIndex((i) => i - 1)}
              disabled={stepIndex === 0}
            >
              Back
            </button>
            {stepIndex < steps.length - 1 ? (
              <button onClick={() => setStepIndex((i) => i + 1)}>Next</button>
            ) : (
              <button onClick={endTutorial}>Finish</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
