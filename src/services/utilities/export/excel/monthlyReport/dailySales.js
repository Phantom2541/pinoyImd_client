import { currency, ENDPOINT } from "../../..";
import Months from "../../../../fakeDb/calendar/months";

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
        br: { col: 13, row: 4 },
      });
    } catch (err) {
      console.error("Failed to add image to Excel:", err);
    }
  },
  header: ({ worksheet, gross, config }) => {
    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    const generateCell = (mergeCell, label, value, position = "left") => {
      worksheet.mergeCells(mergeCell);
      const startCell = mergeCell.split(":")[0];
      const data = worksheet.getCell(startCell);

      // Set rich text value
      data.value = {
        richText: [
          { text: `${label}: `, font: { bold: true, size: 15 } },
          { text: value, font: { bold: false, size: 15 } },
        ],
      };

      data.border = border;
      data.alignment = { horizontal: position, vertical: "middle" };
    };
    const datas = [
      {
        mergeCell: "A5:E5",
        label: "Monthly Report",
        value: `${Months[config.month - 1]},${config.year}`,
      },
      {
        mergeCell: "F5:H5",
        label: "Total Patients",
        value: config.patientsCount,
      },

      {
        mergeCell: "I5:M5",
        value: currency.format(gross),
        label: "Gross",
      },
    ];
    for (const { mergeCell, value, label, position } of datas) {
      generateCell(mergeCell, label, value, position);
    }

    worksheet.mergeCells("A6:M6");
    const title = worksheet.getCell("A6");
    title.value = "DAILY SALES REPORT";
    title.font = { bold: true, size: 22 };
    title.border = border;
    title.alignment = { horizontal: "center" };
  },
  main: ({ worksheet, sales }) => {
    worksheet.addRow([]);
    worksheet.addRow([]);

    let startingRow = 7;

    let prevCol = 0;

    const headers = [
      { text: "Date", space: 3 },
      { text: "Patient Count", space: 2 },
      { text: "Discount", space: 4 },
      { text: "Sales", space: 4 },
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
      head.font = { bold: true, size: 13 };
      head.border = border;
      if (space > 1) {
        worksheet.mergeCells(
          `${headPos}:${getAlpha(prevCol + space - 1)}${startingRow}`
        );
      }

      prevCol += space;
    }

    processArray(sales, startingRow + 1);

    function processArray(array, startPos) {
      for (let i = 0; i < array?.length; i++) {
        const {
          date,
          patientsCount = [],
          sale = 0,
          discount = 0,
        } = array[i] || {};

        const element = [date, patientsCount, discount, sale];

        let _prevCol = 0;
        let maxLength = 0;

        for (let j = 0; j < element.length; j++) {
          const value = element[j];
          const { space = 2 } = headers[j] || {};
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;
          const cell = worksheet.getCell(cellPos);

          cell.font = { size: 13 };

          if (j >= 2) {
            cell.numFmt = '"₱"#,##0.00';
          }

          cell.value = value;

          cell.alignment = {
            horizontal: j === 1 ? "center" : "left",
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

    const infoRows = [
      { label: "Prepared by: ", value: createdBy },
      {
        label: "Date Created: ",
        value: new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
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

const dailySales = async ({ deals = [], workbook, config }) => {
  if (!deals.length) return;

  const worksheet = workbook.addWorksheet("Daily Sales");

  const groupDeals = [...deals]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((acc, deal) => {
      const date = new Date(deal.createdAt).toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(deal);
      return acc;
    }, {});

  const sales = Object.entries(groupDeals).map(([date, dls]) => {
    const d = new Date(date);
    const day = d.getDate(); // e.g., 5
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" }); // e.g., Monday

    return {
      date: `${weekday} (${day})`,
      patientsCount: dls?.length,
      discount: dls.reduce((acc, curr) => acc + curr.discount, 0),
      sale: dls.reduce((acc, curr) => acc + curr.amount, 0),
    };
  });

  const gross = deals.reduce((acc, deal) => acc + deal.amount, 0);

  await set.banner({ worksheet, workbook });
  set.header({
    worksheet,
    gross,
    config: { ...config, patientsCount: deals.length },
  });
  set.main({ worksheet, sales });

  const skip = sales.length + 7;

  set.footer({ worksheet, skip, createdBy: config.createdBy });
};

export default dailySales;
