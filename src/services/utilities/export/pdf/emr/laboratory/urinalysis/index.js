import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ENDPOINT } from "../../../../..";
import utils from "../utils";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
  ResultInRange,
  SpecificGravity,
  Transparency,
  UrineColors,
} from "../../../../../../fakeDb";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

const physicalCountRows = (pe) => {
  const [color, transparency, sg, pH] = pe;
  const rows = [];
  rows.push([
    "Color",
    {
      text: UrineColors[color],
      color: color > 3 && "red",
      bold: true,
    },
  ]);
  rows.push([
    "Transparency",
    {
      text: Transparency[transparency],
      color: !!transparency && "red",
      bold: true,
    },
  ]);
  rows.push(["Specific Gravity", { text: SpecificGravity[sg], bold: true }]);
  rows.push(["Reaction/ pH", { text: PH[pH], bold: true }]);
  return rows;
};
const chemicalCountRows = (ce) => {
  const [
    sugar,
    protein,
    billirubin,
    ketone,
    blood,
    urobilinogen,
    nitrate,
    leukocytes,
  ] = ce || [null, null, null, null, null, null, null, null];
  const rows = [];

  [
    { label: "Sugar", val: sugar },
    { label: "Blood", val: blood },
    { label: "Protein", val: protein },
    { label: "Urobilinogen", val: urobilinogen },
    { label: "Bilirubin", val: billirubin },
    { label: "Nitrate", val: nitrate },
    { label: "Ketone", val: ketone },
    { label: "Leukocytes", val: leukocytes },
  ].forEach((element) => {
    rows.push([
      element.label,
      {
        text: ResultInRange[element.val],
        color: !!element.val && "red",
        bold: true,
      },
    ]);
  });
  return rows;
};

const microscopicCountRows = (me) => {
  const [pus, red, epithelial, mucus, amorphous, bacteria] = me || [
    null,
    null,
    null,
    null,
    null,
    null,
  ];
  const rows = [];
  [
    { label: "PUS", val: MicroscopicInRange[pus], color: pus > 2 && "red" },
    {
      label: "Red cells",
      val: MicroscopicInRange[red],
      color: red > 2 && "red",
    },
    { label: "Epithelial Cell", val: MicroscopicResultInWord[epithelial] },
    { label: "Amorphous urates", val: MicroscopicResultInWord[amorphous] },
    {
      label: " Mucus Threads",
      val: MicroscopicResultInWord[mucus],
      color: mucus > 1 && "red",
    },
    {
      label: "Bacteria",
      val: MicroscopicResultInWord[bacteria],
      color: bacteria > 1 && "red",
    },
  ].forEach((element) => {
    rows.push([
      element.label,
      {
        text: element.val,
        color: element.color || "black",
        bold: true,
      },
    ]);
  });
  return rows;
};

export const Urinalysis = async ({ task, form }) => {
  const { pe, ce, me } = task;

  const imageBase64 = await utils.getImage();

  const tableSection = (titleRow, rows) => [
    [
      {
        text: titleRow[0],
        bold: true,
        fontSize: 12.5,
        _isTitle: true,
        colSpan: 2,
      },
      {},
    ],
    ...rows,
  ];

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
                text: "U  R  I  N  A  L  Y  S  I  S",
                alignment: "center",
                characterSpacing: 2,
                fontSize: 15,
                bold: true,
                color: "#846504",
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

      // ✅ Physical Examination
      {
        style: "tableSpacing",
        table: {
          widths: ["*", "*"],
          body: [
            ...tableSection(["Physical Examination"], physicalCountRows(pe)),
            ...tableSection(["Chemical Examination"], chemicalCountRows(ce)),
            ...tableSection(
              ["Microscopic Examination"],
              microscopicCountRows(me)
            ),
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: (i, node, columnIndex) => {
            const row = node.table.body[i];
            const isTitleRow = row?.[0]?._isTitle;
            // Remove vertical line between colSpan columns
            if (isTitleRow && columnIndex === 1) return 0;
            return 0.5;
          },
          hLineColor: () => "#aaa",
          vLineColor: () => "#aaa",
        },
      },
    ],

    styles: {
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
    .download(`Urinalysis Report - ${new Date().toLocaleDateString()}.pdf`);
};

export default Urinalysis;
