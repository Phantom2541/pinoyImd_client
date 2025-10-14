import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Patients from "./patients";

const MonhtlyReport = async ({ deals, month, year }) => {
  const workbook = new ExcelJS.Workbook();
  await Patients({ workbook, deals }); // <-- await here

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Monthly-Report-${new Date().toDateString()}.xlsx`);
};

export default MonhtlyReport;
