import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import fullName from "../../fullName";
import { Privileges, Services } from "../../../fakeDb";
import currency from "../../currency";
import { ENDPOINT, mobile } from "../..";
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
        br: { col: 18, row: 3 },
      });
    } catch (err) {
      console.error("Failed to add image to Excel:", err);
    }
  },
  header: ({ worksheet, options }) => {
    const {
      name,
      gross,
      due,
      dateRange,
      address,
      customerCount,
      isSource = true,
      cp = {},
    } = options;
    const border = {
      top: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
      bottom: { style: "thin" },
    };
    worksheet.mergeCells("A4:R4");
    const title = worksheet.getCell("R4");
    title.value = "STATEMENT OF ACCOUNT";
    title.font = { bold: true, size: 22 };
    title.border = border;
    title.alignment = { horizontal: "center" };

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
      { mergeCell: "A5:I5", value: name.toUpperCase(), label: "Name" },
      {
        mergeCell: "J5:R5",
        value: dateRange,
        label: "From",
        position: "right",
      },

      {
        mergeCell: "A6:I6",
        value: isSource ? address : cp?.agent,
        label: isSource ? "Address" : "Contact Person",
      },
      {
        mergeCell: "J6:R6",
        value: isSource ? due : mobile(cp?.phone),
        label: isSource ? "Due Date" : "Contact Number",
        position: "right",
      },

      {
        mergeCell: "A7:I7",
        value: customerCount,
        label: "Number of Customers",
      },
      {
        mergeCell: "J7:R7",
        value: currency.format(gross),
        label: "Gross",
        position: "right",
      },
    ];
    for (const { mergeCell, value, label, position } of datas) {
      generateCell(mergeCell, label, value, position);
    }
  },
  main: ({ worksheet, vouchers }) => {
    worksheet.addRow([]);
    worksheet.addRow([]);

    let startPos = 8;
    for (let i = 0; i < vouchers.length; i++) {
      const { deals, date } = vouchers[i];
      const dateCell = worksheet.getCell(`A${startPos}`);
      const amount = deals.reduce((acc, item) => acc + item.amount, 0);
      dateCell.value = `${date} ${currency.format(amount)}`;
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

      worksheet.mergeCells(`A${startPos}:R${startPos}`);
      startPos++;
      startPos = processArray(deals, startPos);
    }

    function processArray(array, startPos) {
      let headerCol = 0;

      const headers = [
        { text: "Customer", space: 4 },
        { text: "Category" },
        { text: "Menu", space: 3 },
        { text: "Services inclusion", space: 3 },
        { text: "Amount" },
        { text: "Discount" },
        { text: "Privillege" },
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
      let maxLength = 0;
      for (let i = 0; i < array.length; i++) {
        const { customerId, category, cart, amount, discount, privilege } =
          array[i];

        const menus = cart.map(({ abbreviation }) => abbreviation).join(", ");
        const services = cart
          .flatMap(({ menuId }) => Services.whereInAbbr(menuId.packages))
          .join(",");
        const customer = fullName(customerId?.fullName);
        const genderIcon = customerId?.isMale ? "\u2642" : "\u2640";
        const element = [
          `${i + 1}.  ${genderIcon} ${customer}`,
          category,
          menus,
          services,
          currency.format(amount),
          currency.format(discount),
          Privileges[privilege],
        ];

        let _prevCol = 0;
        for (let j = 0; j < element.length; j++) {
          const value = element[j];
          const { space = 2 } = headers[j];
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;

          const cell = worksheet.getCell(cellPos);
          if (j === 2 || j === 3) {
            cell.value = {
              richText: [
                {
                  font: {
                    size: 11,
                  }, // adjust font size here
                  text: value,
                },
              ],
            };
          } else {
            cell.value = value;
            cell.font = { size: 13 };
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

          const valueLength = value?.length;

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
    // startPos = startPos += 3;
    // const dateCell = worksheet.getCell(`A${startPos}`);
    // dateCell.value = `Legend`;
    // dateCell.font = { color: { argb: "FFFFFFFF" }, size: 15, bold: true };
    // dateCell.fill = {
    //   type: "pattern",
    //   pattern: "solid",
    //   fgColor: { argb: "FF5A90C5" },
    // };
    // dateCell.border = {
    //   top: { style: "thin" },
    //   left: { style: "thin" },
    //   right: { style: "thin" },
    //   bottom: { style: "thin" },
    // };

    // worksheet.mergeCells(`A${startPos}:N${startPos}`);

    // // Header
    // startPos++;
    // const head = [
    //   { text: "Services", space: 7 },
    //   { text: "Packages", space: 7 },
    // ];
    // let prevCol = 0;

    // for (const { text, space = 2 } of head) {
    //   const headPos = `${getAlpha(prevCol)}${startPos}`;
    //   const head = worksheet.getCell(headPos);
    //   const rowHead = worksheet.getRow(`${startPos}`);
    //   rowHead.height = 20;
    //   head.value = text;
    //   head.alignment = {
    //     vertical: "middle",
    //     wrapText: true,
    //   };
    //   head.font = { bold: true, size: 12 };
    //   head.border = {
    //     top: { style: "thin" },
    //     left: { style: "thin" },
    //     right: { style: "thin" },
    //     bottom: { style: "thin" },
    //   };

    //   if (space > 1) {
    //     worksheet.mergeCells(
    //       `${headPos}:${getAlpha(prevCol + space - 1)}${startPos}`
    //     );
    //   }

    //   prevCol += space;
    // }

    // startPos++;
    // processArray(menus, startPos);
    // function processArray(array, startPos) {
    //   for (let i = 0; i < array.length; i++) {
    //     const { abbr, packages } = array[i];
    //     const _packages = Services.whereIn(packages)
    //       .map((service) => service.abbreviation)
    //       .join(",");

    //     const element = [`${i + 1}. ${abbr}`, _packages]; // parent array element
    //     let _prevCol = 0;

    //     let maxLength = 0;
    //     element.forEach((val) => {
    //       if (val.length > maxLength) maxLength = val.length;
    //     });

    //     const charsPerLine = 30;
    //     const lines = Math.ceil(maxLength / charsPerLine);
    //     const rowHeight = lines * 15;

    //     worksheet.getRow(startPos).height = rowHeight < 20 ? 20 : rowHeight;

    //     for (let j = 0; j < element.length; j++) {
    //       const value = element[j];
    //       const { space = 2 } = head[j];

    //       const cellPos = `${getAlpha(_prevCol)}${startPos}`;
    //       const cell = worksheet.getCell(cellPos);
    //       cell.value = value;
    //       cell.border = {
    //         top: { style: "thin" },
    //         left: { style: "thin" },
    //         right: { style: "thin" },
    //         bottom: { style: "thin" },
    //       };

    //       cell.alignment = {
    //         vertical: "middle",
    //         wrapText: true,
    //       };

    //       if (space > 1) {
    //         worksheet.mergeCells(
    //           `${cellPos}:${getAlpha(_prevCol + space - 1)}${startPos}`
    //         );
    //       }

    //       _prevCol += space;
    //     }
    //     startPos++;
    //   }
    // }
  },
};

// options list
const excel = async ({ array = [], menus = [], options }) => {
  if (!array.length) return;

  const { sheet = "vouchers", fileName, ...rest } = options;

  const workbook = new ExcelJS.Workbook(),
    worksheet = workbook.addWorksheet(sheet);

  //  Set the showGridLines property to false to hide grid lines
  worksheet.views = [{ showGridLines: false }];

  await set.banner({ worksheet, workbook });
  set.header({ worksheet, options: rest });
  set.main({ worksheet, vouchers: array });
  const datesLength = array.length * 2;
  const dealsLength = array.reduce(
    (acc, curr) => (acc += curr.deals?.length),
    0
  );

  const skip = dealsLength + datesLength + 7;
  set.footer({ worksheet, skip, menus, options });

  // Save the workbook
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}.xlsx`);
  });
};

export default excel;
