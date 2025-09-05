import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BROWSE } from "../../../services/redux/slices/portal/icard";
import QrCodeGenerator from "../../../components/qrCode";
import { Cloudinary, ENDPOINT } from "../../../services/utilities";
import "./style.css";

const ICard = ({ match = {} }) => {
  const { personnelId = "", companyId = "" } = match?.params || {},
    { info, branch } = useSelector(({ icard }) => icard),
    [front, setFront] = useState(null),
    [back, setBack] = useState(null),
    [placedValues, setPlacedValues] = useState([]),
    dispatch = useDispatch();

  console.log("info", info);
  console.log("branch", branch);

  // fetch personnel info
  useEffect(() => {
    localStorage.setItem("companyId", companyId);
    if (personnelId) {
      dispatch(BROWSE({ key: { _id: personnelId } }));
    }
  }, [dispatch, personnelId, companyId]);

  // parse ct, set images and placedValues
  useEffect(() => {
    if (!branch?.ct) return;

    let ctData = branch.ct;
    if (typeof branch.ct === "string") {
      try {
        ctData = JSON.parse(branch.ct);
      } catch (err) {
        console.error("Invalid JSON in branch.ct:", branch.ct, err);
        return;
      }
    }

    // set front/back image URLs
    setFront(ctData.cf || null);
    setBack(ctData.cb || null);

    // parse dfp (branch + info)
    let branchDfp = {};
    let infoDfp = {};

    if (ctData.dfp) branchDfp = ctData.dfp;

    if (info?.dfp) {
      try {
        infoDfp = JSON.parse(info.dfp);
      } catch (err) {
        console.error("Invalid JSON in info.dfp:", info.dfp, err);
      }
    }

    // priority: info.dfp > branch.ct.dfp
    const mergedDfp =
      Object.keys(infoDfp).length > 0 ? infoDfp : branchDfp || {};

    // build placedValues
    const dataClone = { ...info, dfp: mergedDfp };

    const newPlacedValues = Object.entries(mergedDfp).map(([key, p]) => {
      let value;

      // special case: QR or BAR → use link
      if (key === "qr" || key === "bar") {
        value = info?.back?.link || info?.front?.link || info?.link || "";
      } else {
        // normal case
        value = dataClone[p.target]?.[key];

        if (value === undefined || value === "") {
          value =
            dataClone.front?.[key] ||
            dataClone.back?.[key] ||
            dataClone[key] ||
            "";
        }
      }

      return { key, value, ...p };
    });

    setPlacedValues(newPlacedValues);
    console.log("newPlacedValues", newPlacedValues);
  }, [branch, info]);

  // render placed values gaya ng ID.jsx
  const renderValues = useCallback(
    (side) =>
      placedValues
        .filter((p) =>
          p.target === "front" ? side === "front" : side === "back"
        )
        .map((p) => {
          const isImage =
            typeof p.value === "string" &&
            (p.value.startsWith("data:image/") ||
              /\.(png|jpe?g|gif)$/i.test(p.value));

          const isFixed =
            p.key === "img" || p.key === "signature" || p.key === "qr";
          const pos = { x: p.x, y: p.y };

          const commonProps = {
            key: p.key,
            style: {
              top: pos.y,
              left: pos.x,
              position: "absolute",
              userSelect: "none",
              cursor: isFixed ? "default" : "grab",
              display: "inline-block",
              fontFamily: p.fontFamily,
              fontSize: p.fontSize,
              fontWeight: p.fontWeight,
              fontStyle: p.fontStyle || "normal",
              color: p.color,
              letterSpacing: p.letterSpacing,
              width: p.width || "auto",
              height: p.height || "auto",
              borderRadius: p.borderRadius,
              border: p.border,
              borderBottom: p.borderBottom,
              transform: p.transform,
              opacity: p.opacity ?? 1,
              textAlign: "center",
              whiteSpace: "nowrap",
            },
          };

          // ✅ QR code render
          if (p.key === "qr" && p.value) {
            return (
              <div {...commonProps}>
                <QrCodeGenerator
                  value={`${ENDPOINT}/icard/portal/${companyId}/${p.value}`}
                  size={p.width || 50}
                />
              </div>
            );
          }

          // ✅ image/signature render
          if (isImage) {
            return (
              <img
                {...commonProps}
                src={
                  p.value.startsWith("data:image/")
                    ? p.value
                    : `${Cloudinary.getEndpoint()}/${p.value}`
                }
                alt={p.key}
              />
            );
          }

          // ✅ text render (default)
          return <div {...commonProps}>{p.value}</div>;
        }),
    [placedValues, companyId]
  );

  return (
    <div className="icard-front-back-container">
      <div className="icard-front-preview" style={{ position: "relative" }}>
        {front ? <img src={front} alt="front" /> : null}
        {renderValues("front")}
      </div>
      <div className="icard-back-preview" style={{ position: "relative" }}>
        {back ? <img src={back} alt="back" /> : null}
        {renderValues("back")}
      </div>
    </div>
  );
};

export default ICard;
