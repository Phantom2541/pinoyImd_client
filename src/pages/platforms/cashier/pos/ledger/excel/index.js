import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const set = {
  banner: ({ worksheet }) => {
    worksheet.mergeCells("A1:Q5");
    const title = worksheet.getCell("A1");
    title.value = "Banner Here";
  },
  total: ({ worksheet, monthlySale, patients, expenses }) => {
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    const generateTitle = ({ pos, text, value }) => {
      worksheet.mergeCells(7, pos, 7, pos + 1);
      worksheet.mergeCells(7, pos + 2, 7, pos + 3);

      const textCell = worksheet.getCell(7, pos);
      textCell.value = text;
      textCell.border = borderStyle;

      const valueCell = worksheet.getCell(7, pos + 2);
      valueCell.value = value;
      valueCell.border = borderStyle;
    };

    const titles = [
      {
        pos: 1,
        text: "Monthly Sale",
        value: monthlySale,
      },
      {
        pos: 6,
        text: "Patients",
        value: patients,
      },
      {
        pos: 11,
        text: "Expenses",
        value: expenses,
      },
    ];

    titles.forEach((title) => generateTitle({ ...title }));
  },
  table: ({ worksheet, array, startRow, startColumn, isTotal }) => {
    // Extract keys from the first object in the array
    const keys = Object.keys(array[0]);

    //Change the size of the cell
    const columnF = worksheet.getColumn("F");
    columnF.width = 25;

    const columnM = worksheet.getColumn("M");
    columnM.width = 25;

    // styles
    const borderStyle = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
      backgroundColor = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "595959" },
      },
      textWhite = {
        color: { argb: "FFFFFF" },
      };

    // Populate the worksheet with table header based on keys
    const tHeadRow = worksheet.getRow(startRow || 1); // Default start row is 1
    keys.forEach((key, index) => {
      const cell = tHeadRow.getCell(startColumn + index); // Adjusted to startColumn
      cell.value = key.charAt(0).toUpperCase() + key.slice(1);
      cell.border = borderStyle;
      cell.fill = backgroundColor;
      cell.font = textWhite;
    });

    // values of the table
    array.forEach((data, rowIndex) => {
      const values = keys.map((key) => data[key]);
      const tBodyRow = worksheet.getRow(startRow + rowIndex + 1); // Adjusted to startRow and skipping header row
      values.forEach((value, colIndex) => {
        const cell = tBodyRow.getCell(startColumn + colIndex); // Adjusted to startColumn
        cell.value = value;
        cell.border = borderStyle;
      });
    });
    if (isTotal) {
      const totalPos = worksheet.getCell(array.length + 8, startColumn + 3); // Adjusted index for the row position
      worksheet.mergeCells(
        array.length + 8,
        startColumn + 3,
        array.length + 8,
        startColumn + 4
      );
      totalPos.value = "Total";
      totalPos.alignment = { horizontal: "center" };
      totalPos.border = borderStyle;

      const computeTotal = worksheet.getCell(array.length + 8, startColumn + 5); // Adjusted index for the row position
      computeTotal.value = "3";
      computeTotal.border = borderStyle;
    }
  },
  footer: ({ worksheet, startRow, endColumn, preparedBy = "" }) => {
    const borderStyle = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
      fontStyle = {
        bold: true,
        size: 12,
      };

    worksheet.addRow([]);
    worksheet.addRow([]);
    const footerSignature = worksheet.getCell(startRow, 1);
    worksheet.mergeCells(startRow, 1, startRow, endColumn);
    footerSignature.value = `Prepared By: ${preparedBy}`;
    footerSignature.border = borderStyle;
    footerSignature.font = fontStyle;
  },
};

const Excel = async ({ title, preparedBy, tables, ...rest }) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet(title);
  worksheet.views = [{ showGridLines: false }];

  // Add data to the worksheet
  set.banner({ worksheet });
  set.total({ worksheet, ...rest });

  const entries = Object.values(tables);

  let startColumn = 1;

  for (let index = 0; index < entries.length; index++) {
    const array = entries[index];

    if (!!index) startColumn += Object.keys(entries[index - 1][0]).length + 1;

    set.table({ worksheet, array, startRow: 9, startColumn });
  }

  const startRow = Object.values(tables)
      .map((a) => a.length + 12)
      .reduce((a, l) => (l > a ? l : a), 0),
    tableValues = Object.values(tables),
    endColumn = tableValues
      .map((array) => array[0])
      .map((obj) => Object.keys(obj).length)
      .reduce((a, l) => a + l, tableValues.length - 1);

  set.footer({ worksheet, startRow, endColumn, preparedBy });

  // Save the workbook
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${title}.xlsx`);
  });
};

export default Excel;
