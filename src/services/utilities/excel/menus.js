import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import fullName from "../fullName";
import { Privileges, Services } from "../../fakeDb";
import currency from "../currency";
import logo from "../../../assets/failedLogo.png";
import axios from "axios";
import { ENDPOINT } from "..";

const getBanner = async () => {
  try {
    const { branch } = JSON.parse(
      localStorage.getItem("activePlatform") || "{}"
    );
    const { companyId = {}, name = "" } = branch || {};
    const path = `${ENDPOINT}/public/companies/${companyId?.name}/${name}/banner.png`;

    console.log("Fetching banner from:", path);

    const response = await fetch(path);
    if (!response.ok) {
      console.error(
        "Failed to fetch image:",
        response.status,
        response.statusText
      );
      return null;
    }

    const blob = await response.blob();
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // returns full base64 string
      reader.onerror = reject;
      reader.readAsDataURL(blob); // converts to data:image/png;base64,...
    });

    return base64;
  } catch (error) {
    console.error("Error in getBanner:", error);
    return null;
  }
};

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  getAlpha = (pos) => {
    let result = "";
    const base = 26;

    while (pos >= 0) {
      result = alphabets[pos % base] + result;
      pos = Math.floor(pos / base) - 1;

      if (pos < 0) {
        break;
      }
    }

    return result;
  };

const set = {
  image: async ({ worksheet, workbook }) => {
    // Load image from public folder
    try {
      const image = await getBanner();
      const base64 = image.replace(/^data:image\/\w+;base64,/, "");

      const imageId = workbook.addImage({
        base64,
        extension: "png",
      });

      // ✅ Insert image into worksheet
      worksheet.mergeCells("A1:J4");
      const borderedCell = worksheet.getCell("A1");
      borderedCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Add image using cell-based positioning (no static width/height)
      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0.05 }, // A4 = col 0, row 3 (zero-based)
        br: { col: 12, row: 4 }, // J4 = col 9, so br.col = 10 (non-inclusive), row 4 = next row
      });

      console.log("Image successfully added to Excel!");
    } catch (err) {
      console.error("Failed to add image to Excel:", err);
    }
  },
  banner: ({ worksheet }) => {
    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.mergeCells("A5:L5");
    const title = worksheet.getCell("A5");
    title.value = "MENUS PRICE LIST";
    title.font = { bold: true, size: 20 };
    title.border = border;
    title.alignment = { horizontal: "center" };
  },
  main: ({ worksheet, menus }) => {
    worksheet.addRow([]);
    worksheet.addRow([]);

    let startingRow = 6;

    let prevCol = 0;

    const headers = [
      { text: "Name", space: 6 },
      { text: "Services", space: 4 },
      { text: "SRP", space: 2 },
    ];

    for (const { text, space = 2 } of headers) {
      const headPos = `${getAlpha(prevCol)}${startingRow}`;
      const head = worksheet.getCell(headPos);
      const rowHead = worksheet.getRow(`${startingRow}`);
      rowHead.height = 20;
      head.value = text;
      head.alignment = {
        vertical: "middle",
        wrapText: true,
      };
      head.font = { bold: true, size: 12 };
      head.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };

      if (space > 1) {
        worksheet.mergeCells(
          `${headPos}:${getAlpha(prevCol + space - 1)}${startingRow}`
        );
      }

      prevCol += space;
    }

    processArray(menus, startingRow + 1);

    function processArray(array, startPos) {
      for (let i = 0; i < array?.length; i++) {
        const {
          packages,
          opd,
          description: name = "",
          abbreviation = "",
        } = array[i] || {};

        const services = Services.whereIn(packages)
          .map((service) => service.abbreviation)
          .join(",");

        const element = [`${i + 1}. ${name || abbreviation}`, services, opd];

        let _prevCol = 0;
        let maxLength = 0; // Reset for each row

        for (let j = 0; j < element.length; j++) {
          const value = element[j];
          const { space = 2 } = headers[j] || {};
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;
          const cell = worksheet.getCell(cellPos);

          cell.font = { size: 13 };

          if (j === 2) {
            cell.numFmt = '"₱"#,##0.00';
          }

          cell.value = value;
          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          };

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          };

          if (typeof value === "string" && value.length > maxLength) {
            maxLength = value.length;
          }

          if (space > 1) {
            worksheet.mergeCells(
              `${cellPos}:${getAlpha(_prevCol + space - 1)}${startPos}`
            );
          }

          _prevCol += space;
        }

        // 🔧 Adjust row height based on content length
        const charsPerLine = 32; // Fewer chars per line = more frequent wrapping
        const lines = Math.ceil(maxLength / charsPerLine);

        const baseHeight = 22; // Slightly taller than default
        const lineHeight = 13; // Slightly reduced line gap

        worksheet.getRow(startPos).height =
          baseHeight + (lines - 1) * lineHeight;

        startPos++;
      }

      return startPos;
    }
  },
  footer: ({ worksheet, skip, createdBy }) => {
    var startPos = skip + 1;
    const now = new Date();

    // Get current month and year
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();

    // Get last day of current month
    const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

    // Final formatted string (e.g., "June 30, 2025")
    const validUntil = `${month} ${lastDay}, ${year}`;
    const infoRows = [
      { label: "Generated by: ", value: createdBy },
      {
        label: "Date Created: ",
        value: new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true, // optional, for AM/PM format
        }),
      },
      {
        label: "Valid Until: ",
        value: validUntil,
      },
    ];

    infoRows.forEach((item, idx) => {
      const rowNum = startPos + idx; // rows above Legend
      worksheet.mergeCells(`A${rowNum}:N${rowNum}`);
      const cell = worksheet.getCell(`A${rowNum}`);
      cell.value = {
        richText: [
          { text: item.label, font: { bold: true, size: 13 } },
          { text: item.value, font: { size: 13 } },
        ],
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });
  },
};
// options list
const excel = async ({ array = [], createdBy }) => {
  if (!array.length) return;

  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet("Price List");

  //  Set the showGridLines property to false to hide grid lines
  worksheet.views = [{ showGridLines: false }];

  await set.image({ worksheet, workbook });
  set.banner({ worksheet });
  set.main({ worksheet, menus: array });

  const skip = array.length + 7;
  set.footer({ worksheet, skip, createdBy });

  // Save the workbook
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `Menus Price List ${new Date().toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}.xlsx`
    );
  });
};

export default excel;
