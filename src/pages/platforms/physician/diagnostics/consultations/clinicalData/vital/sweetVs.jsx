import Swal from "sweetalert2";

export async function handleAddVitals(vitalsConfig, currentVitals = {}) {
  const { value: formValues } = await Swal.fire({
    title: "Add Vital Signs",
    width: "450px",
    html: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left;">
        ${Object.entries(vitalsConfig)
          .map(
            ([key, { label, unit, hint }]) => `
            
              <label class="smSweetOB-label">
                ${label} (${unit})
                <input 
                  id="swal-${key}" 
                  type="${key === "bp" ? "text" : "number"}" 
                  class="smSweetOB-input"
                  placeholder="${hint || ""}"
                  value="${currentVitals[key] ?? ""}" 
                />
              </label>
            `
          )
          .join("")}
        <label class="smSweetOB-label">
          Height (cm)
          <input 
            id="swal-height" 
            type="number" 
            class="smSweetOB-input"
            placeholder="1 ft = 30.48 cm"
            value="${currentVitals.height ?? ""}" 
          />
        </label>
        <label class="smSweetOB-label">
          Weight (kg)
          <input 
            id="swal-weight" 
            type="number" 
            class="smSweetOB-input"
            placeholder="1 kg ≈ 2.205 lbs"
            value="${currentVitals.weight ?? ""}" 
          />
        </label>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Submit",
    preConfirm: () => {
      const values = {};

      // vitals from config
      for (const key of Object.keys(vitalsConfig)) {
        const el = document.getElementById(`swal-${key}`);
        const val = el?.value.trim();
        if (!val) {
          Swal.showValidationMessage(`${vitalsConfig[key].label} is required`);
          return false;
        }
        values[key] = val;
      }

      // height
      const heightEl = document.getElementById("swal-height");
      const height = heightEl?.value.trim();
      if (!height) {
        Swal.showValidationMessage("Height is required");
        return false;
      }
      values.height = height;

      // weight
      const weightEl = document.getElementById("swal-weight");
      const weight = weightEl?.value.trim();
      if (!weight) {
        Swal.showValidationMessage("Weight is required");
        return false;
      }
      values.weight = weight;

      return values;
    },
  });

  return formValues;
}

// bmi.js
export function computeBMI({ height, weight }) {
  if (!height || !weight) return null;

  const h = parseFloat(height) / 100; // cm → meters
  const w = parseFloat(weight);

  if (isNaN(h) || isNaN(w) || h === 0) return null;

  return (w / (h * h)).toFixed(2); // string with 2 decimals
}

export function classifyBMI(bmi) {
  if (!bmi) return "";
  const val = parseFloat(bmi);
  if (val < 18.5) return "Underweight";
  if (val < 25) return "Normal";
  if (val < 30) return "Overweight";
  return "Obese";
}

export function bmiColor(bmi) {
  const cls = classifyBMI(bmi);
  switch (cls) {
    case "Underweight":
      return "vital-bmi-warning"; // yellow
    case "Overweight":
    case "Obese":
      return "vital-bmi-danger"; // red
    case "Normal":
      return "vital-bmi-normal"; // green
    default:
      return "";
  }
}
