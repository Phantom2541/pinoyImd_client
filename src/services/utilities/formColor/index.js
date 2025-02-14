const formColor = (form = "") =>
  ({
    serology: "light",
    miscellaneous: "light",
    urinalysis: "warning",
    parasitology: "success",
    hematology: "danger",
    coagulation: "danger",
  }[String(form).toLowerCase()] || "primary");

export default formColor;
