import "../style.css";
import DraggableList, { useDragAndDrop } from "../dragAndDrop";
import Swal from "sweetalert2";
import { SET_EMR } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { EditableField } from "../../../../../../../components/customizable";
import {
  handleAddObGyneHistory,
  handleAddPregnancy,
  handleRemovePregnancy,
} from "./obSweet";
import { MDBBtn } from "mdbreact";

export default function OBGyneHx({ obGyneHistory }) {
  const { token } = useSelector(({ auth }) => auth);
  const { patientId, formSubmitted, isSuccess } = useSelector(
    ({ appointments }) => appointments
  );

  // main local state (source of truth)
  const [ObHistory, setObHistory] = useState(obGyneHistory || {});
  const [pregnancies, setPregnancies] = useState(
    obGyneHistory?.pregnancy || []
  );

  // hook for drag/drop
  const dragDrop = useDragAndDrop(pregnancies);

  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const handleAddOB = async () => {
    const newHistory = await handleAddObGyneHistory();
    if (newHistory) {
      const updatedHistory = { ...ObHistory, ...newHistory };

      setObHistory(updatedHistory);
      setPregnancies(updatedHistory.pregnancy || []);

      try {
        await dispatch(
          SET_EMR({
            data: { obGyneHistory: updatedHistory, patient: patientId },
            token,
          })
        ).unwrap();

        addToast("OB-Gyne history updated successfully", {
          appearance: "success",
        });
      } catch (err) {
        console.error("Failed to update OB-Gyne history:", err);
        addToast("Failed to update OB-Gyne history", { appearance: "error" });
      }
    }
  };

  // persist updates to backend
  const persist = async (newList, action = "update") => {
    const updatedHistory = { ...ObHistory, pregnancy: newList };

    setObHistory(updatedHistory);
    setPregnancies(newList);

    try {
      await dispatch(
        SET_EMR({
          data: { obGyneHistory: updatedHistory, patient: patientId },
          token,
        })
      ).unwrap();

      if (action === "add") {
        addToast("Pregnancy added successfully", { appearance: "success" });
      } else if (action === "remove") {
        addToast("Pregnancy removed successfully", { appearance: "info" });
      }
    } catch (err) {
      console.error("Update failed", err);
      addToast("Failed to update pregnancy history", { appearance: "error" });
    }
  };

  const handleAdd = async () => {
    const newPreg = await handleAddPregnancy();
    if (newPreg) {
      const newList = [...pregnancies, newPreg];
      persist(newList, "add");
    }
  };

  const handleRemove = async (index) => {
    const confirmed = await handleRemovePregnancy(index, pregnancies[index]);
    if (confirmed) {
      const newList = pregnancies.filter((_, i) => i !== index);
      persist(newList, "remove");
    }
  };
  const handleUpdate = (data) => {
    const updatedHistory = { ...ObHistory, ...data };
    setObHistory(updatedHistory);

    dispatch(
      SET_EMR({
        token,
        data: { obGyneHistory: updatedHistory, patient: patientId },
      })
    );
  };

  const {
    items,
    dragIndex,
    placeholderIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleEdit,
    setItems,
  } = dragDrop;

  // keep drag/drop items in sync with pregnancies
  useEffect(() => {
    setItems(pregnancies);
  }, [pregnancies, setItems]);

  // early return
  if (pregnancies.length === 0) {
    return (
      <div className="checkup-data-mh-container">
        No OB-Gyne history available.
        <MDBBtn size="sm" color="primary" rounded onClick={handleAddOB}>
          + Add
        </MDBBtn>
      </div>
    );
  }

  // ---- GTPAL calculations ----
  const gravida = items.length;
  const termBirths = items.filter(
    (p) => p.outcome === "alive" && p.gestationalAge >= 37
  ).length;
  const pretermBirths = items.filter(
    (p) =>
      p.outcome === "alive" && p.gestationalAge < 37 && p.gestationalAge >= 20
  ).length;
  const abortions = items.filter(
    (p) => p.gestationalAge < 20 || p.outcome === "deceased"
  ).length;
  const livingChildren = items.filter((p) => p.outcome === "alive").length;

  // ---- Display strings for GUI ----
  const itemTexts = items.map((p, idx) => {
    const comp =
      p.complications && p.complications.length > 0
        ? p.complications.join(", ")
        : "None";

    const bw = p.birthWeight ? `${p.birthWeight}g` : ""; // only add g if value exists

    return `Pregnancy #${idx + 1}: Outcome - ${p.outcome}, Delivery - ${
      p.delivery
    }, Sex - ${p.sex}, Birth Weight - ${bw}, Complications - ${comp}`;
  });

  const obFields = [
    {
      label: "Menarche",
      key: "menarche",
      type: "text",
      suffix: " Years old",
    },
    {
      label: "Last Menstrual Period",
      key: "lmp",
      type: "date",
    },
    {
      label: "Contraception",
      key: "contraception",
      type: "text",
    },
  ];

  return (
    <div className="checkup-data-mh-container obgynehx">
      <div className="checkup-data-obgynhx-container">
        <h2>OB-Gyne History</h2>

        <div style={{ marginLeft: "30px", marginBottom: "10px" }}>
          {obFields.map(({ label, key, type, suffix }) => {
            const rawValue = ObHistory?.[key];
            let displayValue = rawValue ?? "N/A";

            if (type === "date" && rawValue) {
              displayValue = new Date(rawValue).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            } else if (suffix && rawValue) {
              displayValue = `${rawValue} ${suffix}`;
            }

            return (
              <li
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0rem",
                  marginTop: "0rem",
                  listStyle: "circle",
                }}
              >
                <strong style={{ width: "180px" }}>{label}:</strong>
                <EditableField
                  type="text"
                  animation
                  animationStyle={{
                    width: "15rem",
                    marginTop: "-0.4rem",
                    marginLeft: "11.5rem",
                  }}
                  keyForValue={key}
                  fieldData={{ patientId, [key]: rawValue }} // use raw value
                  value={displayValue} // show formatted
                  onSave={handleUpdate}
                  formSubmitted={formSubmitted}
                  isSuccess={isSuccess}
                  className="no-border"
                />
              </li>
            );
          })}
        </div>

        <DraggableList
          items={itemTexts}
          dragIndex={dragIndex}
          placeholderIndex={placeholderIndex}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          date={items[dragIndex]?.date}
          handleEdit={(index, newValue) => {
            const updated = [...items];
            updated[index] = {
              ...updated[index],
              outcome: newValue.value || updated[index].outcome,
            };
            handleEdit(index, updated[index]);
            persist(updated, "update");
          }}
        />
      </div>

      {/* ---- GTPAL Summary ---- */}
      <div className="checkup-data-obgynhx-summary-legend">
        <div className="gtpal-summary">
          <span className="checkup-data-gtpal-label">GTPAL:</span>
          <div>
            <span>G-</span>
            <span>{gravida}</span>
          </div>
          <div>
            <span>T-</span>
            <span>{termBirths}</span>
          </div>
          <div>
            <span>P-</span>
            <span>{pretermBirths}</span>
          </div>
          <div>
            <span>A-</span>
            <span>{abortions}</span>
          </div>
          <div>
            <span>L-</span>
            <span>{livingChildren}</span>
          </div>
        </div>

        <div className="legend bottom d-flex">
          <h4>Legend:</h4>
          <ul>
            <li>
              <strong>G:</strong> Total pregnancies (Gravida)
            </li>
            <li>
              <strong>T:</strong> Term births ≥ 37 weeks
            </li>
            <li>
              <strong>P:</strong> Preterm births &lt;37 ≥ 20 weeks
            </li>
            <li>
              <strong>A:</strong> Abortions &lt; 20 weeks or fetal loss
            </li>
            <li>
              <strong>L:</strong> Living children at present
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
