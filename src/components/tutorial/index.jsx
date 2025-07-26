import { useEffect, useState, useRef } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
import TypingText from "../typingText";
import tutorialVideo from "./../../assets/iMD_instructor.mp4";

export default function Tutorial({ steps }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [boxDirection, setBoxDirection] = useState("right");
  const instructionRef = useRef(null);
  const videoRef = useRef(null);

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
        const estimatedVideoWidth = 90;
        const margin = 12;
        const totalNeededSpace =
          estimatedBoxWidth + estimatedVideoWidth + margin * 3;

        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;

        setBoxDirection(
          spaceRight < totalNeededSpace && spaceLeft > totalNeededSpace
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

  useEffect(() => {
    if (showTutorial && step?.description) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(step.description);
      utterance.lang = "tl-PH";
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  }, [stepIndex, showTutorial]);

  const videoWidth = 90;
  const videoMargin = 12;
  const instructionWidth = 340;

  const highlightStyle = targetRect
    ? {
        position: "fixed",
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }
    : { display: "none" };

  // const videoStyle = targetRect
  //   ? {
  //       position: "fixed",
  //       top: targetRect.top + targetRect.height - 90,
  //       left:
  //         boxDirection === "right"
  //           ? targetRect.left + targetRect.width + videoMargin
  //           : targetRect.left - videoWidth - videoMargin,
  //       width: videoWidth,
  //       height: 90,
  //       zIndex: 1000000,
  //     }
  //   : { display: "none" };

  const videoHeight = 90;

  const videoStyle = targetRect
    ? (() => {
        let top = targetRect.top + targetRect.height - videoHeight; // default: bottom of highlight-box
        let left =
          boxDirection === "right"
            ? targetRect.left + targetRect.width + videoMargin
            : targetRect.left - videoWidth - videoMargin;

        // Adjust vertically if it overflows below
        if (top + videoHeight > window.innerHeight - 10) {
          top = window.innerHeight - videoHeight - 10; // 10px padding from bottom
        }

        // Adjust horizontally if it overflows right
        if (left + videoWidth > window.innerWidth - 10) {
          left = window.innerWidth - videoWidth - 10;
        }

        // Adjust if it overflows left
        if (left < 10) {
          left = 10;
        }

        // Adjust if it overflows top
        if (top < 10) {
          top = 10;
        }

        return {
          position: "fixed",
          top,
          left,
          width: videoWidth,
          height: videoHeight,
          zIndex: 1000000,
        };
      })()
    : { display: "none" };

  const instructionStyle = targetRect
    ? {
        position: "fixed",
        top: targetRect.top,
        left:
          boxDirection === "right"
            ? targetRect.left +
              targetRect.width +
              videoMargin +
              videoWidth +
              videoMargin
            : targetRect.left - videoWidth - instructionWidth - videoMargin * 2,
      }
    : { display: "none" };

  const startTutorial = () => {
    setStepIndex(0);
    setShowTutorial(true);
    playVideo();
  };

  const endTutorial = () => {
    setShowTutorial(false);
    setTargetRect(null);
    window.speechSynthesis.cancel();
  };

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <>
      <button className="tutorial-button" onClick={startTutorial}>
        <MDBIcon fas icon="question" />
      </button>

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

        {targetRect && (
          <video
            ref={videoRef}
            className={`instructor-video-floating ${boxDirection}`}
            autoPlay
            muted
            loop
            style={videoStyle}
          >
            <source src={tutorialVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <div
          className="instruction-box"
          style={instructionStyle}
          ref={instructionRef}
        >
          <h3>{step.title}</h3>
          {showTutorial && targetRect && (
            <TypingText
              className="instruction-description"
              key={stepIndex}
              text={step.description}
              speed={40}
              startDelay={500}
              onTypingDone={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                }
              }}
            />
          )}

          <div className="instruction-buttons">
            <div className="instruction-btnCloseSkip">
              <button className="instruction-btnClose" onClick={endTutorial}>
                Close
              </button>
              <button
                className="instruction-btnSkip"
                onClick={() => {
                  if (stepIndex < steps.length - 1) {
                    setStepIndex((i) => i + 1);
                    playVideo();
                  } else {
                    endTutorial();
                  }
                }}
              >
                Skip
              </button>
            </div>

            <div className="instruction-btnNBF">
              <button
                className="instruction-btnBack"
                onClick={() => {
                  setStepIndex((i) => i - 1);
                  playVideo();
                }}
                disabled={stepIndex === 0}
              >
                Back
              </button>
              {stepIndex < steps.length - 1 ? (
                <button
                  className="instruction-btnNext"
                  onClick={() => {
                    setStepIndex((i) => i + 1);
                    playVideo();
                  }}
                >
                  Next
                </button>
              ) : (
                <button className="instruction-btnFinish" onClick={endTutorial}>
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
