import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import utils from "../../utils";
import bodySwitcher from "./bodySwitcher";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

export const Miscellaneous = async ({ task, form, result }) => {
  const { signatories, packages = [], specimen } = task;
  const { method, kit, lot, expiry } = task?.troupe || {};
  const imageBase64 = await utils.getImage();

  const [head, dr] = signatories;
  const headSig = await utils.getSignature(head.email);
  const drSig = await utils.getSignature(dr.email);
  const imgLogo = await utils.getLogo();
  const QrCode = await utils.generateQrCODE(result);
  console.log("packages", packages);
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
                text: "M  I  S  C  E  L  L  A  N  E  O  U  S",
                alignment: "center",
                characterSpacing: 2,
                fontSize: 15,
                bold: true,
                color: "black",
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

      // ✅ Encased table gaya ng screenshot mo
      {
        table: {
          widths: ["*"],
          body: [
            [
              {
                stack: [
                  ...(!packages.includes(11) && !packages.includes(146)
                    ? [
                        {
                          text: [
                            "Specimen: ",
                            {
                              text: specimen.toUpperCase(),
                              bold: true,
                              decoration: "underline",
                            },
                          ],
                          fontSize: 11,
                          margin: [0, 0, 0, 2],
                        },
                      ]
                    : []),
                  ...bodySwitcher(task),
                  //Category
                  ...(packages.includes(146)
                    ? [
                        {
                          table: {
                            widths: ["*"],
                            body: [
                              [
                                {
                                  text: [
                                    { text: specimen, bold: true },
                                    "OGTT",
                                  ],
                                },
                              ],
                            ],
                          },
                          layout: {
                            // Horizontal lines
                            hLineWidth: function (i) {
                              return i === 0 ? 1 : 0; // 1px lang sa taas, 0 sa iba
                            },
                            hLineColor: function () {
                              return "#000"; // kulay ng top border
                            },
                            // Vertical lines
                            vLineWidth: function () {
                              return 0; // walang vertical borders
                            },
                          },
                          margin: [0, 5, 0, 5],
                        },
                      ]
                    : []),
                  //Troupe
                  ...(!packages.includes(66) &&
                  !packages.includes(11) &&
                  !packages.includes(146)
                    ? [
                        {
                          table: {
                            widths: ["*"],
                            body: [
                              [
                                {
                                  text: [
                                    "Method: ",
                                    { text: method, bold: true },
                                  ],
                                },
                              ],
                              [{ text: ["Kit: ", { text: kit, bold: true }] }],
                              [
                                {
                                  text: [
                                    "Lot Number: ",
                                    { text: lot, bold: true },
                                  ],
                                },
                              ],
                              [
                                {
                                  text: [
                                    "Expiration Date: ",
                                    { text: expiry, bold: true },
                                  ],
                                },
                              ],
                            ],
                          },
                          layout: {
                            // Horizontal lines
                            hLineWidth: function (i) {
                              return i === 0 ? 1 : 0;
                            },
                            hLineColor: function () {
                              return "#000";
                            },
                            // Vertical lines
                            vLineWidth: function () {
                              return 0;
                            },
                          },
                          margin: [0, 5, 0, 0],
                        },
                      ]
                    : []),
                ],
              },
            ],
          ],
        },
        layout: {
          hLineColor: () => "#000",
          vLineColor: () => "#000",
          hLineWidth: () => 1,
          vLineWidth: () => 1,
        },
        margin: [0, 5, 0, 5],
      },
    ],

    footer: utils.footer({
      task,
      headSig,
      drSig,
      imgLogo,
      QrCode,
    }),

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
    .download(`Miscellaneous Result - ${new Date().toLocaleDateString()}.pdf`);
};

export default Miscellaneous;
