const formColor = (form = "") =>
  ({
    serology: "light",
    miscellaneous: "#e8eaf6 indigo lighten-5",
    urinalysis: "warning",
    parasitology: "success",
    hematology: "danger",
    coagulation: "danger",
  }[String(form).toLowerCase()] || "primary");

export default formColor;
