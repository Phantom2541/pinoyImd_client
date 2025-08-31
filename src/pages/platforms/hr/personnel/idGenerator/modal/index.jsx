import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import {
  TOGGLE,
  NEXT,
  SAVE,
} from "../../../../../../services/redux/slices/assets/persons/personnels";
import html2canvas from "html2canvas";

import ID from "./id";
import Setting from "./setting";

export default function Modal() {
  const [frontImage, setFrontImage] = useState(null),
    [backImage, setBackImage] = useState(null),
    [layout, setLayout] = useState("landscape"),
    [placedValues, setPlacedValues] = useState([]),
    [selectedKey, setSelectedKey] = useState(null),
    containerRef = useRef(null),
    frontWrapperRef = useRef(null),
    backWrapperRef = useRef(null),
    { showModal, selected, activeIndex } = useSelector(
      ({ personnels }) => personnels
    ),
    { ct: branch } = useSelector(({ branches }) => branches),
    { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    if (!branch?.ct || !selected) return;

    let ctData;
    try {
      ctData = JSON.parse(branch.ct);
    } catch (err) {
      console.error("Invalid JSON in branch.ct:", branch.ct, err);
      return;
    }

    // Helper to convert external images to base64
    async function toBase64(url) {
      if (!url) return null;
      try {
        const res = await fetch(url, { mode: "cors" });
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Failed to convert image to base64:", url, err);
        return null;
      }
    }

    async function loadImages() {
      const cfBase64 = await toBase64(ctData.cf);
      const cbBase64 = await toBase64(ctData.cb);

      setFrontImage(cfBase64);
      setBackImage(cbBase64);
      setLayout(ctData.layout || "landscape");

      // Build placedValues directly from dfp + selected
      const dataClone = {
        ...selected,
        dfp: { ...(ctData.dfp || {}) },
      };

      const newPlacedValues = Object.entries(dataClone.dfp || {}).map(
        ([key, p]) => {
          // priority: target from dfp
          let value = dataClone[p.target]?.[key];

          // fallback kung wala sa target
          if (value === undefined || value === "") {
            value =
              dataClone.front?.[key] ||
              dataClone.back?.[key] ||
              dataClone[key] ||
              "";
          }

          return { key, value, ...p };
        }
      );

      setPlacedValues(newPlacedValues);
    }

    loadImages();
  }, [branch, selected]);

  const handleUpdateValue = useCallback(
    (updates, key = selectedKey) => {
      if (!key) return;

      setPlacedValues((prevValues) =>
        prevValues.map((p) =>
          p.key === key
            ? {
                ...p,
                ...(typeof updates === "function" ? updates(p) : updates),
              }
            : p
        )
      );
    },
    [selectedKey]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSelectedKey(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = useCallback(async () => {
    if (!frontWrapperRef.current || !backWrapperRef.current) return;

    const options = { backgroundColor: null, scale: 2 };

    // Render canvases
    const frontCanvas = await html2canvas(frontWrapperRef.current, options);
    const backCanvas = await html2canvas(backWrapperRef.current, options);

    // Convert to blob
    const frontBlob = await new Promise((resolve) =>
      frontCanvas.toBlob(resolve, "image/png", 1.0)
    );
    const backBlob = await new Promise((resolve) =>
      backCanvas.toBlob(resolve, "image/png", 1.0)
    );

    // Generate filenames
    const empNo = selected?.front?.emp || "No Name";
    const dept = selected?.front?.department || "No Department";
    const frontName = `${empNo}-${dept}-front.png`;
    const backName = `${empNo}-${dept}-back.png`;

    // --- File System Access API ---
    try {
      // Save FRONT
      const frontHandle = await window.showSaveFilePicker({
        suggestedName: frontName,
        types: [
          { description: "PNG Image", accept: { "image/png": [".png"] } },
        ],
      });
      const frontWritable = await frontHandle.createWritable();
      await frontWritable.write(frontBlob);
      await frontWritable.close();

      // Save BACK
      const backHandle = await window.showSaveFilePicker({
        suggestedName: backName,
        types: [
          { description: "PNG Image", accept: { "image/png": [".png"] } },
        ],
      });
      const backWritable = await backHandle.createWritable();
      await backWritable.write(backBlob);
      await backWritable.close();
    } catch (err) {
      console.error("Save cancelled or failed:", err);
    }

    // Save styles to DB
    const dfp = placedValues.reduce((acc, { key, value, ...styles }) => {
      acc[key] = styles;
      return acc;
    }, {});
    dispatch(
      SAVE({
        token,
        data: { user: selected._id, dfp: JSON.stringify(dfp) },
      })
    );

    dispatch(NEXT(activeIndex + 1));
  }, [placedValues, dispatch, token, selected, activeIndex]);

  useEffect(() => {
    const handleShortcuts = (e) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      )
        return;

      // 💾 Ctrl+S = Save
      if ((e.key === "s" || e.key === "S") && e.ctrlKey) {
        e.preventDefault();
        handleSave();
        return;
      }

      // 🔁 Tab = cycle next element
      if (e.key === "Tab") {
        e.preventDefault();
        if (placedValues.length === 0) return;
        const currentIndex = placedValues.findIndex(
          (p) => p.key === selectedKey
        );
        const nextIndex =
          currentIndex === -1 ? 0 : (currentIndex + 1) % placedValues.length;
        setSelectedKey(placedValues[nextIndex].key);
        return;
      }

      if (!selectedKey) return;

      const step = e.shiftKey ? 10 : 1;
      let dx = 0,
        dy = 0;

      switch (e.key) {
        case "ArrowUp":
          dy = -step;
          break;
        case "ArrowDown":
          dy = step;
          break;
        case "ArrowLeft":
          dx = -step;
          break;
        case "ArrowRight":
          dx = step;
          break;
        case "[": // Ctrl + [ = decrease font size
          if (e.ctrlKey) {
            e.preventDefault();
            handleUpdateValue((prev) => ({
              fontSize: Math.max(1, (prev.fontSize || 14) - 1),
            }));
            return;
          }
          break;
        case "]": // Ctrl + ] = increase font size
          if (e.ctrlKey) {
            e.preventDefault();
            handleUpdateValue((prev) => ({
              fontSize: (prev.fontSize || 14) + 1,
            }));
            return;
          }
          break;
        default:
          break;
      }

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        handleUpdateValue((prev) => ({
          ...prev,
          x: (prev.x || 0) + dx,
          y: (prev.y || 0) + dy,
        }));
      }
    };

    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, [selectedKey, placedValues, handleUpdateValue, handleSave]);

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={TOGGLE} backdrop size="xl">
      <MDBModalHeader
        toggle={() => handleClose()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        ID GENERATOR
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div
          className="id-generator-wrapper"
          style={{ display: "flex", justifyContent: "center", gap: "20px" }}
          ref={containerRef}
        >
          <ID
            frontImage={frontImage}
            backImage={backImage}
            layout={layout}
            placedValues={placedValues}
            onSelect={setSelectedKey}
            selectedKey={selectedKey}
            handleUpdateValue={handleUpdateValue}
            frontRef={frontWrapperRef}
            backRef={backWrapperRef}
          />
          <Setting
            selectedValue={placedValues.find((p) => p.key === selectedKey)}
            onUpdateValue={handleUpdateValue}
            handleSave={handleSave}
          />
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
