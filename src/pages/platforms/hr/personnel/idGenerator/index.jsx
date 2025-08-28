import React, { useEffect, useState, useRef, useCallback } from "react";
import ID from "./id";
import Setting from "./setting";
import { useDispatch, useSelector } from "react-redux";
import { CTBROWSE } from "../../../../../services/redux/slices/assets/branches";
import {
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/personnels";
import { fakeEMP as fakeEMPData } from "./fakeDB";
import html2canvas from "html2canvas";

export default function IDGenerator() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [layout, setLayout] = useState("landscape");
  const [placedValues, setPlacedValues] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [employeeClones, setEmployeeClones] = useState({});
  const containerRef = useRef(null);
  const frontWrapperRef = useRef(null);
  const backWrapperRef = useRef(null);

  const { activePlatform, token } = useSelector(({ auth }) => auth);
  const { ct: branch } = useSelector(({ branches }) => branches);
  const { filtered } = useSelector(({ personnels }) => personnels);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      dispatch(CTBROWSE({ token, data: { _id: activePlatform.branchId } }));
      dispatch(BROWSE({ token, branchId: activePlatform.branchId }));
    }
    return () => dispatch(RESET());
  }, [dispatch, token, activePlatform]);

  const activeStaffUsers = (filtered || [])
    .filter((o) => (o.status || "").trim().toLowerCase() === "active")
    .map((o) => o.user);

  useEffect(() => {
    if (!branch?.ct) return;

    let ctData;
    try {
      ctData = JSON.parse(branch.ct);
    } catch (err) {
      console.error("Invalid JSON in branch.ct:", branch.ct, err);
      return;
    }

    setFrontImage(ctData.cf || null);
    setBackImage(ctData.cb || null);
    setLayout(ctData.layout || "landscape");

    // Ensure current employee clone exists
    setEmployeeClones((prev) => {
      if (prev[currentIndex]) return prev;
      const clone = {
        ...fakeEMPData[currentIndex],
        dfp: { ...(ctData.dfp || {}) },
      };
      return { ...prev, [currentIndex]: clone };
    });

    // Build placedValues directly from dfp
    const dataClone = employeeClones[currentIndex] || {
      ...fakeEMPData[currentIndex],
      dfp: { ...(ctData.dfp || {}) },
    };

    const newPlacedValues = Object.entries(dataClone.dfp || {}).map(
      ([key, p]) => {
        const targetSide = p.target === "front" ? "front" : "back";
        const value = dataClone[targetSide]?.[key] || dataClone[key] || "";
        return { key, value, ...p };
      }
    );

    setPlacedValues(newPlacedValues);
  }, [branch, currentIndex, employeeClones]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : fakeEMPData.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < fakeEMPData.length - 1 ? prev + 1 : 0));
  }, []);

  const handleUpdateValue = useCallback(
    (updates) => {
      setEmployeeClones((prev) => {
        const updated = { ...prev };
        const emp = { ...updated[currentIndex] };
        if (!emp.dfp || !emp.dfp[selectedKey]) return updated;

        const newValue =
          typeof updates === "function"
            ? { ...emp.dfp[selectedKey], ...updates(emp.dfp[selectedKey]) }
            : { ...emp.dfp[selectedKey], ...updates };

        emp.dfp[selectedKey] = newValue;
        updated[currentIndex] = emp;

        setPlacedValues((prevValues) =>
          prevValues.map((p) =>
            p.key === selectedKey ? { ...p, ...newValue } : p
          )
        );

        return updated;
      });
    },
    [currentIndex, selectedKey]
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

    const frontCanvas = await html2canvas(frontWrapperRef.current);
    const backCanvas = await html2canvas(backWrapperRef.current);

    const combinedWidth = frontCanvas.width + backCanvas.width + 15;
    const combinedHeight = Math.max(frontCanvas.height, backCanvas.height);

    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = combinedWidth;
    combinedCanvas.height = combinedHeight;
    const ctx = combinedCanvas.getContext("2d");

    ctx.drawImage(frontCanvas, 0, 0);
    ctx.drawImage(backCanvas, frontCanvas.width + 15, 0);

    const dataUrl = combinedCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `id-front-back-${currentIndex}.png`;
    link.click();

    fakeEMPData[currentIndex] = { ...employeeClones[currentIndex] };
    console.log("Saved employee:", fakeEMPData[currentIndex]);

    handleNext();
  }, [currentIndex, employeeClones, handleNext]);

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

      if ((e.key === "s" || e.key === "S") && e.ctrlKey) {
        e.preventDefault();
        handleSave();
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        if (placedValues.length === 0) return;
        const currentIndex = placedValues.findIndex(
          (p) => p.key === selectedKey
        );
        const nextIndex = (currentIndex + 1) % placedValues.length;
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
        case "[":
          if (e.ctrlKey) {
            e.preventDefault();
            handleUpdateValue((prev) => ({
              fontSize: Math.max(1, (prev.fontSize || 14) - 1),
            }));
            return;
          }
          break;
        case "]":
          if (e.ctrlKey) {
            e.preventDefault();
            handleUpdateValue((prev) => ({
              fontSize: (prev.fontSize || 14) + 1,
            }));
            return;
          }
          break;
        case ",":
          e.preventDefault();
          handlePrev();
          return;
        case ".":
          e.preventDefault();
          handleNext();
          return;
        default:
          break;
      }

      if (dx !== 0 || dy !== 0) {
        e.preventDefault();
        handleUpdateValue((prev) => {
          const updated = { ...prev };
          const current = employeeClones[currentIndex]?.dfp[selectedKey] || {};
          updated.x = (current.x || 0) + dx;
          updated.y = (current.y || 0) + dy;
          return updated;
        });
      }
    };

    window.addEventListener("keydown", handleShortcuts);
    return () => window.removeEventListener("keydown", handleShortcuts);
  }, [
    selectedKey,
    placedValues,
    currentIndex,
    employeeClones,
    handleUpdateValue,
    handlePrev,
    handleNext,
    handleSave,
  ]);

  return (
    <div
      className="id-generator-wrapper"
      style={{ display: "flex", justifyContent: "center", gap: "20px" }}
      ref={containerRef}
    >
      {!frontImage || !backImage || placedValues.length === 0 ? (
        <div className="id-generator-skeleton-wrapper">
          <div className="id-generator-skeleton id-generator-id-front"></div>
          <div className="id-generator-skeleton id-generator-id-back"></div>
          <div className="id-generator-skeleton id-generator-settings-panel"></div>
        </div>
      ) : (
        <>
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
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleSave={handleSave}
          />
        </>
      )}
    </div>
  );
}
