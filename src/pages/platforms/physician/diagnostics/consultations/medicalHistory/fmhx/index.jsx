import { useLayoutEffect, useRef, useState } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { useToasts } from "react-toast-notifications";
import {
  SET_EMR,
  SetCLUSTER,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";

export default function FMHx({ familyHistory = { Mother: [], Father: [] } }) {
  const {
    patientId,
    cluster,
    patient: appointment,
  } = useSelector(({ appointments }) => appointments);
  const { token } = useSelector(({ auth }) => auth);
  const wrapperRef = useRef(null);
  const rowRefs = useRef({});
  const motherBoxRefs = useRef({});
  const fatherBoxRefs = useRef({});
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [fhx, setFhx] = useState(familyHistory);
  const [lines, setLines] = useState([]);
  const [svgHeight, setSvgHeight] = useState(0);

  const mother = fhx.Mother || [];
  const father = fhx.Father || [];

  /** Merge mother/father diseases row by row */
  function mergeAlternate(mArr, fArr) {
    const rows = [];
    const usedM = new Set();
    const usedF = new Set();
    let i = 0;
    while (i < mArr.length || i < fArr.length) {
      const m = mArr[i];
      const f = fArr[i];
      if (m && !usedM.has(m)) {
        if (fArr.includes(m) && !usedF.has(m)) {
          rows.push([m, m]);
          usedM.add(m);
          usedF.add(m);
        } else {
          rows.push([m, null]);
          usedM.add(m);
        }
      }
      if (f && !usedF.has(f)) {
        if (mArr.includes(f) && !usedM.has(f)) {
          rows.push([f, f]);
          usedM.add(f);
          usedF.add(f);
        } else {
          rows.push([null, f]);
          usedF.add(f);
        }
      }
      i++;
    }
    return rows;
  }
  const mergedRows = mergeAlternate(mother, father);

  /** measure positions for svg lines */
  const measure = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const wrapperRect = wrapper.getBoundingClientRect();
    const newLines = [];
    let maxY = 0;

    mergedRows.forEach(([m, f], idx) => {
      const rowEl = rowRefs.current[idx];
      if (!rowEl) return;
      const rowRect = rowEl.getBoundingClientRect();
      const y = rowRect.top - wrapperRect.top + rowRect.height / 2;
      if (y > maxY) maxY = y;

      const mBox = m ? motherBoxRefs.current[idx] : null;
      const fBox = f ? fatherBoxRefs.current[idx] : null;

      if (mBox && fBox) {
        const mRect = mBox.getBoundingClientRect();
        const fRect = fBox.getBoundingClientRect();
        newLines.push({
          x1: mRect.right - wrapperRect.left,
          y1: y,
          x2: fRect.left - wrapperRect.left,
          y2: y,
          type: "shared",
        });
      } else if (mBox) {
        const mRect = mBox.getBoundingClientRect();
        newLines.push({
          x1: mRect.right - wrapperRect.left,
          y1: y,
          x2: wrapperRect.width / 2,
          y2: y,
          type: "unique",
        });
      } else if (fBox) {
        const fRect = fBox.getBoundingClientRect();
        newLines.push({
          x1: wrapperRect.width / 2,
          y1: y,
          x2: fRect.left - wrapperRect.left,
          y2: y,
          type: "unique",
        });
      }
    });
    setLines(newLines);
    setSvgHeight(maxY + 20);
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
  }, [fhx, mergedRows.length]);

  /** Update state + persist with SET_EMR */
  const persist = async (newFhx, action = "update") => {
    setFhx(newFhx);
    try {
      const response = await dispatch(
        SET_EMR({
          data: { familyHistory: newFhx, patient: patientId },
          token,
        })
      ).unwrap();
      console.log("response", response);
      if (action === "add") {
        addToast("Disease added successfully", { appearance: "success" });
      } else if (action === "remove") {
        addToast("Disease removed successfully", { appearance: "info" });
      }

      const newCluster = [...cluster];
      const index = newCluster.find(({ _id }) => _id === appointment._id);
      newCluster[index] = {
        ...newCluster[index],
        familyHistory: response?.payload,
      };
      dispatch(SetCLUSTER(newCluster));
    } catch (err) {
      console.error("Update failed", err);
      addToast("Failed to update family history", { appearance: "error" });
    }
  };

  const handleAdd = async () => {
    const { value } = await Swal.fire({
      title: "Add Disease",
      html: `
        <input id="disease" class="swal2-input" placeholder="Disease name" />
        <select id="target" class="swal2-select">
          <option value="Mother">Mother</option>
          <option value="Father">Father</option>
          <option value="Both">Both</option>
        </select>`,
      focusConfirm: false,
      preConfirm: () => {
        const disease = document.getElementById("disease").value.trim();
        const target = document.getElementById("target").value;
        if (!disease) return false;
        return { disease, target };
      },
    });

    if (!value) return;
    const { disease, target } = value;
    const newFhx = {
      Mother: [...mother],
      Father: [...father],
    };
    if (target === "Mother") newFhx.Mother.push(disease);
    if (target === "Father") newFhx.Father.push(disease);
    if (target === "Both") {
      newFhx.Mother.push(disease);
      newFhx.Father.push(disease);
    }
    persist(newFhx, "add");
  };

  const handleRemove = (disease, parent) => {
    Swal.fire({
      title: `you want to remove ${disease}?`,
      text: `Are you sure you want to remove this disease is under ${parent}?.`,
      showCancelButton: true,
      confirmButtonText: "Remove",
      icon: "warning",
    }).then((res) => {
      if (res.isConfirmed) {
        const newFhx = {
          Mother: mother.filter((d) => !(parent === "Mother" && d === disease)),
          Father: father.filter((d) => !(parent === "Father" && d === disease)),
        };
        persist(newFhx, "remove");
      }
    });
  };

  if (!mother.length && !father.length) {
    return (
      <div className="checkup-data-pmh-container">
        No Family history available.
        <MDBBtn rounded color="primary" size="sm" onClick={handleAdd}>
          <MDBIcon icon="plus" /> Add
        </MDBBtn>
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

        <div
          className="checkup-data-fmhx-wrapper"
          ref={wrapperRef}
          style={{ position: "relative" }}
        >
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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => handleRemove(m, "Mother")}
                      >
                        ×
                      </span>
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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>{f}</span>
                      <span
                        style={{ cursor: "pointer", color: "red" }}
                        onClick={() => handleRemove(f, "Father")}
                      >
                        ×
                      </span>
                    </div>
                  ) : (
                    <div className="checkup-data-fmhx-empty" aria-hidden />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="center">
            {" "}
            <MDBBtn
              rounded
              className="center"
              color="primary"
              size="sm"
              onClick={handleAdd}
            >
              <MDBIcon icon="plus" />
            </MDBBtn>
          </div>

          <svg
            className="fmhx-svg"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: svgHeight,
              pointerEvents: "none",
            }}
          >
            {lines.map((ln, i) =>
              ln.type === "shared" ? (
                <line
                  key={i}
                  x1={ln.x1}
                  y1={ln.y1}
                  x2={ln.x2}
                  y2={ln.y2}
                  stroke="#666"
                  strokeWidth="2"
                />
              ) : (
                <path
                  key={i}
                  d={`M${ln.x1},${ln.y1} C${(ln.x1 + ln.x2) / 2},${ln.y1} ${
                    (ln.x1 + ln.x2) / 2
                  },${ln.y2} ${ln.x2},${ln.y2}`}
                  stroke="#999"
                  strokeWidth="2"
                  fill="none"
                />
              )
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
