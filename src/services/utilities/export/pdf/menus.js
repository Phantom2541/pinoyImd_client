import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { currency, ENDPOINT } from "../..";
import { HMO, Memberships, Services } from "../../../fakeDb";

pdfMake.vfs = pdfFonts?.pdfMake?.vfs;
const contracts = {
  sbc: "Subcontract",
  ssc: "Special Subcontract",
};

const menuTypes = {
  inhouse: "Inhouse",
  mbs: "Membership",
  ctr: "Contract",
  hmo: "HMO",
};

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
const handlePrices = (form, menu) => {
  const { priceCategories = [], menuType = "", insource, hmo } = form;

  switch (menuType) {
    case "inhouse":
      return priceCategories.map((cat, i) => ({
        margin: [0, 0, 0, i + 1 === priceCategories.length ? 0 : 5],
        text: [
          { text: `${cat.text}: `, color: "#666" },
          { text: currency(menu[cat.value]) },
        ],
      }));

    case "ctr":
      return [
        {
          text: currency(menu[insource?.contract]),
        },
      ];

    case "hmo":
      return [
        {
          text: currency(HMO.getSrp(hmo, menu.hmo)),
        },
      ];

    default:
      return [];
  }
};

const handleHeader = (form) => {
  const { menuType, hmo: hmoCode, insource } = form;
  if (menuType === "hmo") {
    const { branch = {} } = JSON.parse(localStorage.getItem("activePlatform"));
    const { companyId } = branch;
    const { hmo } = companyId;
    const foundHmo = hmo.find(({ code }) => code === hmoCode) || {};
    const { cp = {} } = foundHmo;
    return [
      {
        width: "*",
        text: [{ text: "Name: ", bold: true }, HMO.getName(hmoCode)],
        fontSize: 11,
        alignment: "left",
      },
      {
        width: "*",
        text: [{ text: "Agent: ", bold: true }, cp?.agent],
        fontSize: 11,
        alignment: "center",
      },
      {
        width: "*",
        text: [{ text: "Phone Number: ", bold: true }, cp?.phone],
        fontSize: 11,
        alignment: "right",
      },
    ];
  }

  if (menuType === "ctr" || menuType === "mbs") {
    const isContract = menuType === "ctr";
    return [
      {
        width: "*",
        text: [
          { text: "Name: ", bold: true },
          insource?.name || insource?.displayname,
        ],
        fontSize: 11,
        alignment: "left",
      },

      {
        width: "*",
        text: [
          { text: isContract ? "Contract: " : "Membership: ", bold: true },
          isContract
            ? contracts[insource?.contract]
            : Memberships.getMembership(insource?.membership),
        ],
        fontSize: 11,
        alignment: "right",
      },
    ];
  }
  return [];
};

const handleTableHeader = (form) => {
  const { menuType } = form;
  if (menuType === "inhouse") {
    return ["Prices"];
  }
  if (menuType === "mbs") {
    return ["UP", "SRP"];
  }

  return ["SRP"];
};

export const MenuToPdf = async ({ menus, form, createdBy }) => {
  const { menuType } = form;
  const isMembership = menuType === "mbs";
  const lastDay = new Date(new Date().getFullYear(), 12, 0).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const imageBase64 = await getBase64Image(
    `${ENDPOINT}/public/companies/Smart Care/Pantabangan/banner.png`
  );

  const tableBody = [
    ["Name", "Services Inclusion", ...handleTableHeader(form)],
    ...menus.map((menu, index) => [
      {
        text: [
          { text: `${index + 1}. `, fontSize: 8 },
          { text: menu?.description || menu?.abbreviation },
        ],
      },
      {
        text: Services.whereIn(menu.packages)
          .map(({ abbreviation }) => abbreviation)
          .join(",    "),
        fontSize: 9,
        color: "#333",
      },
      ...(isMembership
        ? [
            { text: `${currency(menu?.opd)}` },
            {
              text: `${currency(
                Memberships.getDiscountedSRP(form?.insource?.membership, menu)
              )}`,
            },
          ]
        : [
            {
              stack: [...handlePrices(form, menu)],
            },
          ]),
    ]),
  ];

  const widths = isMembership ? ["*", "*", "auto", "auto"] : ["*", "*", "*"];

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [10, 65, 10, 60],

    background: function (_, pageSize) {
      return {
        image: imageBase64,
        width: pageSize.width,
        height: 50,
        absolutePosition: { x: 0, y: 0 },
      };
    },

    content: [
      {
        columns: [...handleHeader(form)],
        columnGap: 10,
        margin: [0, 0, 0, 10],
      },
      {
        text: `MENUS PRICE LIST`,
        style: "header",
        margin: [0, 0, 0, 8],
      },
      {
        table: {
          headerRows: 1,
          widths,
          body: tableBody,
        },
        layout: "lightHorizontalLines",
      },
      {
        text: `Prepared By: ${createdBy}`,
        margin: [0, 10, 0, 0],
      },
      {
        text: `Issued on: ${new Date().toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true, // optional, for AM/PM format
        })}`,
        margin: [0, 5, 0, 0],
      },
      {
        text: `Note: Prices are exclusive of additional services unless stated. Valid until ${lastDay}`,
        style: "remarks",
        margin: [0, 5, 0, 0],
      },
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
      },
      remarks: { fontSize: 12, italics: true },
    },

    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(docDefinition).download(
    `${menuTypes[form.menuType]} Menus Price List ${new Date().toLocaleString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    )}.pdf`
  );
};

export default MenuToPdf;
