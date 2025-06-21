import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import fullName from "../../fullName";
import { Privileges, Services } from "../../../fakeDb";
import currency from "../../currency";
import { ENDPOINT, getAge } from "../..";

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
  banner: async ({ worksheet, workbook, form }) => {
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
        br: { col: 16, row: 4 },
      });
    } catch (err) {
      console.error("Failed to add image to Excel:", err);
    }
  },
  header: ({ worksheet, options }) => {
    const { physician, source, gross, rebate } = options;
    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    // worksheet.mergeCells("A1:N1");
    // const title = worksheet.getCell("D1");
    // title.value = "STATEMENT OF ACCOUNT";
    // title.font = { bold: true, size: 22 };
    // title.border = border;
    // title.alignment = { horizontal: "center" };

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
      { mergeCell: "A5:H5", value: source, label: "Source" },
      {
        mergeCell: "I5:P5",
        value: physician,
        label: "Physician",
      },

      {
        mergeCell: "A6:H6",
        value: currency(gross),
        label: "Gross",
      },
      {
        mergeCell: "I6:P6",
        value: currency(rebate),
        label: "Rebate",
      },
    ];
    for (const { mergeCell, value, label, position } of datas) {
      generateCell(mergeCell, label, value, position);
    }
  },
  main: ({ worksheet, reseco, isMembership }) => {
    worksheet.addRow([]);
    worksheet.addRow([]);

    let startPos = 7;
    for (let i = 0; i < reseco.length; i++) {
      const { deals, date, time } = reseco[i];
      const dateCell = worksheet.getCell(`A${startPos}`);
      const amount = deals.reduce((acc, item) => acc + item.amount, 0);
      dateCell.value = `${date} ${time} | ${currency(amount)}`;
      dateCell.font = { color: { argb: "FFFFFFFF" }, size: 13 };
      dateCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF5A90C5" },
      };
      dateCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        bottom: { style: "thin" },
      };
      worksheet.mergeCells(`A${startPos}:P${startPos}`);
      startPos++;
      startPos = processArray(deals, startPos);
    }

    function processArray(array, startPos) {
      let headerCol = 0;

      const headers = [
        { text: "Customer", space: 4 },
        { text: "Category" },
        { text: "Services" },
        { text: "Amount" },
        { text: "Discount" },
        { text: "Privillege" },
        { text: "Rebate" },
      ];

      for (let j = 0; j < headers.length; j++) {
        const { text, space = 2 } = headers[j];
        const cellPos = `${getAlpha(headerCol)}${startPos}`;
        const cell = worksheet.getCell(cellPos);
        cell.font = { size: 13, bold: true };

        cell.value = text;
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

        if (space > 1) {
          worksheet.mergeCells(
            `${cellPos}:${getAlpha(headerCol + space - 1)}${startPos}`
          );
        }

        headerCol += space;
      }
      startPos++;
      for (let i = 0; i < array.length; i++) {
        const { customerId, category, cart, amount, discount, privilege } =
          array[i];

        const services = cart
          .map(({ abbreviation }) => abbreviation)
          .join(",    ");
        const customer = fullName(customerId?.fullName);
        const genderIcon = customerId?.isMale ? "\u2642" : "\u2640";
        const element = [
          `${i + 1}.  ${genderIcon} ${customer}  ${getAge(customerId?.dob)}`,
          category,
          services,
          amount,
          discount,
          Privileges[privilege],
          !isMembership ? amount * 0.1 : 0,
        ];

        let _prevCol = 0;
        for (let j = 0; j < element.length; j++) {
          const value = element[j];
          const { space = 2 } = headers[j];
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;

          const cell = worksheet.getCell(cellPos);

          // Apply number formatting
          if (j === 3 || j === 4 || j === 6) {
            cell.numFmt = '"₱"#,##0.00';
          }
          if (j === 0) {
            cell.font = { size: 10 };
          } else {
            cell.font = { size: 13 };
          }

          if (j === 2) {
            // Apply richText formatting to "services"
            cell.value = {
              richText: [
                {
                  text: value,
                  font: { size: 11 }, // smaller font
                },
              ],
            };
          } else {
            cell.value = value;
          }
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

          if (space > 1) {
            worksheet.mergeCells(
              `${cellPos}:${getAlpha(_prevCol + space - 1)}${startPos}`
            );
          }

          _prevCol += space;
        }
        // Compute height only based on 'services'
        const servicesText = element[2]; // index 2 is 'services'
        const charsPerLine = 32;
        const lines = Math.ceil(servicesText.length / charsPerLine);
        const baseHeight = 30;
        const lineHeight = 13;

        worksheet.getRow(startPos).height =
          baseHeight + (lines - 1) * lineHeight;

        startPos++;
      }
      return startPos;
    }
  },
  footer: ({ worksheet, skip, menus = [], options }) => {
    const { createdBy } = options;
    var startPos = skip + 1;

    const infoRows = [
      { label: "Generated by: ", value: createdBy },
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
    startPos = startPos += 3;
    const dateCell = worksheet.getCell(`A${startPos}`);
    dateCell.value = `Legend`;
    dateCell.font = { color: { argb: "FFFFFFFF" }, size: 15, bold: true };
    dateCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF5A90C5" },
    };
    dateCell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };

    worksheet.mergeCells(`A${startPos}:N${startPos}`);

    // Header
    startPos++;
    const head = [
      { text: "Services", space: 7 },
      { text: "Packages", space: 7 },
    ];
    let prevCol = 0;

    for (const { text, space = 2 } of head) {
      const headPos = `${getAlpha(prevCol)}${startPos}`;
      const head = worksheet.getCell(headPos);
      const rowHead = worksheet.getRow(`${startPos}`);
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
          `${headPos}:${getAlpha(prevCol + space - 1)}${startPos}`
        );
      }

      prevCol += space;
    }

    startPos++;
    processArray(menus, startPos);
    function processArray(array, startPos) {
      for (let i = 0; i < array.length; i++) {
        const { abbr, packages } = array[i];
        const _packages = Services.whereIn(packages)
          .map((service) => service.abbreviation)
          .join(",");

        const element = [`${i + 1}. ${abbr}`, _packages]; // parent array element
        let _prevCol = 0;

        let maxLength = 0;
        element.forEach((val) => {
          if (val.length > maxLength) maxLength = val.length;
        });

        const charsPerLine = 30;
        const lines = Math.ceil(maxLength / charsPerLine);
        const rowHeight = lines * 15;

        worksheet.getRow(startPos).height = rowHeight < 20 ? 20 : rowHeight;

        for (let j = 0; j < element.length; j++) {
          const value = element[j];
          const { space = 2 } = head[j];

          const cellPos = `${getAlpha(_prevCol)}${startPos}`;
          const cell = worksheet.getCell(cellPos);
          cell.value = value;
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" },
          };

          cell.alignment = {
            vertical: "middle",
            wrapText: true,
          };

          if (space > 1) {
            worksheet.mergeCells(
              `${cellPos}:${getAlpha(_prevCol + space - 1)}${startPos}`
            );
          }

          _prevCol += space;
        }
        startPos++;
      }
    }
  },
};

// options list
const excel = async ({ array = [], options }) => {
  if (!array.length) return;

  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet("reseco");

  //  Set the showGridLines property to false to hide grid lines
  worksheet.views = [{ showGridLines: false }];

  await set.banner({ worksheet, workbook });
  set.header({ worksheet, options });
  set.main({ worksheet, reseco: array, isMembership: options?.isMembership });
  // const datesLength = array.length * 2;
  // const dealsLength = array.reduce(
  //   (acc, curr) => (acc += curr.deals?.length),
  //   0
  // );

  // const skip = dealsLength + datesLength + 5;
  // set.footer({ worksheet, skip, menus, options });

  // Save the workbook
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Reseco.xlsx`);
  });
};

export default excel;
