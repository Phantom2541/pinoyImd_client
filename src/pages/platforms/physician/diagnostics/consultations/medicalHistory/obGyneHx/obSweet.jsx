import Swal from "sweetalert2";

// Add full OB-Gyne history (first time)
export async function handleAddObGyneHistory() {
  const { value: formValues } = await Swal.fire({
    title: "Add OB-Gyne History",
    width: "450px",
    html: `
      <div>
      <div class="d-flex ">
  <label class="smSweetOB-label">
    Menarche (age)
    <input id="swal-menarche" type="number" class="smSweetOB-input">
  </label>

  <label class="smSweetOB-label ml-2">
    Last Menstrual Period
    <input id="swal-lmp" type="date" class="smSweetOB-input">
  </label>
</div>
<div>
  <label class="smSweetOB-label" style="grid-column: span 2;">
    Contraception
    <input id="swal-contraception" class="wdSweetOB-input">
  </label>


</div>

    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Submit",
    preConfirm: () => {
      const menarche =
        Number(document.getElementById("swal-menarche").value) || null;
      const lmp = document.getElementById("swal-lmp").value || null;
      const contraception =
        document.getElementById("swal-contraception").value || null;

      if (!menarche && !lmp && !contraception) {
        Swal.showValidationMessage(
          "Please fill at least one field before submitting"
        );
        return false;
      }

      return {
        menarche,
        lmp,
        pregnancy: [], // start with empty list
        birthDate: null,
        contraception,
      };
    },
  });

  return formValues;
}

// Add a pregnancy record
export async function handleAddPregnancy() {
  const { value } = await Swal.fire({
    title: "Add Pregnancy",
    width: "450px",
    html: `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: left;">
        <label class="smSweetOB-label">
          Gestational Age (weeks)
          <input id="swal-gestationalAge" type="number" class="smSweetOB-input">
        </label>

        <label class="smSweetOB-label">
          Birth Date
          <input id="swal-birthDate" type="date" class="smSweetOB-input">
        </label>

        <label class="smSweetOB-label">
          Outcome
          <select id="swal-outcome" class="smSweetOB-input">
            <option value="alive">Alive</option>
            <option value="stillbirth">Stillbirth</option>
            <option value="deceased">Deceased</option>
          </select>
        </label>

        <label class="smSweetOB-label">
          Delivery
          <select id="swal-delivery" class="smSweetOB-input">
            <option value="normal">Normal</option>
            <option value="cesarean">Cesarean</option>
          </select>
        </label>

        <label class="smSweetOB-label">
          Sex
          <select id="swal-sex" class="smSweetOB-input">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label class="smSweetOB-label">
          Birth Weight (grams)
          <input id="swal-birthWeight" type="number" class="smSweetOB-input">
        </label>

        <label style="grid-column: span 2;">
          Complications (comma separated)
          <input id="swal-complications" class="wdSweetOB-input">
        </label>
      </div>
    `,
    showCancelButton: true,
    preConfirm: () => {
      const gestationalAge =
        Number(document.getElementById("swal-gestationalAge").value) || null;
      const birthDate = document.getElementById("swal-birthDate").value || null;
      const outcome = document.getElementById("swal-outcome").value || "alive";
      const delivery =
        document.getElementById("swal-delivery").value || "normal";
      const sex = document.getElementById("swal-sex").value || "unknown";
      const birthWeight =
        Number(document.getElementById("swal-birthWeight").value) || null;
      const complications = document.getElementById("swal-complications").value
        ? document
            .getElementById("swal-complications")
            .value.split(",")
            .map((c) => c.trim())
        : [];

      return {
        gestationalAge,
        outcome,
        delivery,
        sex,
        birthWeight,
        birthDate,
        complications,
      };
    },
  });

  return value;
}

// Confirm remove pregnancy
export async function handleRemovePregnancy(index, pregnancy) {
  const res = await Swal.fire({
    title: `Remove Pregnancy #${index + 1}?`,
    text: `Gestational Age: ${pregnancy.gestationalAge} weeks, Date: ${pregnancy.birthDate}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Remove",
  });
  return res.isConfirmed;
}
