import Swal from "sweetalert2";

// Short consent checklist shown from the sign-up panel (same idea as SLC's
// "Check All" agreement). Placeholder wording for now -- have it reviewed
// before launch.
const STATEMENTS = [
  "The information I entered is true and correct.",
  "I allow Pinoy iMD to collect and store my personal and health information for my care and records.",
  "I understand the clinics and laboratories I am treated at can view my records.",
  "I will keep my password private and I am responsible for activity on my account.",
  "I understand my data is handled under the Data Privacy Act of 2012 (RA 10173), and I may ask for it to be corrected.",
];

const ROW_STYLE =
  "display:flex;align-items:flex-start;gap:10px;margin:0 0 10px;font-size:0.9rem;line-height:1.4;cursor:pointer;";
const BOX_STYLE =
  "flex:0 0 auto;width:18px;height:18px;margin:2px 0 0;accent-color:#0277bd;cursor:pointer;";

// Opens the checklist; resolves true once every item is ticked and the
// person pressed "I Agree", false if they close it.
const showTerms = async () => {
  const rows = STATEMENTS.map(
    (text) =>
      `<label style="${ROW_STYLE}"><input type="checkbox" class="terms-item" style="${BOX_STYLE}"/><span>${text}</span></label>`,
  ).join("");

  const { isConfirmed } = await Swal.fire({
    title: "Terms and Conditions",
    html: `
      <div style="text-align:left">
        <p style="margin:0 0 12px;font-size:0.9rem;">This is to certify that:</p>
        ${rows}
        <label style="${ROW_STYLE}border-top:1px solid #dbe3ec;padding-top:10px;font-weight:600;color:#0277bd;">
          <input type="checkbox" id="terms-all" style="${BOX_STYLE}"/>
          <span>Check All (I have read and agree to all of the above)</span>
        </label>
      </div>`,
    width: 460,
    showCancelButton: true,
    confirmButtonText: "I Agree",
    cancelButtonText: "Close",
    confirmButtonColor: "#0277bd",
    focusConfirm: false,
    didOpen: (popup) => {
      const items = [...popup.querySelectorAll(".terms-item")];
      const all = popup.querySelector("#terms-all");

      all.addEventListener("change", () =>
        items.forEach((item) => (item.checked = all.checked)),
      );
      items.forEach((item) =>
        item.addEventListener("change", () => {
          all.checked = items.every((i) => i.checked);
        }),
      );
    },
    preConfirm: () => {
      const items = [...Swal.getPopup().querySelectorAll(".terms-item")];

      if (!items.every((item) => item.checked)) {
        Swal.showValidationMessage("Please check every item to continue.");
        return false;
      }
      return true;
    },
  });

  return isConfirmed;
};

export default showTerms;
