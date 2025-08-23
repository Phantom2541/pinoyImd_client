import React, { useState, useEffect } from "react";
import { Employee } from "./collections";
import Setting from "./setting";
import html2canvas from "html2canvas";

function getNestedValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

const fieldMapper = {
  FullName: "fullName",
  "Contact FullName": "contactInfo.fullName",
  ID: "id",
  Position: "position",
  Department: "department",
  Email: "email",
  Mobile: "mobile",
  "Contact Number": "contactInfo.pn",
  ProfileImage: "profileImage",
};

export default function ID({ dfpData, frontImage, backImage }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedField, setSelectedField] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    if (!dfpData) return; // walang template pa
    setEmployeeData(
      Employee.map((emp) => ({
        ...JSON.parse(JSON.stringify(emp)),
        dfpData: JSON.parse(JSON.stringify(dfpData)),
      }))
    );
  }, [dfpData]);

  if (!dfpData) return <div>Select a template first</div>;
  if (employeeData.length === 0) return <div>No employee data available</div>;

  const currentEmployee = employeeData[currentIndex];

  const frontValues = Object.entries(currentEmployee.dfpData || {}).filter(
    ([, pos]) => pos.target === "front" || !pos.target
  );
  const backValues = Object.entries(currentEmployee.dfpData || {}).filter(
    ([, pos]) => pos.target === "back"
  );
  // 🔹 Update helpers (setState para mag-trigger ng re-render)
  const updatePosition = (x, y) => {
    if (!selectedField) return;
    setEmployeeData((prev) => {
      const clone = [...prev];
      clone[currentIndex] = {
        ...clone[currentIndex],
        dfpData: {
          ...clone[currentIndex].dfpData,
          [selectedField.key]: {
            ...clone[currentIndex].dfpData[selectedField.key],
            x,
            y,
          },
        },
      };
      return clone;
    });
    setSelectedField((f) => ({ ...f, x, y }));
  };

  const updateStyle = (styleUpdate) => {
    if (!selectedField) return;
    setEmployeeData((prev) => {
      const clone = [...prev];
      clone[currentIndex] = {
        ...clone[currentIndex],
        dfpData: {
          ...clone[currentIndex].dfpData,
          [selectedField.key]: {
            ...clone[currentIndex].dfpData[selectedField.key],
            ...styleUpdate,
          },
        },
      };
      return clone;
    });
    setSelectedField((f) => ({ ...f, ...styleUpdate }));
  };

  const saveEmployeeData = () => {
    // 1️⃣ overwrite yung original Employee[currentIndex]
    Employee[currentIndex].dfpData = employeeData[currentIndex].dfpData;

    const frontEl = document.getElementById("front-preview");
    const backEl = document.getElementById("back-preview");

    if (frontEl && backEl) {
      Promise.all([html2canvas(frontEl), html2canvas(backEl)]).then(
        ([frontCanvas, backCanvas]) => {
          const space = 20; // space sa gitna
          const width = frontCanvas.width + backCanvas.width + space;
          const height = Math.max(frontCanvas.height, backCanvas.height);

          // create combined canvas
          const combinedCanvas = document.createElement("canvas");
          combinedCanvas.width = width;
          combinedCanvas.height = height;
          const ctx = combinedCanvas.getContext("2d");

          // draw front (left)
          ctx.drawImage(frontCanvas, 0, 0);
          // draw back (right) na may 20px space
          ctx.drawImage(backCanvas, frontCanvas.width + space, 0);

          // save as single file
          const link = document.createElement("a");
          link.download = `employee-${currentIndex + 1}-id.png`;
          link.href = combinedCanvas.toDataURL("image/png");
          link.click();
        }
      );
    }
  };

  const renderValues = (values) =>
    values.map(([key, pos]) => {
      const style = {
        position: "absolute",
        left: pos.x || 0,
        top: pos.y || 0,
        width: pos.width ? `${pos.width}px` : "auto",
        height: pos.height ? `${pos.height}px` : "auto",
        border: pos.border || "none",
        borderRadius: pos.borderRadius ? `${pos.borderRadius}px` : 0,
        opacity: pos.opacity !== undefined ? pos.opacity : 1,
        fontFamily: pos.fontFamily || "Arial",
        fontSize: pos.fontSize ? `${pos.fontSize}px` : "12px",
        fontWeight: pos.fontWeight || "normal",
        color: pos.color || "#000",
        letterSpacing: pos.letterSpacing ? `${pos.letterSpacing}px` : "0px",
        cursor: "pointer",
      };

      const mappedPath = fieldMapper[key];
      if (!mappedPath) return null;

      let value = getNestedValue(currentEmployee, mappedPath);

      if (mappedPath === "fullName" && value) {
        const { title, fname, mname, lname, suffix } = value;
        value = `${title ? title + " " : ""}${fname} ${
          mname ? mname + " " : ""
        }${lname}${suffix ? ", " + suffix : ""}`;
      }
      if (mappedPath === "contactInfo.fullName" && value) {
        const { title, fname, mname, lname, suffix } = value;
        value = `${title ? title + " " : ""}${fname} ${
          mname ? mname + " " : ""
        }${lname}${suffix ? ", " + suffix : ""}`;
      }

      const commonProps = {
        key,
        style,
        onClick: () =>
          setSelectedField({
            key,
            value,
            type: key.toLowerCase().includes("image") ? "image" : "text",
            ...pos,
          }),
      };

      if (
        key.toLowerCase().includes("image") ||
        (typeof value === "string" && value.startsWith("http")) ||
        (typeof value === "string" && value.startsWith("data:"))
      ) {
        return <img {...commonProps} src={value} alt={key} />;
      }

      return <span {...commonProps}>{value}</span>;
    });

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div>
        <div
          className="IDGenerator-ID-container"
          style={{ display: "flex", gap: "20px" }}
        >
          {/* Front */}
          <div
            id="front-preview"
            className="IDGenerator-ID-imgPreview"
            style={{ position: "relative" }}
          >
            <img
              src={frontImage || ""}
              alt="front ID"
              style={{ width: "100%" }}
            />
            {renderValues(frontValues)}
          </div>

          {/* Back */}
          <div
            id="back-preview"
            className="IDGenerator-ID-imgPreview"
            style={{ position: "relative" }}
          >
            <img
              src={backImage || ""}
              alt="back ID"
              style={{ width: "100%" }}
            />
            {renderValues(backValues)}
          </div>
        </div>
      </div>

      {/* Setting Panel */}
      <div style={{ flex: 1 }}>
        <Setting
          placedValue={selectedField}
          updatePosition={updatePosition}
          updateStyle={updateStyle}
          currentIndex={currentIndex}
          total={employeeData.length}
          onPrev={() =>
            setCurrentIndex((prev) =>
              prev > 0 ? prev - 1 : employeeData.length - 1
            )
          }
          onNext={() =>
            setCurrentIndex((prev) =>
              prev < employeeData.length - 1 ? prev + 1 : 0
            )
          }
          onSave={saveEmployeeData}
        />
      </div>
    </div>
  );
}
