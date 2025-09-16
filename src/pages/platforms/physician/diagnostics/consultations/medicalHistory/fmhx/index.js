import React, { useLayoutEffect, useRef, useState } from "react";

export default function FMHx({ familyHistory = { mother: [], father: [] } }) {
  const wrapperRef = useRef(null);

  // refs per row / box
  const rowRefs = useRef({});
  const motherBoxRefs = useRef({});
  const fatherBoxRefs = useRef({});

  const [lines, setLines] = useState([]);

  const mother = familyHistory.mother || [];
  const father = familyHistory.father || [];

  // zipper style merge
  function mergeAlternate(motherArr, fatherArr) {
    const rows = [];
    const usedMother = new Set();
    const usedFather = new Set();
    let i = 0;

    while (i < motherArr.length || i < fatherArr.length) {
      const m = motherArr[i];
      const f = fatherArr[i];

      if (m) {
        if (fatherArr.includes(m) && !usedFather.has(m)) {
          rows.push([m, m]);
          usedFather.add(m);
          usedMother.add(m);
        } else if (!usedMother.has(m)) {
          rows.push([m, null]);
          usedMother.add(m);
        }
      }

      if (f) {
        if (motherArr.includes(f) && !usedMother.has(f)) {
          rows.push([f, f]);
          usedMother.add(f);
          usedFather.add(f);
        } else if (!usedFather.has(f)) {
          rows.push([null, f]);
          usedFather.add(f);
        }
      }

      i++;
    }

    return rows;
  }

  const mergedRows = mergeAlternate(mother, father);

  const measure = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const newLines = [];

    mergedRows.forEach(([m, f], idx) => {
      const rowEl = rowRefs.current[idx];
      if (!rowEl) return;

      const rowRect = rowEl.getBoundingClientRect();
      const top = rowRect.top - wrapperRect.top + rowRect.height / 2;

      const mBox = m ? motherBoxRefs.current[idx] : null;
      const fBox = f ? fatherBoxRefs.current[idx] : null;

      if (mBox && fBox) {
        // shared
        const mRect = mBox.getBoundingClientRect();
        const fRect = fBox.getBoundingClientRect();
        const left = mRect.right - wrapperRect.left;
        const right = fRect.left - wrapperRect.left;
        if (right - left > 0) newLines.push({ top, left, right });
      } else if (mBox && !fBox) {
        // unique mother
        const mRect = mBox.getBoundingClientRect();
        const left = mRect.right - wrapperRect.left;
        const right = wrapperRect.width / 2;
        if (right - left > 0) newLines.push({ top, left, right });
      } else if (!mBox && fBox) {
        // unique father
        const fRect = fBox.getBoundingClientRect();
        const left = wrapperRect.width / 2;
        const right = fRect.left - wrapperRect.left;
        if (right - left > 0) newLines.push({ top, left, right });
      }
    });

    setLines(newLines);
  };

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let ro;
    if (wrapperRef.current && window.ResizeObserver) {
      ro = new ResizeObserver(measure);
      ro.observe(wrapperRef.current);
    }

    const t = setTimeout(measure, 50);

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      clearTimeout(t);
    };
  }, [familyHistory, mergedRows.length]);

  if (!familyHistory || (!mother.length && !father.length)) {
    return (
      <div className="checkup-data-pmh-container">
        No Family history available.
      </div>
    );
  }

  return (
    <div className="checkup-data-mh-container">
      <div className="checkup-data-fmhx-container">
        <label className="checkup-data-fmhx-title">Family History</label>
        <div className="checkup-data-fmhx-header">
          <label>mother</label>
          <label>father</label>
        </div>
        <div className="checkup-data-fmhx-wrapper" ref={wrapperRef}>
          {/* rows */}
          <div className="checkup-data-fmhx-rows">
            {mergedRows.map(([m, f], idx) => (
              <div
                key={idx}
                className="checkup-data-fmhx-row"
                ref={(el) => (rowRefs.current[idx] = el)}
              >
                <div className="checkup-data-fmhx-col left-col">
                  {m ? (
                    <div
                      className="checkup-data-fmhx-condition"
                      ref={(el) => (motherBoxRefs.current[idx] = el)}
                    >
                      <span>{m}</span>
                    </div>
                  ) : (
                    <div className="checkup-data-fmhx-empty" aria-hidden />
                  )}
                </div>

                <div className="checkup-data-fmhx-col center-col" />

                <div className="checkup-data-fmhx-col right-col">
                  {f ? (
                    <div
                      className="checkup-data-fmhx-condition"
                      ref={(el) => (fatherBoxRefs.current[idx] = el)}
                    >
                      <span>{f}</span>
                    </div>
                  ) : (
                    <div className="checkup-data-fmhx-empty" aria-hidden />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* connector lines */}
          {lines.map((ln, i) => {
            const width = ln.right - ln.left;
            return (
              <div
                key={i}
                className="connector-line"
                style={{
                  top: `${ln.top}px`,
                  left: `${ln.left}px`,
                  width: `${width}px`,
                  transform: "translateY(-50%)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
