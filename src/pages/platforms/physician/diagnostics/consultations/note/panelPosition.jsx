import { useState, useEffect } from "react";

export default function usePanelPosition(
  active,
  buttonRef,
  targetSize = { width: 500, height: 500 }
) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    let frame;

    const updateStyle = () => {
      const container = document.querySelector(".checkup-data-container");
      const button = buttonRef.current;
      if (!container || !button) return;

      const btnRect = button.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const buttonCenterX =
        btnRect.left - containerRect.left + btnRect.width / 2;
      const buttonCenterY =
        btnRect.top - containerRect.top + btnRect.height / 2;

      const newStyle = !active
        ? {
            position: "absolute",
            top: buttonCenterY,
            left: buttonCenterX,
            width: btnRect.width,
            height: btnRect.height,
            opacity: 0,
            visibility: "hidden",
            overflow: "hidden",
            transform: "translate(-50%, -50%)",
            transition: "all .5s ease-in-out",
            zIndex: 10,
          }
        : {
            position: "absolute",
            top: "50%",
            left: "50%",
            width: targetSize.width,
            height: targetSize.height,
            opacity: 1,
            visibility: "visible",
            overflow: "visible",
            transform: "translate(-50%, -50%)",
            transition: "all .5s cubic-bezier(0.25,1,0.5,1)",
            zIndex: 120,
          };

      // ✅ set lang if may actual change
      setStyle((prev) => {
        const same =
          Object.keys(newStyle).length === Object.keys(prev).length &&
          Object.entries(newStyle).every(([k, v]) => prev[k] === v);

        return same ? prev : newStyle;
      });
    };

    frame = requestAnimationFrame(updateStyle);
    return () => cancelAnimationFrame(frame);
  }, [active, targetSize, buttonRef]);

  return style;
}
