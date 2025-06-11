import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { HMO, Services } from "../../fakeDb";
import { ENDPOINT, mobile } from "..";

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

const handleHeader = (worksheet, form) => {
  const { menuType, hmo } = form;
  const generateStaticCell = (mergeCell, label, value, position = "left") => {
    worksheet.mergeCells(mergeCell);
    const startCell = mergeCell.split(":")[0];
    const data = worksheet.getCell(startCell);

    // Set rich text value
    data.value = {
      richText: [
        { text: `${label}: `, font: { bold: true, size: 13 } },
        { text: value, font: { bold: false, size: 13 } },
      ],
    };

    data.border = border;
    data.alignment = { horizontal: position, vertical: "middle" };
  };

  if (menuType === "hmo") {
    const { branch = {} } = JSON.parse(localStorage.getItem("activePlatform"));
    const { companyId = {} } = branch;
    const { hmo: h } = companyId;
    const { cp } = h.find(({ code }) => code === hmo) || {};
    const { phone, agent } = cp;
    generateStaticCell("A5:C5", "Name", HMO.getName(hmo));
    generateStaticCell("D5:H5", "Contact Person", agent);
    generateStaticCell("I5:L5", "Phone No.", mobile(phone));
  }
};

const set = {
  image: async ({ worksheet, workbook, form }) => {
    // Load image from public folder
    try {
      const { priceCategories = [], menuType = "" } = form;
      const isInhouse = menuType === "inhouse";

      const image = await getBanner();
      const base64 = image.replace(/^data:image\/\w+;base64,/, "");

      const imageId = workbook.addImage({
        base64,
        extension: "png",
      });

      worksheet.mergeCells("A1:J4");
      const borderedCell = worksheet.getCell("A1");
      borderedCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      const additionalCol = isInhouse ? priceCategories.length * 2 : 2;

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0.05 }, // A4 = col 0, row 3 (zero-based)
        br: { col: 10 + additionalCol, row: 4 },
      });
    } catch (err) {
      console.error("Failed to add image to Excel:", err);
    }
  },
  banner: ({ worksheet, form }) => {
    const { priceCategories = [], menuType } = form;
    const isInhouse = menuType === "inhouse";

    const baseColumns = 10; // A to J → index 0 to 9
    const extraColumns = priceCategories.length * 2;
    const endColIndex = baseColumns + extraColumns - 1; // zero-based index
    const endColumnLetter = getAlpha(endColIndex); // e.g., "P"

    if (!isInhouse) handleHeader(worksheet, form);

    const column = isInhouse ? 5 : 6;

    worksheet.mergeCells(
      `A${column}:${isInhouse ? endColumnLetter : "L"}${column}`
    );
    const title = worksheet.getCell(`A${column}`);
    title.value = "MENUS PRICE LIST";
    title.font = { bold: true, size: 20 };
    title.border = border;
    title.alignment = { horizontal: "center" };
  },
  main: ({ worksheet, menus, form }) => {
    const { priceCategories = [], menuType = "", hmo = "" } = form;
    const isInhouse = menuType === "inhouse";
    const isHMO = menuType === "hmo";
    worksheet.addRow([]);
    worksheet.addRow([]);

    let startingRow = isInhouse ? 6 : 7;

    let prevCol = 0;

    const headers = [
      { text: "Name", space: 6 },
      { text: "Services", space: 4 },
      ...(isInhouse ? priceCategories : [{ text: "Srp", space: 2 }]),
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

    const handlePrices = (obj) => {
      if (isInhouse) {
        return priceCategories.map(({ value }) => obj?.[value]);
      }
      if (isHMO) {
        return [HMO.getSrp(hmo, obj?.hmo)];
      }
    };

    processArray(menus, startingRow + 1);

    function processArray(array, startPos) {
      for (let i = 0; i < array?.length; i++) {
        const {
          packages,
          description: name = "",
          abbreviation = "",
        } = array[i] || {};

        const rawServices = Services.whereIn(packages);

        // Build richText with A., B., C. labels in bold
        const servicesRichText = rawServices.flatMap((service, index) => {
          const label = String.fromCharCode(65 + index); // A, B, C...
          return [
            { text: `${label}. `, font: { bold: true } },
            {
              text: service.abbreviation + " ",
              // (index !== rawServices.length - 1 ? ", " : ""),
            },
          ];
        });

        const element = [
          `${i + 1}. ${name || abbreviation}`,
          { richText: servicesRichText },
          ...handlePrices(array[i]),
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
        label: "Remarks: ",
        value: `This price list is valid until ${validUntil}`,
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

const filterMenus = ({ array = [], form }) => {
  return array.filter((menu) => HMO.getSrp(form.hmo, menu?.hmo) > 0);
};
const excel = async ({ array = [], form, createdBy }) => {
  if (!array.length) return;
  const isInhouse = form.menuType === "inhouse";
  const menus = isInhouse ? array : filterMenus({ array, form });

  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet("Price List");

  //  Set the showGridLines property to false to hide grid lines
  worksheet.views = [{ showGridLines: false }];

  await set.image({ worksheet, workbook, form });
  set.banner({ worksheet, form });
  set.main({ worksheet, menus, form });

  const skip = menus.length + (isInhouse ? 7 : 8);
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
