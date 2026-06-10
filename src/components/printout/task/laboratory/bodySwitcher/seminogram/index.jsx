import React from "react";
// import { Markup } from "interweave";
import {
  PhysicalExam,
  Microexam,
  Macroexam,
} from "../../../../../../services/fakeDb";

export default function Seminogram({ task, fontSize = 10 }) {
  const style = { fontSize: `${fontSize}px` };
  const { pe = {}, me = {}, mo = [], ce = null } = task;

  const renderRows = (categories, values, preferences, isSelectCheck) =>
    categories.map((category, index) => {
      const key = Array.isArray(values) ? index : Object.keys(values)[index];
      const value = Array.isArray(values) ? values[index] : (values[key] ?? "");

      const pref = preferences[category] || {};
      const { lo = "", hi = "", unit = "" } = pref;

      let color = "";
      if (value !== "" && !isNaN(value)) {
        if (lo !== "" && !isNaN(lo) && value < lo) color = "blue";
        else if (hi !== "" && !isNaN(hi) && value > hi) color = "red";
      }

      const isSelect = isSelectCheck?.(category);

      return (
        <tr key={`${category}-${index}`}>
          <td style={style} className="py-0 text-left">
            {category}
          </td>
          <td style={{ ...style, color }} className="py-0 fw-bold text-center">
            {isSelect ? value || "--" : value}
          </td>
          <td className="py-0 text-center">
            <>
              {lo && `${lo}`} {hi && `- ${hi}`}
            </>
          </td>
          <td style={style} className="py-0 text-left">
            {unit || ""}
          </td>
        </tr>
      );
    });

  return (
    <div className="seminogram-print">
      {/* HEADER / CLINIC INFO */}
      <div className="header">
        <h4 className="fw-bold text-center">SEMINOGRAM REPORT</h4>
      </div>

      {/* ONE TABLE ONLY */}
      <table bordered responsive className="mb-0 text-center">
        <thead>
          <tr>
            <th style={style}>Category</th>
            <th style={style}>Result</th>
            <th style={style}>Reference</th>
            <th style={style}>Unit</th>
          </tr>
        </thead>
        <tbody className="seminogram-body">
          {/* Physical Exam */}
          <tr className="section-header">
            <td colSpan={3} className="fw-bold text-left">
              Physical Examination
            </td>
          </tr>
          {renderRows(
            PhysicalExam.Title,
            pe,
            PhysicalExam.Preferences.physical,
            (c) => ["Appearance", "Color", "Viscosity"].includes(c),
          )}

          {/* Microscopic Exam */}
          <tr className="section-header">
            <td colSpan={3} className="fw-bold text-left">
              Microscopic Examination
            </td>
          </tr>
          {renderRows(
            Microexam.Category,
            me,
            PhysicalExam.Preferences.semen,
            (c) => c === "Agglutination",
          )}

          {/* Morphology */}
          <tr className="section-header">
            <td colSpan={3} className="fw-bold text-left">
              Morphology
            </td>
          </tr>
          {renderRows(Macroexam.Category, mo, PhysicalExam.Preferences.semen)}

          {/* Chemical Exam */}
          <tr className="section-header">
            <td colSpan={3} className="fw-bold text-left">
              Chemical Examination
            </td>
          </tr>
          <tr>
            <td style={style} className="py-0 text-left">
              Fructose
            </td>
            <td style={style} className="py-0 fw-bold text-center">
              {ce ? "Positive" : "Negative"}
            </td>
            <td className="py-0 text-center"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
