import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Cellcount, Diffcount, Rci as RCI } from "../../../../../../fakeDb";
import utils from "../utils";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

const parseValue = (value) =>
  value <= 2 ? value.toFixed(2) : value < 10 ? value.toFixed(1) : value;

function convertSuperscriptHTML(unit) {
  if (!unit) return "";
  const supMap = {
    0: "⁰",
    1: "¹",
    2: "²",
    3: "³",
    4: "⁴",
    5: "⁵",
    6: "⁶",
    7: "⁷",
    8: "⁸",
    9: "⁹",
  };

  return unit.replace(/<sup>(\d+)<\/sup>/g, (_, digits) =>
    digits
      .split("")
      .map((d) => supMap[d] || d)
      .join("")
  );
}

export const Hematology = async ({ task, form }) => {
  const { patient, cc, dc, rci, apc, troupe } = task;
  const { Preferences, Abbreviation, Title } = Cellcount;
  const isMale = patient.isMale ? "Male" : "Female";
  const imageBase64 = await utils.getImage();

  const tableSection = (titleRow, rows) => [
    [
      { text: titleRow[0], bold: true, fontSize: 12.5 },
      { text: titleRow[1], bold: true, fontSize: 12.5, alignment: "center" },
      { text: titleRow[2], bold: true, fontSize: 12.5 },
    ],
    ...rows,
  ];

  const cellCountRows = cc.map((cell, index) => {
    const _cell = Number(cell),
      reference = Preferences[isMale],
      { lo, hi, unit } = reference[Abbreviation[index]],
      color = _cell < lo ? "blue" : _cell > hi ? "red" : undefined;

    return [
      { text: Title[index] },
      {
        text: _cell.toFixed(_cell < 20 ? 2 : 0).toString(),
        alignment: "center",
        bold: true,
        color,
      },
      {
        text: `${parseValue(lo)} - ${parseValue(hi)} ${convertSuperscriptHTML(
          unit
        )}`,
      },
    ];
  });

  cellCountRows.push([
    "APC",
    {
      text: apc.toString(),
      alignment: "center",
      bold: true,
      color: apc < 150 ? "blue" : apc > 450 ? "red" : undefined,
    },
    "150 - 450 ⁹/L",
  ]);

  const diffCountRows = Object.values(dc).map((val, idx) => {
    const category = Diffcount.Category[idx];
    const { lo, hi } = Cellcount.Preferences.differentials[category];
    const color = val < lo ? "blue" : val > hi ? "red" : undefined;
    return [
      category,
      {
        text: val ? (val / 100).toFixed(2) : "",
        alignment: "center",
        bold: true,
        color,
      },
      `${(lo / 100).toFixed(2)} - ${(hi / 100).toFixed(2)}`,
    ];
  });

  const rciRows = rci.map((val, idx) => {
    const category = RCI.Category[idx];
    const { lo, hi, unit } = Cellcount.Preferences.rci[category];
    const color = val < lo ? "blue" : val > hi ? "red" : undefined;
    return [
      category,
      { text: val.toString(), alignment: "center", bold: true, color },
      `${lo} - ${hi} ${unit}`,
    ];
  });

  rciRows.push([
    "Bleeding Time",
    {
      text: troupe?.bt?.[0]
        ? `${troupe.bt[0]} min : ${["00", "15", "30", "45"][troupe.bt[1]]} sec.`
        : "",
      alignment: "center",
    },
    "2 - 4 mins",
  ]);
  rciRows.push([
    "Clotting Time",
    {
      text: troupe?.ct?.[0]
        ? `${troupe.ct[0]} min : ${["00", "15", "30", "45"][troupe.ct[1]]} sec.`
        : "",
      alignment: "center",
    },
    "2 - 4 mins",
  ]);
  rciRows.push([
    "Reticulocytes",
    { text: troupe?.retic > 0 ? `${troupe.retic}` : "", alignment: "center" },
    "0.5 - 1.5%",
  ]);
  rciRows.push([
    "ESR",
    { text: troupe?.esr > 0 ? `${troupe.esr}` : "", alignment: "center" },
    "0 - 15 mm/hr",
  ]);

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [10, 59, 10, 60],

    background: (_, pageSize) => [
      {
        image: imageBase64,
        width: pageSize.width,
        height: 50,
        absolutePosition: { x: 0, y: 0 },
      },
    ],

    content: [
      // ✅ Full-width colored section header
      ...utils.header(task),
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "H  E  M  A  T  O  L  O  G  Y",
                alignment: "center",
                characterSpacing: 2,
                fontSize: 15,
                bold: true,
                margin: [0, 0, 0, 0],
              },
            ],
          ],
        },
        layout: {
          fillColor: () => utils.formColor(form.toLowerCase()),
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 2,
          paddingBottom: () => 2,
          hLineColor: () => "#ccc",
          vLineColor: () => "#ccc",
        },
        margin: [0, 0, 0, 1],
      },

      // ✅ Keep this table section as-is (your CBC/Diff/RCI table)
      {
        style: "tableSpacing",
        table: {
          widths: ["*", 120, 140],
          body: [
            ...tableSection(
              ["Complete Blood Count", "Results", "Reference"],
              cellCountRows
            ),
            ...tableSection(
              ["Differential Count", "Results", "Reference"],
              diffCountRows
            ),
            ...tableSection(
              ["Red Cell Immunohaematology", "Results", "Reference"],
              rciRows
            ),
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#aaa",
          vLineColor: () => "#aaa",
        },
      },
    ],
    // footer: (currentPage, pageCount) => ({
    //   columns: [
    //     { text: `Prepared by: ${createdBy}`, alignment: "left", fontSize: 9 },
    //     {
    //       text: `Page ${currentPage} of ${pageCount}`,
    //       alignment: "right",
    //       fontSize: 9,
    //     },
    //   ],
    //   margin: [20, 10],
    // }),

    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: "center",
      },
      sectionHeader: {
        bold: true,
        fillColor: "#eee",
        fontSize: 13,
        margin: [0, 5],
      },
      tableSpacing: {
        margin: [0, 10, 0, 20],
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`Hematology Report - ${new Date().toLocaleDateString()}.pdf`);
};
export default Hematology;
