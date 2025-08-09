const types = ["A", "B", "O", "AB"];

const BloodTyping = (task) => {
  const { results } = task;
  const aboType = types[results?.bt];

  return [
    {
      text: "BLOOD TYPING :",
      fontSize: 12,
      margin: [20, 5, 0, 5],
    },
    {
      text: [
        `Forward: `,
        {
          text: `"${aboType}"`,
          bold: true,
        },
      ],
      margin: [40, 0, 0, 2], // indent
    },
    {
      text: [
        `REVERSE: `,
        {
          text: `"${aboType}"`,
          bold: true,
        },
      ],
      margin: [40, 0, 0, 2], // indent
    },
    {
      text: [
        `RH: `,
        {
          text: results?.rh ? "POSITIVE" : "NEGATIVE",
          bold: true,
          color: results?.rh ? "red" : "black",
        },
      ],
      margin: [40, 5, 0, 2], // mas malaki indent
    },
  ];
};

export default BloodTyping;
