import { ENDPOINT } from "../../../..";
import fullName from "../../../../fullName";
import getAge from "../../../../getAge";

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

const image = async () => {
  const { branch } = JSON.parse(localStorage.getItem("activePlatform"));
  const { companyId } = branch;
  return await getBase64Image(
    `${ENDPOINT}/public/companies/${companyId?.name}/${branch?.name}/banner.png`
  );
};
const signature = async (email) => {
  return await getBase64Image(
    ` ${ENDPOINT}/public/users/${email}/signature.png`
  );
};

const utils = {
  formColor: (form = "") =>
    ({
      serology: "#eeeeee",
      miscellaneous: "#e8eaf6",
      urinalysis: "#fff2cc",
      parasitology: "#d8ecda",
      hematology: "#f8d6db",
      coagulation: "#f44336",
    }[String(form).toLowerCase()] || "#d1e5fd"),

  header: (task) => {
    const { patient, updatedAt } = task;
    const { fullName: pFull, isMale = false, dob = "", _id } = patient;
    return [
      {
        columns: [
          {
            width: "*",
            text: [
              "Name: ",
              { text: fullName(pFull, true).toUpperCase(), bold: true },
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
  getImage: async () => await image(),
  getSignature: async (email) => await signature(email),
};

export default utils;
