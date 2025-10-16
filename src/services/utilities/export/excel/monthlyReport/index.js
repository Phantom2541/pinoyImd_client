import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Patients from "./patients";
import DailySales from "./dailySales";
import Expenses from "./expenses";
import IncomeStatement from "./incomeStatement";

const MonhtlyReport = async ({ deals, config, expenses = [], branch }) => {
  const workbook = new ExcelJS.Workbook();
  await Patients({ workbook, deals, config });
  await DailySales({ workbook, deals, config });

  if (expenses.length > 0) {
    await Expenses({ workbook, expenses, config });
  }
  await IncomeStatement({ workbook, deals, config });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" }); // October
  const year = now.getFullYear();

  saveAs(blob, `${branch} Monthly-Report-${month} ${year}.xlsx`);
};

export default MonhtlyReport;
