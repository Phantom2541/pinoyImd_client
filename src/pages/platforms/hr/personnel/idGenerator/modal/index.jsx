import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import {
  TOGGLE,
  NEXT,
  UPDATE,
} from "../../../../../../services/redux/slices/assets/persons/personnels";
import { UPDATE as UPDATEBRANCH } from "../../../../../../services/redux/slices/assets/branches";
import { UPLOAD as UPLOADFBIMG } from "../../../../../../services/redux/slices/assets/persons/auth";
import { Cloudinary } from "../../../../../../services/utilities";
import html2canvas from "html2canvas";
import ID from "./id";
import Setting from "./setting";
import { useToasts } from "react-toast-notifications";

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
    { token, company, activePlatform } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    { addToast } = useToasts(),
    selectedRef = useRef(selected);
  console.log("branch", branch);

  // Sync ref sa latest selected
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

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

      // --- parse dfp from selected kung meron ---
      let selectedDfp = {};
      if (selected?.dfp) {
        try {
          selectedDfp = JSON.parse(selected.dfp);
        } catch (err) {
          console.error("Invalid JSON in selected.dfp:", selected.dfp, err);
        }
      }

      // --- priority: selected.dfp > ctData.dfp ---
      const mergedDfp =
        Object.keys(selectedDfp).length > 0 ? selectedDfp : ctData.dfp || {};

      // Build placedValues
      const dataClone = { ...selected, dfp: mergedDfp };

      const newPlacedValues = Object.entries(mergedDfp).map(([key, p]) => {
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
      });

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

  // Check kung kompleto ang lahat ng value
  const isComplete = placedValues.every((p) => {
    if (["img", "signature"].includes(p.key)) return true;
    const val = (p?.value ?? "").toString().trim();
    return val && val !== "-";
  });

  // --- Updated handleSave ---
  const handleSave = useCallback(async () => {
    if (!frontWrapperRef.current || !backWrapperRef.current) return;

    // Collect dfp (styles only)
    const dfp = placedValues.reduce((acc, { key, value, ...styles }) => {
      acc[key] = styles;
      return acc;
    }, {});

    const currentSelected = selectedRef.current;

    if (!currentSelected?._id) {
      console.error("Cannot save: selected record is undefined or missing _id");
      addToast("Cannot save: selected record is undefined or missing _id", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }

    try {
      await dispatch(
        UPDATE({
          token,
          data: { _id: currentSelected._id, dfp: JSON.stringify(dfp) },
        })
      );
      addToast("DFP saved to DB!", {
        appearance: "success",
        autoDismiss: true,
      });
      console.log("DFP saved for ID:", currentSelected._id);
    } catch (err) {
      console.error("DFP save failed:", err);
      addToast("DFP save failed!", { appearance: "error", autoDismiss: true });
      return;
    }

    if (!isComplete) {
      dispatch(NEXT(activeIndex + 1));
      return;
    }

    addToast("Generating canvas...", { appearance: "info", autoDismiss: true });

    const options = { backgroundColor: null, scale: 2 };
    const frontCanvas = await html2canvas(frontWrapperRef.current, options);
    const backCanvas = await html2canvas(backWrapperRef.current, options);

    const spacing = 25;
    const combinedWidth = frontCanvas.width + spacing + backCanvas.width;
    const combinedHeight = Math.max(frontCanvas.height, backCanvas.height);

    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = combinedWidth;
    combinedCanvas.height = combinedHeight;

    const ctx = combinedCanvas.getContext("2d");
    ctx.drawImage(frontCanvas, 0, 0);
    ctx.drawImage(backCanvas, frontCanvas.width + spacing, 0);

    addToast("Uploading image to Cloudinary...", {
      appearance: "info",
      autoDismiss: true,
    });

    // Convert to Blob
    const combinedBlob = await new Promise((resolve) =>
      combinedCanvas.toBlob(resolve, "image/png", 1.0)
    );

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;

      const empNo = currentSelected?.front?.emp || "NoEmp";
      const dob = currentSelected?.back?.dob
        ? currentSelected.back.dob
        : "NoDOB";
      // const dob = dobRaw.replace(/,/g, "");
      const filenameRaw = `${empNo}-${dob}`;
      const filename = filenameRaw.replace(/\s+/g, "");

      console.log("filename", filename);

      const folderPath = `companies/${company?.name}/${activePlatform?.branch?.name}/ic/generatedID`;

      const form = Cloudinary.buildFileForm(base64data, folderPath, filename);

      try {
        const res = await dispatch(UPLOADFBIMG({ data: form, token }));
        const imgId = res.payload.imgId;

        // Update the branch with the new image ID
        await dispatch(
          UPDATEBRANCH({
            token,
            data: {
              _id: activePlatform.branchId, // branch to update
              icgId: imgId,
            }, // only updating the icgId field
          })
        );
        console.log("form", form);
        console.log("res", res);

        console.log("Uploaded image ID:", imgId);
        addToast("Image uploaded successfully!", {
          appearance: "success",
          autoDismiss: true,
        });
      } catch (err) {
        console.error("Upload failed:", err);
        addToast("Image upload failed!", {
          appearance: "error",
          autoDismiss: true,
        });
      } finally {
        dispatch(NEXT(activeIndex + 1));
      }
    };

    reader.readAsDataURL(combinedBlob);
  }, [
    placedValues,
    dispatch,
    token,
    activeIndex,
    isComplete,
    addToast,
    activePlatform,
    company,
  ]);

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

      // 🔁 Tab = cycle next element (skip img/signature)
      if (e.key === "Tab") {
        e.preventDefault();
        const selectableValues = placedValues.filter(
          (p) => p.key !== "img" && p.key !== "signature"
        );
        if (selectableValues.length === 0) return;

        const currentIndex = selectableValues.findIndex(
          (p) => p.key === selectedKey
        );
        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + 1) % selectableValues.length;

        setSelectedKey(selectableValues[nextIndex].key);
        return;
      }

      if (!selectedKey) return;

      // 🚫 Skip movement if selected is img or signature
      if (selectedKey === "img" || selectedKey === "signature") return;

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
            isComplete={isComplete}
            frontImage={frontImage}
            backImage={backImage}
          />
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
