import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import utils from "../../utils";
import {
  BacteriaInRange,
  Consistency,
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
  ResultInRange,
  UrineColors,
} from "../../../../../../fakeDb";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

const physicalCountRows = (pe) => {
  const [color, consistency] = pe || [null, null];

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
    "Consistency",
    {
      text: Consistency[consistency],
      color: consistency > 3 && "red",
      bold: true,
    },
  ]);
  return rows;
};
const chemicalCountRows = (ce) => {
  const [pH, occult] = ce || [null, null];

  const rows = [];

  [
    { label: "Stool pH", val: PH[pH] },
    {
      label: "Occult Blood",
      val: occult === undefined ? "" : occult === "0" ? "Negative" : "Positive",
    },
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
  const [pus, red, bac, yeast, fat] = me || [null, null];

  const rows = [];
  [
    { label: "PUS", val: MicroscopicInRange[pus], color: pus > 2 && "red" },
    {
      label: "Red cells",
      val: MicroscopicInRange[red],
      color: red > 3 && "red",
    },
    { label: "Bacteria", val: BacteriaInRange[bac], color: bac > 3 && "red" },
    {
      label: "Yeast Cells",
      val: MicroscopicResultInWord[yeast],
      color: yeast > 0 && "red",
    },
    {
      label: " Fat Globules",
      val: MicroscopicResultInWord[fat],
      color: fat > 1 && "red",
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

export const Parasitology = async ({ task, form, result }) => {
  const { pe, ce, me, signatories } = task;

  const imageBase64 = await utils.getImage(result);
  const [head, dr] = signatories;
  const headSig = await utils.getSignature(head.email);
  const drSig = await utils.getSignature(dr.email);
  const imgLogo = await utils.getLogo();
  const QrCode = await utils.generateQrCODE(result);
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
                text: "P  A  R  A  S  I  T  O  L  O  G  Y",
                alignment: "center",
                characterSpacing: 2,
                fontSize: 15,
                bold: true,
                color: "#3c5b2b",
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
            ...tableSection(
              ["Microscopic Examination"],
              microscopicCountRows(me)
            ),
            ...tableSection(["Chemical Examination"], chemicalCountRows(ce)),
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
    footer: utils.footer({ drSig, headSig, imgLogo, QrCode, task }),

    styles: {
      tableSpacing: {
        margin: [0, 10, 0, 20],
      },
    },

    defaultStyle: {
      fontSize: 10,
    },
  };
  utils.download(docDefinition, "Parasitology");
};

export default Parasitology;
