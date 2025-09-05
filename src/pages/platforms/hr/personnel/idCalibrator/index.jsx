import React, { useEffect, useState } from "react";

import "./style.css";
import { fakeEMP } from "./fakeDB";
import ID from "./id";
import Setting from "./toolkit/setting";
import DraggableButtons from "./buttons";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE,
  CTBROWSE,
} from "../../../../../services/redux/slices/assets/branches";
import { Cloudinary } from "../../../../../services/utilities";
import {
  DESTROY_IMG,
  UPLOAD,
} from "../../../../../services/redux/slices/assets/persons/auth";
import { useToasts } from "react-toast-notifications";

import {
  setFrontImage,
  setBackImage,
  setFrontLoading,
  setBackLoading,
  setLayout,
  setFloatingValue,
  setCursorPos,
  setSelectedValue,
  setLoading,
  setEditMode,
} from "../../../../../services/redux/slices/idCard/calibrator";

export default function IdCalibrator() {
  const { activePlatform, token, company } = useSelector(({ auth }) => auth);
  const { ct: branch } = useSelector(({ branches }) => branches);
  const {
      frontImage,
      backImage,
      layout,
      floatingValue,
      selectedSide,
      selectedValue,
      loading,
      editMode,
    } = useSelector(({ idCalibrator }) => idCalibrator),
    dispatch = useDispatch();
  const [placedValues, setPlacedValues] = useState([]);
  const { addToast } = useToasts();

  try {
    const ctData = branch.ct ? JSON.parse(branch.ct) : null;
  } catch (err) {
    console.error("Invalid JSON in branch.ct:", branch.ct, err);
  }

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(
      CTBROWSE({ token, data: { _id: activePlatform.branchId } })
    ).finally(() => dispatch(setLoading(false)));
  }, [activePlatform.branchId, dispatch, token]);

  useEffect(() => {
    if (!branch.ct) return;

    let ctData;
    try {
      ctData = JSON.parse(branch.ct);
    } catch (err) {
      console.error("Invalid JSON in branch.ct:", branch.ct, err);
      return;
    }

    const { icId = {} } = branch || {};

    dispatch(setLayout(ctData.layout || "portrait"));

    const getImg = (isFront = true) => {
      const id = icId?.[isFront ? "front" : "back"];
      if (!id) return null; // 👉 Walang imgId, wag na bumalik ng kahit ano

      return `${Cloudinary.getEndpoint()}/${id}/companies/${company?.name}/${
        activePlatform?.branch?.name
      }/ic/${isFront ? "front" : "back"}`;
    };

    dispatch(setFrontImage(getImg() || null));
    dispatch(setBackImage(getImg(false) || null));
    dispatch(setLoading(false));

    const dfp = ctData.dfp || {};
    const newPlaced = [];

    Object.keys(dfp).forEach((key) => {
      const value =
        fakeEMP.front[key] !== undefined
          ? fakeEMP.front[key]
          : fakeEMP.back[key];

      if (value !== undefined) {
        newPlaced.push({
          id: Date.now() + Math.random(),
          key, // keep original key
          value,
          x: dfp[key].x || 0,
          y: dfp[key].y || 0,
          target: dfp[key].target || "front",
          style: { ...dfp[key] },
        });
      }
    });
    // ✅ If branch.ct exists, hide Setting & Buttons initially
    if (branch.ct && branch.ct.dfp && Object.keys(branch.ct.dfp).length > 0) {
      dispatch(setEditMode(false)); // may laman ang dfp → edit mode on
    } else {
      dispatch(setEditMode(true)); // walang laman ang dfp → edit mode off
    }

    setPlacedValues(newPlaced);
  }, [
    branch,
    activePlatform.branchId,
    company?.name,
    activePlatform?.branch?.name,
    dispatch,
  ]);

  // 🔹 Eto yung onSave arrow function
  const onSave = () => {
    const dfp = {};

    placedValues.forEach((p) => {
      const base = { x: p.x, y: p.y, target: p.target };
      if (p.style) {
        if (p.style.fontFamily) base.fontFamily = p.style.fontFamily;
        if (p.style.fontSize) base.fontSize = parseInt(p.style.fontSize);
        if (p.style.color) base.color = p.style.color;
        if (p.style.fontWeight) base.fontWeight = p.style.fontWeight;
        if (p.style.fontStyle) base.fontStyle = p.style.fontStyle;
        if (p.style.letterSpacing)
          base.letterSpacing = parseInt(p.style.letterSpacing);
        if (p.style.opacity) base.opacity = p.style.opacity;
        if (p.style.borderBottom) base.borderBottom = p.style.borderBottom;

        if (p.style.width) base.width = parseInt(p.style.width);
        if (p.style.height) base.height = parseInt(p.style.height);
        if (p.style.borderRadius)
          base.borderRadius = parseInt(p.style.borderRadius);
        if (p.style.opacity !== undefined) base.opacity = p.style.opacity;
        if (p.style.border) base.border = p.style.border;
        if (p.style.transform) base.transform = p.style.transform;
      }

      const originalKey =
        Object.keys(fakeEMP.front).find((k) => fakeEMP.front[k] === p.value) ||
        Object.keys(fakeEMP.back).find((k) => fakeEMP.back[k] === p.value) ||
        p.key;

      dfp[originalKey] = base;
    });
    console.log("dfp", dfp);
    const saveData = {
      layout,
      cf: frontImage || "",
      cb: backImage || "",
      dfp,
    };

    dispatch(
      UPDATE({
        token,
        data: { _id: activePlatform.branchId, ct: JSON.stringify(saveData) },
      })
    )
      .then(() => {
        addToast("ID layout saved successfully!", { appearance: "success" });
      })
      .catch(() => {
        addToast("Failed to save ID layout.", { appearance: "error" });
      });
  };

  const uploadCloudinary = (img, isFront = true) => {
    if (isFront) dispatch(setFrontLoading(true));
    else dispatch(setBackLoading(true));

    const form = Cloudinary.buildFileForm(
      img,
      `companies/${company?.name}/${activePlatform?.branch?.name}/ic`,
      isFront ? "front" : "back"
    );

    dispatch(UPLOAD({ data: form, token }))
      .then((upAction) => {
        const imgId = upAction.payload.imgId;

        // Update Redux
        dispatch(
          UPDATE({
            token,
            data: {
              _id: activePlatform.branchId,
              icId: {
                ...(branch.icId || {}),
                [isFront ? "front" : "back"]: imgId,
              },
            },
          })
        );

        // ✅ Update local state immediately so preview shows
        const newImageUrl = `${Cloudinary.getEndpoint()}/${imgId}/companies/${
          company?.name
        }/${activePlatform?.branch?.name}/ic/${isFront ? "front" : "back"}`;
        if (isFront) dispatch(setFrontImage(newImageUrl));
        else dispatch(setBackImage(newImageUrl));
      })
      .finally(() => {
        if (isFront) dispatch(setFrontLoading(false));
        else dispatch(setBackLoading(false));
      });
  };

  const handleFrontChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      uploadCloudinary(reader.result, true);
    };
    reader.readAsDataURL(file);
  };

  const handleBackChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      uploadCloudinary(reader.result, false); // Base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (e, value) =>
    e.dataTransfer.setData("text/plain", value);

  const handleClickValue = (value) => {
    dispatch(setFloatingValue(value));
    document.body.style.cursor = "none";
  };

  const handleMouseMove = (e) => {
    if (floatingValue) setCursorPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  // inside IdCalibrator
  const handleReset = async () => {
    const { icId = {} } = branch;
    const images = Object.entries(icId).filter(([_, value]) => Boolean(value));

    // 🔹 Destroy lahat ng images sa Cloudinary
    await Promise.all(
      images.map(([key]) =>
        dispatch(
          DESTROY_IMG({
            data: {
              path: `companies/${company?.name}/${activePlatform?.branch?.name}/ic/${key}`,
            },
            token,
          })
        )
      )
    );

    // 🔹 Isang UPDATE lang for icId + layout + dfp
    dispatch(
      UPDATE({
        token,
        data: {
          _id: activePlatform.branchId,
          icId: { front: null, back: null }, // reset both
          ct: JSON.stringify({
            layout: "portrait", // default
            dfp: {}, // cleared placements
          }),
        },
      })
    );
  };

  const handleUpdateValueStyle = (updates) => {
    if (!selectedValue) return;

    setPlacedValues((prev) =>
      prev.map((p, i) => {
        if (i === selectedValue.index && p.target === selectedValue.target) {
          // extract x/y kung meron
          const { x, y, ...rest } = updates;
          return {
            ...p,
            x: x !== undefined ? x : p.x,
            y: y !== undefined ? y : p.y,
            style: { ...p.style, ...rest },
          };
        }
        return p;
      })
    );

    dispatch(
      setSelectedValue({
        ...selectedValue,
        ...updates,
        style: { ...selectedValue.style, ...updates },
      })
    );
  };

  const lockAspectRatio = (
    newWidth,
    newHeight,
    lock,
    aspectRatio,
    driver = "width"
  ) => {
    if (!lock || !aspectRatio) {
      return {
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      };
    }

    if (driver === "width") {
      return {
        width: `${newWidth}px`,
        height: `${Math.round(newWidth / aspectRatio)}px`,
      };
    } else {
      return {
        width: `${Math.round(newHeight * aspectRatio)}px`,
        height: `${newHeight}px`,
      };
    }
  };

  return (
    <>
      {loading ? (
        <div className="id-calibrator-skeleton-wrapper">
          <div className="id-calibrator-sekeleton-id-preview-wrapper">
            <div className="id-calibrator-skeleton-id-preview" />
            <div className="id-calibrator-skeleton-id-preview" />
          </div>
          <div className="id-calibrator-skeleton-settings-panel" />
          <div className="id-calibrator-skeleton-buttons" />
        </div>
      ) : (
        <div
          className={`id-calibrator-main-container ${layout || "landscape"} ${
            editMode ? "" : "isEditMode"
          }`}
          onMouseMove={
            floatingValue
              ? (e) =>
                  dispatch(
                    setCursorPos({ x: e.clientX + 10, y: e.clientY + 10 })
                  )
              : undefined
          }
          style={{ position: "relative" }}
        >
          <ID
            handleFrontChange={handleFrontChange}
            handleBackChange={handleBackChange}
            filteredKeys={Object.keys(fakeEMP[selectedSide] || {})}
            fakeEMP={fakeEMP}
            placedValues={placedValues}
            setPlacedValues={setPlacedValues}
            handleDragStart={handleDragStart}
            handleClickValue={handleClickValue}
            lockAspectRatio={lockAspectRatio}
          />

          {/* ✅ Show Edit button if branch.ct exists and editMode=false */}
          <div
            className={`id-calibrator-edit-button ${editMode ? "hide" : ""}`}
          >
            <button
              onClick={() => dispatch(setEditMode(true))}
              className="bg-secondary"
            >
              Show Setting
            </button>
          </div>

          {/* ✅ Only show Setting + Buttons if editMode=true */}
          {editMode && (
            <>
              <Setting
                onReset={handleReset}
                onUpdateValueStyle={handleUpdateValueStyle}
                onSave={onSave}
                lockAspectRatio={lockAspectRatio}
                placedValues={placedValues}
              />
              <DraggableButtons
                fakeEMP={fakeEMP[selectedSide]}
                filteredKeys={Object.keys(fakeEMP[selectedSide] || {})}
                placedValues={placedValues}
                handleDragStart={handleDragStart}
                handleClickValue={handleClickValue}
                setPlacedValues={setPlacedValues}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}
