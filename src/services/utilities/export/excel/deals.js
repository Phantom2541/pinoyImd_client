import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ENDPOINT, fullName, properFullname, timeFormat } from "../..";
import { HMO } from "../../../fakeDb";

const border = {
  top: { style: "thin" },
  left: { style: "thin" },
  right: { style: "thin" },
  bottom: { style: "thin" },
};
const getBanner = async () => {
  try {
    const { branch } = JSON.parse(
      localStorage.getItem("activePlatform") || "{}"
    );
    const { companyId = {}, name = "" } = branch || {};
    const path = `${ENDPOINT}/public/companies/${companyId?.name}/${name}/banner.png`;
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
  banner: async ({ worksheet, workbook }) => {
    // Load image from public folder
    try {
      const image = await getBanner();
      const base64 = image.replace(/^data:image\/\w+;base64,/, "");

      const imageId = workbook.addImage({
        base64,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0.05 }, // A4 = col 0, row 3 (zero-based)
        br: { col: 27, row: 4 },
      });
    } catch (err) {
      console.error("Failed to add image to Excel:", err);
    }
  },
  header: ({ worksheet }) => {
    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.mergeCells("A5:AA6");
    const title = worksheet.getCell("A5");
    title.value = "DAILY SALES REPORT";
    title.font = { bold: true, size: 22 };
    title.border = border;
    title.alignment = { horizontal: "center" };
  },
  main: ({ worksheet, menus, form }) => {
    worksheet.addRow([]);
    worksheet.addRow([]);

    let startingRow = 7;

    let prevCol = 0;

    const headers = [
      { text: "Patient", space: 5 },
      { text: "Time", space: 2 },
      { text: "Source", space: 4 },
      { text: "Physician", space: 4 },
      { text: "Menu", space: 3 },
      { text: "Services Inclusion", space: 4 },
      { text: "Amount", space: 2 },
      { text: "Card", space: 3 },
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
      head.border = border;
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
          customerId,
          cart = [],
          amount = 0,
          source = {},
          physicianId = {},
          createdAt,
          hmo = "",
        } = array[i] || {};
        // Build richText with A., B., C. labels in bold
        const menu = cart.flatMap((service, _) => {
          return [
            {
              text: service.abbreviation + ",    ",
              font: { size: 11 },
            },
          ];
        });
        const servicesInclusion = cart.flatMap((service, _) => {
          return [
            {
              text: service.packagesDisplay + ",    ",
              font: { size: 11 },
            },
          ];
        });

        const element = [
          {
            richText: [
              { text: `${i + 1}. `, font: { size: 11 } },
              { text: `${fullName(customerId?.fullName)}`, font: { size: 13 } },
            ],
          },
          timeFormat(createdAt),
          source?.name || source?.displayname,
          properFullname(physicianId?.fullName),
          { richText: menu },
          { richText: servicesInclusion },
          amount,
          HMO.getName(hmo),
        ];

        let _prevCol = 0;
        let maxLength = 0;

        for (let j = 0; j < element.length; j++) {
          const value = element[j];
          const { space = 2 } = headers[j] || {};
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;
          const cell = worksheet.getCell(cellPos);

          cell.font = { size: 13 };

          if (j > 1) {
            cell.numFmt = '"₱"#,##0.00';
          }

          cell.value = value;

          cell.alignment = {
            horizontal: "left",
            vertical: "middle",
            wrapText: true,
          };

          cell.border = border;

          // Only count plain string lengths for height calculation
          const valueLength =
            typeof value === "string"
              ? value.length
              : value?.richText?.map((t) => t.text).join("").length || 0;

          if (valueLength > maxLength) {
            maxLength = valueLength;
          }

          if (space > 1) {
            worksheet.mergeCells(
              `${cellPos}:${getAlpha(_prevCol + space - 1)}${startPos}`
            );
          }

          _prevCol += space;
        }

        // Adjust row height
        const charsPerLine = 32;
        const lines = Math.ceil(maxLength / charsPerLine);
        const baseHeight = 22;
        const lineHeight = 13;

        worksheet.getRow(startPos).height =
          baseHeight + (lines - 1) * lineHeight;

        startPos++;
      }

      return startPos;
    }
  },
  footer: ({ worksheet, skip, createdBy }) => {
    var startPos = skip + 1;
    const year = new Date().getFullYear();

    // Final formatted string (e.g., "June 30, 2025")
    const validUntil = `December 31, ${year}`;
    const infoRows = [
      { label: "Prepared by: ", value: createdBy },
      {
        label: "Issued on: ",
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
        label: "Note: ",
        value: `Prices are exclusive of additional services unless stated. Valid until ${validUntil}`,
      },
    ];

    infoRows.forEach((item, idx) => {
      const rowNum = startPos + idx; // rows above Legend
      worksheet.mergeCells(`A${rowNum}:L${rowNum}`);
      const cell = worksheet.getCell(`A${rowNum}`);
      cell.border = border;
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

const excel = async ({ array = [] }) => {
  if (!array.length) return;
  const today = new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet(today);

  //  Set the showGridLines property to false to hide grid lines
  worksheet.views = [{ showGridLines: false }];

  await set.banner({ worksheet, workbook });
  set.header({ worksheet });
  set.main({ worksheet, menus: array, form: {} });

  //   const skip = menus.length + (isInhouse ? 7 : 8);
  //   set.footer({ worksheet, skip, createdBy });

  // Save the workbook
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${today}-Daily sales report.xlsx`);
  });
};

export default excel;
