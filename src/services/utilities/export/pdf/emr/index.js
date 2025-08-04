import Laboratory from "./laboratory";

const EMR_RESULT_TO_PDF = ({ department = "LAB", task, form }) => {
  const departments = ["LAB", "LABORATORY"];

  if (departments.includes(department.toUpperCase()))
    return Laboratory({ form, task });
};

export default EMR_RESULT_TO_PDF;
