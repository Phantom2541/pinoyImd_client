import { Cloudinary, ENDPOINT, properFullname } from "../../..";
import logo from "../../../../../assets/iMD.png";
import QRCode from "qrcode";
import getAge from "../../../getAge";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

const toBase64 = (url) =>
  fetch(url)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
const getBase64Image = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = reject;
  });
};

const image = async (result) => {
  const { branchId = {} } = result;
  const { name, companyId = {} } = branchId;

  return await getBase64Image(
    `${Cloudinary.getEndpoint()}/companies/${
      companyId?.name
    }/${name}/banner.png`
  );
};
const signature = async (email) => {
  try {
    return await getBase64Image(
      `${Cloudinary.getEndpoint()}/users/${email}/signature.png`
    );
  } catch (err) {
    console.error(`Failed to get signature for ${email}:`, err);
    return null; // or return "" kung mas gusto mo
  }
};

const utils = {
  header: (task) => {
    const { patient, updatedAt } = task;
    const { fullName: pFull, isMale = false, dob = "", _id } = patient;
    const name = `${pFull.lname.toUpperCase()}, ${pFull.fname.toUpperCase()} ${
      pFull.mname ? `y ${pFull.mname.toUpperCase()}` : ""
    }`;
    return [
      {
        columns: [
          {
            width: "*",
            text: [
              "Name: ",
              {
                text: name,
                bold: true,
                decoration: "underline",
              },
            ],
            fontSize: 11,
            alignment: "left",
          },
          {
            width: "*",
            text: ["Date: ", new Date(updatedAt).toDateString()],
            fontSize: 11,
            alignment: "right",
          },
        ],
        columnGap: 10,
        margin: [0, 0, 0, 2],
      },
      {
        columns: [
          {
            width: "*",
            text: ["Patient Code: ", { text: _id, bold: true }],
            fontSize: 11,
            alignment: "left",
          },
          {
            width: "*",
            text: ["Time: ", new Date(updatedAt).toLocaleTimeString()],
            fontSize: 11,
            alignment: "right",
          },
        ],
        columnGap: 10,
        margin: [0, 0, 0, 2], // adjust bottom spacing
      },
      {
        columns: [
          {
            width: "*",
            text: [
              `Age: ${getAge(dob)} | Gender: ${isMale ? "Male" : "Female"}`,
            ],
            fontSize: 11,
            alignment: "left",
          },
          {
            width: "*",
            text: ["Transaction # : ", task._id],
            fontSize: 11,
            alignment: "right",
          },
        ],
        columnGap: 10,
        margin: [0, 0, 0, 10], // adjust bottom spacing
      },
    ];
  },
  footer: ({ task, drSig, headSig, imgLogo, QrCode }) => {
    return (currentPage, pageCount) => {
      const { signatories } = task;
      const [head, dr, frontdesk] = signatories;
      return {
        margin: [10, -116, 10, 80],
        stack: [
          {
            text: [
              "Remarks: ",
              { text: task.remarks, bold: true, fontSize: 11 },
            ],
            fontSize: 10,
            margin: [0, 0, 0, 0],
          },
          {
            canvas: [
              { type: "line", x1: 0, y1: 0, x2: 575, y2: 0, lineWidth: 0.5 },
            ],
            margin: [0, 0, 0, 5],
          },
          {
            canvas: [
              {
                type: "line",
                x1: -30,
                y1: 0,
                x2: 800,
                y2: 0,
                lineWidth: 0.5,
                lineColor: "#555555",
              },
            ],
            margin: [0, 0, 0, 5],
          },
          {
            layout: "noBorders",
            table: {
              widths: ["50%", "50%"],
              body: [
                [
                  {
                    stack: [
                      ...(headSig
                        ? [
                            {
                              image: headSig,
                              width: 50,
                              absolutePosition: { x: 125, y: -100 },
                            },
                          ]
                        : []),
                      {
                        stack: [
                          {
                            text: properFullname(head?.fullName)?.toUpperCase(),
                            fontSize: 11,
                            bold: true,
                            alignment: "center",
                            margin: [0, 5, 0, 0],
                          },
                          {
                            text: "Medical Laboratory Scientist",
                            fontSize: 8,
                            italics: true,
                            alignment: "center",
                          },
                          {
                            text: "PRC#: 0044459",
                            fontSize: 8,
                            italics: true,
                            alignment: "center",
                          },
                        ],
                        width: 180,
                        alignment: "left",
                      },
                    ],
                    height: 80,
                  },
                  {
                    stack: [
                      {
                        text: properFullname(
                          frontdesk?.fullName
                        )?.toUpperCase(),
                        fontSize: 11,
                        bold: true,
                        alignment: "center",
                        margin: [0, 5, 0, 0],
                      },
                      {
                        text: "Encoder",
                        fontSize: 8,
                        italics: true,
                        alignment: "center",
                      },
                    ],
                    height: 80,
                  },
                ],
                [
                  {
                    colSpan: 2,
                    stack: [
                      {
                        absolutePosition: { x: 0, y: -70 },
                        alignment: "center",
                        image: drSig,
                        width: 50,
                      },
                      {
                        text: properFullname(dr.fullName).toUpperCase(),
                        alignment: "center",
                        fontSize: 11,
                        bold: true,
                      },
                      {
                        text: "Pathologist",
                        alignment: "center",
                        fontSize: 8,
                        italics: true,
                      },
                      {
                        text: "PRC#: 0044459",
                        alignment: "center",
                        fontSize: 8,
                        italics: true,
                      },
                    ],
                    height: 80,
                  },
                  {},
                ],
              ],
            },
          },
          {
            canvas: [
              {
                type: "line",
                x1: -30,
                y1: -3,
                x2: 800,
                y2: -3,
                lineWidth: 0.5,
                lineColor: "#555555",
                dash: { length: 2 },
              },
            ],
            margin: [0, 5, 0, 0],
          },
          {
            layout: "noBorders",
            table: {
              widths: ["15%", "68%", "18%"],
              body: [
                [
                  {
                    stack: [
                      { width: 50, image: imgLogo },
                      {
                        text: "PINOY-iMD",
                        bold: true,
                        fontSize: 11,
                        alignment: "left",
                        margin: [0, 3, 0, 0],
                      },
                    ],
                    height: 80,
                  },
                  {
                    stack: [
                      {
                        text: "PINOY INTEGRATED MEDICAL DIAGNOSTICS",
                        margin: [-22, 1, 0, 0],
                        bold: true,
                        fontSize: 12,
                      },
                      {
                        text: "With Every Task, Test, and Touchpoint — We Stand Behind Filipino Healthcare Heroes.",
                        fontSize: 9,
                        margin: [-22, 2, 0, 0],
                      },
                      {
                        text: [
                          "Empowered By:",
                          { text: " Techonowiz Solution Provider", bold: true },
                        ],
                        fontSize: 9,
                        margin: [-22, 2, 0, 0],
                      },
                      {
                        text: [
                          "Contact Number: ",
                          { text: "+63 935-033-9777", bold: true },
                        ],
                        fontSize: 9,
                        margin: [-22, 2, 0, 0],
                      },
                      {
                        text: [
                          "Address: ",
                          {
                            text: "Labanos Compound, Gulod Street, Brgy.San Pedro General Tino N.E",
                            bold: true,
                          },
                        ],
                        fontSize: 9,
                        margin: [-22, 2, 0, 0],
                      },
                    ],
                    height: 80,
                  },
                  {
                    stack: [
                      {
                        image: QrCode,
                        width: 55, // dito na kontrolin ang laki
                        height: 55,
                        alignment: "center",
                      },
                      {
                        text: "Scan to view e-Copy",
                        fontSize: 11,
                        bold: true,
                        alignment: "left",
                        margin: [0, -1, 0, 0],
                      },
                    ],
                    height: 200,
                  },
                ],
              ],
            },
          },
          {
            text: `Page ${currentPage} of ${pageCount}`,
            fontSize: 8,
            alignment: "center",
            margin: [0, 5, 0, 0],
          },
        ],
      };
    };
  },

  formColor: (form = "") =>
    ({
      serology: "#eeeeee",
      miscellaneous: "#e8eaf6",
      urinalysis: "#fff2cc",
      parasitology: "#d8ecda",
      hematology: "#f8d6db",
      coagulation: "#f44336",
    }[String(form).toLowerCase()] || "#d1e5fd"),

  getImage: async (result) => await image(result),
  getSignature: async (email) => {
    try {
      const sig = await signature(email);
      return sig || null; // kung walang nakuha, null lang
    } catch (error) {
      console.error("No signature found for:", email);
      return null;
    }
  },
  getLogo: async () => await toBase64(logo),
  generateQrCODE: async (result) =>
    await QRCode.toDataURL(
      `${ENDPOINT}/emr/portal/${result?.branchId?.companyId?._id}/${result?._id}`,
      { width: 300 }
    ),

  download: (docDefinition, fileName = "document.pdf") => {
    pdfMake.createPdf(docDefinition).getBlob((blob) => {
      // Default filename kung wala kang pinasa
      const safeFileName = `${fileName} Result - ${new Date().toLocaleDateString()}.pdf`;

      // ✅ For old IE/Edge Legacy support (optional na kung modern browsers lang target mo)
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, safeFileName);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = safeFileName;

        // dapat part ng user click flow para gumana sa mobile
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // cleanup
        URL.revokeObjectURL(link.href);
      }
    });
  },
};

export default utils;
