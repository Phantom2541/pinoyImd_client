import fullName from "../../../fullName";
import { Statements } from "../../../../fakeDb";
import currency from "../../../currency";
import { dateFormat, ENDPOINT } from "../../..";
import Months from "../../../../fakeDb/calendar/months";

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

const getVendorOrParticular = (payable = {}) => {
  if (!payable?._id) return "-";
  const { particular = {}, supplier = {} } = payable || {};
  if (!particular && !supplier) return "-";
  const { vendors = {} } = supplier || {};
  return particular?._id
    ? fullName(particular.fullName)
    : vendors?._id
    ? `${vendors?.name || vendors?.displayname} `
    : `${supplier?.name || supplier?.displayname}`;
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
        br: { col: 20, row: 4 },
      });
    } catch (err) {
      console.error("Failed to add image to Excel:", err);
    }
  },
  header: ({ worksheet, totalExpenses, config }) => {
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
        mergeCell: "A5:H5",
        label: "Monthly Report",
        value: `${Months[config.month - 1]},${config.year}`,
      },
      {
        mergeCell: "I5:L5",
        label: "Number of Expenses",
        value: config.expensesCount,
      },

      {
        mergeCell: "M5:T5",
        value: currency.format(totalExpenses),
        label: "Total Expenses",
      },
    ];
    for (const { mergeCell, value, label, position } of datas) {
      generateCell(mergeCell, label, value, position);
    }

    worksheet.mergeCells("A6:T6");
    const title = worksheet.getCell("A6");
    title.value = "EXPENSES REPORT";
    title.font = { bold: true, size: 22 };
    title.border = border;
    title.alignment = { horizontal: "center" };
  },
  main: ({ worksheet, vouchers }) => {
    worksheet.addRow([]);
    worksheet.addRow([]);

    let startPos = 7;
    for (let i = 0; i < vouchers.length; i++) {
      const { expenses = [], date } = vouchers[i];
      const dateCell = worksheet.getCell(`A${startPos}`);
      const amount = expenses.reduce((acc, item) => {
        const { breakdown, amount, fsId } = item;
        const baseAmount = fsId === 13 ? breakdown?.net : amount;
        return acc + baseAmount;
      }, 0);
      dateCell.value = `${date} | ${currency.format(amount)}`;
      dateCell.font = { color: { argb: "FFFFFFFF" }, size: 15 };
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

      worksheet.mergeCells(`A${startPos}:T${startPos}`);
      startPos++;
      startPos = processArray(expenses, startPos);
    }

    function processArray(array, startPos) {
      let headerCol = 0;

      const headers = [
        { text: "Particular/Vendor", space: 4 },
        { text: "Time", space: 2 },
        { text: "Statement", space: 4 },
        { text: "Amount", space: 2 },
        { text: "Remarks", space: 4 },
        { text: "Payor", space: 4 },
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
        const {
          userId,
          fsId,
          amount,
          createdAt,
          payableId,
          particular,
          breakdown = {},
        } = array[i];
        let maxLength = 0;
        const isPayroll = fsId === 13;
        const payor = fullName(userId?.fullName);
        const genderIcon = userId?.isMale ? "\u2642" : "\u2640";
        const element = [
          `${i + 1}. ${
            isPayroll
              ? fullName(particular?.fullName)
              : getVendorOrParticular(payableId)
          }`,
          new Date(createdAt).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          Statements.getName(fsId),
          isPayroll ? breakdown.net : amount,
          payableId?.remarks || "",
          `${genderIcon} ${payor}`,
        ];

        let _prevCol = 0;
        for (let j = 0; j < element.length; j++) {
          const value = element[j];
          const { space = 2 } = headers[j] || {};
          const cellPos = `${getAlpha(_prevCol)}${startPos}`;

          const cell = worksheet.getCell(cellPos);
          if (j === 3) {
            cell.numFmt = '"₱"#,##0.00';
          }

          cell.value = value;
          cell.font = { size: 13 };

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
        const baseHeight = 32;
        const lineHeight = 14;

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
const Patients = async ({ expenses: _expenses = [], workbook, config }) => {
  if (!_expenses.length) return;
  const expenses = [..._expenses].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const groupExpenses = expenses.reduce((acc, deal) => {
    const date = new Date(deal.createdAt).toLocaleDateString("en-CA", {
      timeZone: "Asia/Manila",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(deal);
    return acc;
  }, {});

  const groupedArray = Object.entries(groupExpenses).map(([date, exp]) => ({
    date: dateFormat(date),
    expenses: exp,
  }));
  //   const gross = deals.reduce((acc, deal) => acc + deal.amount, 0);
  const worksheet = workbook.addWorksheet("Expenses");
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  await set.banner({ worksheet, workbook });
  set.header({
    worksheet,
    totalExpenses,
    config: { ...config, expensesCount: expenses.length },
  });
  set.main({
    worksheet,
    vouchers: groupedArray,
  });
  const datesLength = groupedArray.length * 2;
  const dealsLength = groupedArray.reduce(
    (acc, curr) => (acc += curr.expenses?.length),
    0
  );

  const skip = dealsLength + datesLength + 6;

  set.footer({ worksheet, skip, createdBy: config.createdBy });

  // Save the workbook
};

export default Patients;
