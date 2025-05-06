const formColor = (form = "") =>
  ({
    serology: "#eeeeee grey lighten-3",
    miscellaneous: "#e8eaf6 indigo lighten-5",
    urinalysis: "warning",
    parasitology: "success",
    hematology: "danger",
    coagulation: "danger",
  }[String(form).toLowerCase()] || "primary");

export default formColor;
