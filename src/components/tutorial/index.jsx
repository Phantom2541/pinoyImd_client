import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
import TypingText from "../typingText";
import tutorialVideo from "./../../assets/iMD_instructor.mp4";

const VIDEO_WIDTH = 90;
const VIDEO_HEIGHT = 90;
const VIDEO_MARGIN = 12;
const INSTRUCTION_WIDTH = 340;
const ESTIMATED_INSTRUCTION_HEIGHT = 170;
const SPACE_MARGIN = 12;
const TOTAL_NEEDED_SPACE = INSTRUCTION_WIDTH + VIDEO_WIDTH + SPACE_MARGIN * 3;

export default function Tutorial({ steps }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];

  const [targetRect, setTargetRect] = useState(null);
  const [boxDirection, setBoxDirection] = useState("right");
  const [showRequirementWarning, setShowRequirementWarning] = useState(false);
  const [displayedText, setDisplayedText] = useState(step.description);
  const instructionRef = useRef(null);
  const videoRef = useRef(null);

  const playVideo = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const endTutorial = useCallback(() => {
    setShowTutorial(false);
    setTargetRect(null);
    window.speechSynthesis.cancel();

    // 🧹 Reset all data-clicked attributes
    steps.forEach((s) => {
      const el = document.querySelector(s.target);
      if (el?.dataset?.clicked) {
        delete el.dataset.clicked;
      }
    });
  }, [steps]);

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const isRequirementMet = useCallback(() => {
    const step = steps[stepIndex];
    if (!step?.required || !step.target) return true;

    const el = document.querySelector(step.target);
    if (!el) return false;

    if (step.requiredType === "click") {
      return el.dataset.clicked === "true";
    }

    if (step.requiredType === "input") {
      return el.value?.trim() !== "";
    }

    return true;
  }, [steps, stepIndex]);

  useEffect(() => {
    document.body.style.overflow = showTutorial ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showTutorial]);

  useEffect(() => {
    if (!showTutorial) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" && !isLastStep) {
        if (isRequirementMet()) {
          setStepIndex((i) => i + 1);
          setShowRequirementWarning(false);
          playVideo();
        } else {
          // Show warning message + shake
          setDisplayedText("");
          setShowRequirementWarning(false);

          [videoRef.current, instructionRef.current].forEach((el) => {
            if (el) {
              el.classList.add("shake");
              setTimeout(() => el.classList.remove("shake"), 500);
            }
          });

          setTimeout(() => {
            setShowRequirementWarning(true);
            const fallback =
              steps[stepIndex].requiredMessage ||
              "This step is required before continuing.";
            setDisplayedText(fallback);
          }, 500);
        }
      } else if (e.key === "ArrowLeft" && !isFirstStep) {
        setStepIndex((i) => i - 1);
        setShowRequirementWarning(false);
        playVideo();
      } else if (e.key === "Escape") {
        endTutorial();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showTutorial,
    stepIndex,
    isFirstStep,
    isLastStep,
    playVideo,
    endTutorial,
    steps,
    isRequirementMet,
    videoRef,
    instructionRef,
  ]);

  useEffect(() => {
    if (!showTutorial) return;

    const updateRect = () => {
      const el = document.querySelector(step.target);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const newRect = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      };
      setTargetRect(newRect);

      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;

      setBoxDirection(
        spaceRight < TOTAL_NEEDED_SPACE && spaceLeft > TOTAL_NEEDED_SPACE
          ? "left"
          : "right"
      );

      el.scrollIntoView({ behavior: "smooth", block: "center" });
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
  }, [stepIndex, showTutorial, step]);

  const highlightStyle = targetRect
    ? {
        position: "fixed",
        top: targetRect.top,
        left: targetRect.left,
        width: targetRect.width,
        height: targetRect.height,
      }
    : { display: "none" };

  const videoStyle = useMemo(() => {
    if (!targetRect) return { display: "none" };

    let top = targetRect.top + targetRect.height - VIDEO_HEIGHT;
    let left =
      boxDirection === "right"
        ? targetRect.left + targetRect.width + VIDEO_MARGIN
        : targetRect.left - VIDEO_WIDTH - VIDEO_MARGIN;

    top = Math.min(Math.max(10, top), window.innerHeight - VIDEO_HEIGHT - 10);
    left = Math.min(Math.max(10, left), window.innerWidth - VIDEO_WIDTH - 10);

    return {
      position: "fixed",
      top,
      left,
      width: VIDEO_WIDTH,
      height: VIDEO_HEIGHT,
      zIndex: 1000000,
    };
  }, [targetRect, boxDirection]);

  const instructionStyle = useMemo(() => {
    if (!targetRect || !videoStyle.top) return { display: "none" };

    const hasEnoughSpaceTop =
      videoStyle.top - ESTIMATED_INSTRUCTION_HEIGHT > 10;
    const top = hasEnoughSpaceTop
      ? videoStyle.top - ESTIMATED_INSTRUCTION_HEIGHT
      : videoStyle.top + VIDEO_HEIGHT + VIDEO_MARGIN;

    const left =
      boxDirection === "right"
        ? videoStyle.left + VIDEO_WIDTH + VIDEO_MARGIN - 15
        : videoStyle.left - INSTRUCTION_WIDTH - VIDEO_MARGIN + 30;

    const adjustedTop = Math.min(
      Math.max(10, top),
      window.innerHeight - ESTIMATED_INSTRUCTION_HEIGHT - 10
    );
    const adjustedLeft = Math.min(
      Math.max(10, left),
      window.innerWidth - INSTRUCTION_WIDTH - 10
    );

    const videoCenter = videoStyle.left + VIDEO_WIDTH / 2;
    const p =
      boxDirection === "right"
        ? ((videoCenter - adjustedLeft) / INSTRUCTION_WIDTH) * 100 + 25
        : ((videoCenter - adjustedLeft) / INSTRUCTION_WIDTH) * 100 - 18;

    const arrowPosition = hasEnoughSpaceTop ? "top" : "bottom";

    return {
      position: "fixed",
      top: adjustedTop,
      left: adjustedLeft,
      width: INSTRUCTION_WIDTH,
      zIndex: 1000000,
      "--p": `${Math.min(100, Math.max(0, p))}%`,
      "--flipX": boxDirection === "left" ? "-1" : "1",
      "--flipY": arrowPosition === "bottom" ? "-1" : "1",
      arrowPosition,
    };
  }, [targetRect, videoStyle, boxDirection]);

  const startTutorial = () => {
    setStepIndex(0);
    setShowTutorial(true);
    playVideo();
  };

  useEffect(() => {
    if (!showTutorial || !step?.required || step.requiredType !== "click")
      return;

    const el = document.querySelector(step.target);
    if (!el) return;

    const handleClick = () => {
      el.dataset.clicked = "true";
    };

    el.addEventListener("click", handleClick);

    return () => {
      el.removeEventListener("click", handleClick);
    };
  }, [step, showTutorial]);

  useEffect(() => {
    setDisplayedText(steps[stepIndex].description);
    setShowRequirementWarning(false);
  }, [stepIndex, steps]);

  return (
    <>
      <div className="tutorial-button-wrapper" onClick={startTutorial}>
        <button className="tutorial-button">
          <MDBIcon className="tutorial-question-icon" fas icon="question" />
        </button>
      </div>

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
          data-arrow-position={instructionStyle.arrowPosition}
          style={instructionStyle}
          ref={instructionRef}
        >
          <h3>{step.title}</h3>
          {showTutorial && targetRect && (
            <TypingText
              className="instruction-description"
              key={stepIndex + (showRequirementWarning ? "-warn" : "-desc")}
              text={displayedText}
              speed={40}
              startDelay={500}
              onTypingDone={() => videoRef.current?.pause()}
            />
          )}

          <div className="instruction-buttons">
            <div className="instruction-btnCloseSkip">
              <button className="instruction-btnClose" onClick={endTutorial}>
                <MDBIcon icon="times" />
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
                disabled={false}
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
                disabled={isFirstStep}
              >
                Back
              </button>
              {!isLastStep ? (
                <button
                  className={`instruction-btnNext ${
                    !isRequirementMet() ? "tutorial-disabled " : ""
                  }`}
                  onClick={() => {
                    if (isRequirementMet()) {
                      setStepIndex((i) => i + 1);
                    } else {
                      // Step 1: Clear text
                      setDisplayedText(""); // ← hide description
                      setShowRequirementWarning(false);

                      // Step 2: Add shake
                      [videoRef.current, instructionRef.current].forEach(
                        (el) => {
                          if (el) {
                            el.classList.add("shake");
                            setTimeout(() => el.classList.remove("shake"), 500);
                          }
                        }
                      );

                      // Step 3: Show required message after delay
                      setTimeout(() => {
                        setShowRequirementWarning(true);
                        const fallback =
                          steps[stepIndex].requiredMessage ||
                          "This step is required before continuing.";
                        setDisplayedText(fallback);
                      }, 500);
                    }
                  }}
                  disabled={false} // ← wag i-disable para pwede i-trigger yung shake
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
