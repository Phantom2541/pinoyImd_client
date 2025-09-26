import { useLayoutEffect, useRef, useState } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch } from "react-redux";
import { setMiniEhrModal } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";

export default function FMHx({ familyHistory = { Mother: [], Father: [] } }) {
  console.log("FMHx rendered with:", familyHistory);

  const wrapperRef = useRef(null);

  // refs per row / box
  const rowRefs = useRef({});
  const motherBoxRefs = useRef({});
  const fatherBoxRefs = useRef({});
  const dispatch = useDispatch();

  const [lines, setLines] = useState([]);

  const mother = familyHistory.Mother || [];
  const father = familyHistory.Father || [];

  // merge mother + father arrays (zipper style)
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

  // measure positions for SVG lines
  const measure = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const newLines = [];

    mergedRows.forEach(([m, f], idx) => {
      const rowEl = rowRefs.current[idx];
      if (!rowEl) return;

      const rowRect = rowEl.getBoundingClientRect();
      const y = rowRect.top - wrapperRect.top + rowRect.height / 2;

      const mBox = m ? motherBoxRefs.current[idx] : null;
      const fBox = f ? fatherBoxRefs.current[idx] : null;

      if (mBox && fBox) {
        // shared condition (mother + father)
        const mRect = mBox.getBoundingClientRect();
        const fRect = fBox.getBoundingClientRect();
        const startX = mRect.right - wrapperRect.left;
        const endX = fRect.left - wrapperRect.left;
        newLines.push({ x1: startX, y1: y, x2: endX, y2: y, type: "shared" });
      } else if (mBox && !fBox) {
        // unique mother condition
        const mRect = mBox.getBoundingClientRect();
        const startX = mRect.right - wrapperRect.left;
        const endX = wrapperRect.width / 2;
        newLines.push({ x1: startX, y1: y, x2: endX, y2: y, type: "unique" });
      } else if (!mBox && fBox) {
        // unique father condition
        const fRect = fBox.getBoundingClientRect();
        const startX = wrapperRect.width / 2;
        const endX = fRect.left - wrapperRect.left;
        newLines.push({ x1: startX, y1: y, x2: endX, y2: y, type: "unique" });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <MDBBtn onClick={() => dispatch(setMiniEhrModal({ familyHistory }))}>
        <MDBIcon icon="plus" />
      </MDBBtn>
      <div className="checkup-data-fmhx-container">
        <label className="checkup-data-fmhx-title">Family History</label>
        <div className="checkup-data-fmhx-header">
          <label>mother</label>
          <label>father</label>
        </div>

        <div
          className="checkup-data-fmhx-wrapper"
          ref={wrapperRef}
          style={{ position: "relative" }}
        >
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

          {/* SVG connectors */}
          <svg
            className="fmhx-svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {lines.map((ln, i) => {
              if (ln.type === "shared") {
                // straight line for shared conditions
                return (
                  <line
                    key={i}
                    x1={ln.x1}
                    y1={ln.y1}
                    x2={ln.x2}
                    y2={ln.y2}
                    stroke="#666"
                    strokeWidth="2"
                  />
                );
              } else {
                // curved line for unique conditions
                const midX = (ln.x1 + ln.x2) / 2;
                return (
                  <path
                    key={i}
                    d={`M${ln.x1},${ln.y1} C${midX},${ln.y1} ${midX},${ln.y2} ${ln.x2},${ln.y2}`}
                    stroke="#999"
                    strokeWidth="2"
                    fill="none"
                  />
                );
              }
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
