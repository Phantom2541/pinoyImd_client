import Laboratory from "./laboratory";

const EMR_RESULT_TO_PDF = async ({
  department = "LAB",
  task,
  form,
  result,
}) => {
  const departments = ["LAB", "LABORATORY"];

  if (departments.includes(department.toUpperCase()))
    return await Laboratory({ form, task, result });
};

export default EMR_RESULT_TO_PDF;
