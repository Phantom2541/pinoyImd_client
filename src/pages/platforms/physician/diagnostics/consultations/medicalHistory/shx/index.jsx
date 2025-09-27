import { useState } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { SET_EMR } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { EditableField } from "../../../../../../../components/customizable";

export default function SHx({
  shx = {
    occupation: "",
    habits: [],
    lifestyle: { activity: "", diet: "", sleep: "" },
  },
}) {
  const { patientId, isSuccess, formSubmitted } = useSelector(
    ({ appointments }) => appointments
  );
  const { token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const [dataShx, setData] = useState(shx);

  /** persist to redux/store */
  const persist = async (newShx) => {
    setData(newShx);
    try {
      await dispatch(
        SET_EMR({
          data: { socialHistory: newShx, patient: patientId },
          token,
        })
      ).unwrap();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  /** add new social history */
  const handleAdd = async () => {
    const { value } = await Swal.fire({
      title: "Add Social History",
      html: `
      <input id="occupation" class="swal2-input" placeholder="Occupation" value="${
        dataShx.occupation || ""
      }" />
      <input id="habit" class="swal2-input" placeholder="Habit (e.g. Smoking, Alcohol)" />

      <h4 style="margin:10px 0 0;text-align:left">Lifestyle</h4>
      <input id="activity" class="swal2-input" placeholder="Activity (e.g. Sedentary)" value="${
        dataShx.lifestyle?.activity || ""
      }" />
      <input id="diet" class="swal2-input" placeholder="Diet (e.g. Balanced, High-fat)" value="${
        dataShx.lifestyle?.diet || ""
      }" />
      <input id="sleep" class="swal2-input" placeholder="Sleep (e.g. 6 hrs/night, irregular)" value="${
        dataShx.lifestyle?.sleep || ""
      }" />
    `,
      focusConfirm: false,
      preConfirm: () => {
        const occupation = document.getElementById("occupation").value.trim();
        const habit = document.getElementById("habit").value.trim();
        const activity = document.getElementById("activity").value.trim();
        const diet = document.getElementById("diet").value.trim();
        const sleep = document.getElementById("sleep").value.trim();

        if (!occupation && !habit && !activity && !diet && !sleep) {
          return false;
        }

        return { occupation, habit, lifestyle: { activity, diet, sleep } };
      },
    });

    if (!value) return;

    const { occupation, habit, lifestyle } = value;

    const newShx = {
      occupation: occupation || dataShx.occupation,
      lifestyle: {
        activity: lifestyle.activity || dataShx.lifestyle?.activity || "",
        diet: lifestyle.diet || dataShx.lifestyle?.diet || "",
        sleep: lifestyle.sleep || dataShx.lifestyle?.sleep || "",
      },
      habits: habit
        ? [...(dataShx.habits || []), habit]
        : [...(dataShx.habits || [])],
    };

    persist(newShx);
  };

  /** remove a habit */
  const handleRemoveHabit = (habit) => {
    Swal.fire({
      title: `Remove "${habit}"?`,
      showCancelButton: true,
      confirmButtonText: "Remove",
      icon: "warning",
    }).then((res) => {
      if (res.isConfirmed) {
        const newShx = {
          ...dataShx,
          habits: dataShx.habits.filter((h) => h !== habit),
        };
        persist(newShx);
      }
    });
  };

  const handleUpdate = async (value) => {
    // alisin ang _id at editingKey kung meron
    const { _id, editingKey, ...updates } = value;

    // hanapin kung anong field ang na–update
    const [field, newVal] = Object.entries(updates)[0] || [];

    if (!field) return;

    let newShx = { ...dataShx };

    if (field === "occupation") {
      newShx.occupation = newVal;
    } else if (["activity", "diet", "sleep"].includes(field)) {
      newShx.lifestyle = {
        ...newShx.lifestyle,
        [field]: newVal,
      };
    } else if (field === "habit") {
      newShx.habits = [...newShx.habits, newVal];
    }
    setData(newShx);

    try {
      await dispatch(
        SET_EMR({
          data: { socialHistory: newShx, patient: patientId },
          token,
        })
      ).unwrap();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!dataShx.occupation && !dataShx.habits?.length && !dataShx.lifestyle) {
    return (
      <div className="checkup-data-pmh-container">
        No Social history recorded.
        <MDBBtn rounded color="primary" size="sm" onClick={handleAdd}>
          <MDBIcon icon="plus" /> Add
        </MDBBtn>
      </div>
    );
  }

  return (
    <div className="checkup-data-mh-container">
      <div className="checkup-data-dataShx-container">
        <label className="checkup-data-dataShx-title">Social History</label>
        <div className="checkup-data-dataShx-wrapper">
          {/* Occupation */}
          {dataShx.occupation && (
            <div
              className="checkup-data-dataShx-row"
              style={{
                display: "flex",
                // alignItems: "center",
                gap: "50px",
              }}
            >
              <strong>Occupation:</strong>
              <EditableField
                fieldData={{
                  _id: patientId,
                  occupation: dataShx.occupation.toLocaleUpperCase(),
                }}
                placeholder="Occupation"
                onSave={(value) => handleUpdate(value)}
                isSuccess={isSuccess}
                formSubmitted={formSubmitted}
              />
            </div>
          )}

          {/* Lifestyle */}
          {shx.lifestyle && (
            <div className="pshx-item">
              <strong>Lifestyle:</strong>
              <ul>
                {dataShx.lifestyle.activity && (
                  <li
                    className="checkup-data-dataShx-row"
                    style={{
                      display: "flex",
                      gap: "30px",
                    }}
                  >
                    <strong>Activity:</strong>
                    <EditableField
                      fieldData={{
                        _id: patientId,
                        activity: dataShx.lifestyle.activity,
                      }}
                      placeholder="Activity"
                      onSave={(value) => handleUpdate(value)}
                      isSuccess={isSuccess}
                      formSubmitted={formSubmitted}
                    />
                  </li>
                )}
                {dataShx.lifestyle.diet && (
                  <li
                    className="checkup-data-dataShx-row"
                    style={{
                      display: "flex",
                      // alignItems: "center",
                      gap: "50px",
                    }}
                  >
                    <strong>Diet:</strong>
                    <EditableField
                      fieldData={{
                        _id: patientId,
                        diet: dataShx.lifestyle.diet,
                      }}
                      placeholder="Diet"
                      onSave={(value) => handleUpdate(value)}
                      isSuccess={isSuccess}
                      formSubmitted={formSubmitted}
                    />
                  </li>
                )}
                {dataShx.lifestyle.sleep && (
                  <li
                    className="checkup-data-dataShx-row"
                    style={{
                      display: "flex",
                      // alignItems: "center",
                      gap: "40px",
                    }}
                  >
                    <strong>Sleep:</strong>
                    <EditableField
                      fieldData={{
                        _id: patientId,
                        sleep: dataShx.lifestyle.sleep,
                      }}
                      placeholder="Sleep"
                      onSave={(value) => handleUpdate(value)}
                      isSuccess={isSuccess}
                      formSubmitted={formSubmitted}
                    />
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Habits */}
          {dataShx.habits?.length > 0 && (
            <div className="checkup-data-dataShx-row">
              <strong>Habits:</strong>
              <ul>
                {dataShx.habits.map((habit, idx) => (
                  <li
                    key={idx}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span>{habit}</span>
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                      onClick={() => handleRemoveHabit(habit)}
                    >
                      ×
                    </span>
                  </li>
                ))}
              </ul>
              <MDBBtn
                size="sm"
                color="success"
                rounded
                onClick={async () => {
                  const { value: habit } = await Swal.fire({
                    title: "Input New Habit",
                    input: "text",
                    inputLabel: "Habit (e.g. Smoking, Alcohol)",
                    inputPlaceholder: "Enter your habit",
                  });
                  if (habit) {
                    handleUpdate({ habit });
                  }
                }} // reuse mo yung handleAdd mo na merong Swal input
              >
                <MDBIcon icon="plus" /> Add Habit
              </MDBBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
