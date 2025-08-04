import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import utils from "../utils";
import {
  calculateIndicators,
  ENDPOINT,
  findReference,
  formatToSI,
  properFullname,
} from "../../../../../../../services/utilities";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

export const Chemistry = async ({ task, form }) => {
  const { packages, services, patient, signatories } = task;

  const imageBase64 = await utils.getImage();
  const head = signatories[0],
    dr = signatories[1],
    frontdesk = signatories[2];

  const headSig = await utils.getSignature(head?.email);
  const drSig = await utils.getSignature(dr?.email);

  const rows = [
    [
      {
        text: "SERVICE",
        rowSpan: 2,
        bold: true,
        alignment: "center",
        verticalAlignment: "middle",
        margin: [0, 10, 0, 10],
      },
      {
        text: "Conventional Unit",
        colSpan: 2,
        alignment: "center",
        bold: true,
        verticalAlignment: "middle", // optional but good practice
      },
      {},
      {
        text: "System International Unit",
        colSpan: 2,
        alignment: "center",
        bold: true,
        verticalAlignment: "middle",
      },
      {},
    ],
    [
      "",
      { text: "Result", alignment: "center", bold: true },
      { text: "Reference", alignment: "center", bold: true },
      { text: "Result", alignment: "center", bold: true },
      { text: "Reference", alignment: "center", bold: true },
    ],
  ];

  for (const [fk, value] of Object.entries(packages)) {
    const service = services?.find(({ id }) => id === Number(fk));
    if (!service) return "";

    const { name, preference, references } = service;
    const nameUpper = name?.toUpperCase();

    const reference = findReference(
      fk,
      patient?.isMale,
      patient?.dob,
      preference,
      references
    );

    const { lo, hi, units } = reference || {};
    const indicators = calculateIndicators(reference, value);
    const color = value < lo ? "blue" : value > hi ? "red" : "black";

    const siReference = !lo
      ? `< ${formatToSI(nameUpper, hi)}`
      : `${formatToSI(nameUpper, lo)} - ${formatToSI(nameUpper, hi)}`;
    const siValue = formatToSI(
      nameUpper,
      value < 15 ? Number(value).toFixed(2) : Number(value)
    );

    const formattedValue =
      parseFloat(value) % 1 === 0
        ? value
        : (parseFloat(value) * 10) % 10 === 0
        ? parseFloat(value).toFixed(1)
        : value;

    rows.push([
      { text: name, alignment: "left" },
      {
        text: `${indicators || ""}${formattedValue}`,
        color,
        bold: true,
        alignment: "center",
      },
      {
        text: `${!lo ? `< ${hi}` : `${lo} - ${hi}`} ${units}`,
        alignment: "center",
      },
      {
        text: `${indicators || ""}${siValue || ""}`,
        color,
        alignment: "center",
        bold: true,
      },
      {
        text: `${siReference || ""} ${formatToSI(nameUpper) || ""}`,
        alignment: "center",
      },
    ]);
  }

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
      ...utils.header(task),
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                text: "C  H  E  M  I  S  T  R  Y",
                alignment: "center",
                characterSpacing: 2,
                fontSize: 15,
                bold: true,
                color: "#193e81",
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
      {
        table: {
          widths: [190, 65, "*", 65, "*"],
          body: rows,
        },
        layout: {
          fillColor: () => null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#aaa",
          vLineColor: () => "#aaa",
        },
        margin: [0, 10, 0, 20],
      },
    ],
    footer: (currentPage, pageCount) => ({
      margin: [30, 10, 30, 10],
      layout: "noBorders",
      table: {
        widths: ["33%", "34%", "33%"],
        body: [
          [
            {
              stack: [
                ...(headSig
                  ? [
                      {
                        image: headSig,
                        width: 100,
                        opacity: 0.6,
                        margin: [0, 0, 0, -10],
                      },
                    ]
                  : []),
                {
                  text: properFullname(head?.fullName),
                  style: "signatureName",
                },
                {
                  text: "Medical Laboratory Scientist",
                  alignment: "center",
                  fontSize: 9,
                },
                head?.prc
                  ? {
                      text: `PRC#: ${head.prc.id}`,
                      alignment: "center",
                      fontSize: 8,
                    }
                  : "",
              ],
              alignment: "center",
            },
            {
              stack: [
                {
                  text: properFullname(frontdesk?.fullName),
                  style: "signatureName",
                },
                {
                  text: "Receptionist",
                  alignment: "center",
                  fontSize: 9,
                },
              ],
              alignment: "center",
            },
            {}, // blank column
          ],
          [
            {
              colSpan: 3,
              stack: [
                ...(drSig
                  ? [
                      {
                        image: drSig,
                        width: 100,
                        opacity: 0.6,
                        margin: [0, 10, 0, -10], // top spacing for bottom sig
                      },
                    ]
                  : []),
                {
                  text: properFullname(dr?.fullName || "Dr. Juan Dela Cruz"),
                  style: "signatureName",
                  alignment: "center",
                },
                {
                  text: "Pathologist",
                  alignment: "center",
                  fontSize: 9,
                },
                {
                  text: `PRC#: ${dr?.prc?.id || "1234567"}`,
                  alignment: "center",
                  fontSize: 8,
                },
              ],
              alignment: "center",
            },
            {},
            {},
          ],
        ],
      },
    }),

    styles: {
      signatureName: {
        alignment: "center",
        bold: true,
        decoration: "underline",
        fontSize: 10,
        margin: [0, 5, 0, 2],
      },
    },

    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake
    .createPdf(docDefinition)
    .download(`Chemistry Report - ${new Date().toLocaleDateString()}.pdf`);
};

export default Chemistry;
