const Ogtt = (task) => {
  const { results } = task;
  return [
    {
      text: "ORAL GLUCOSE TOLERANCE TEST",
      alignment: "center",
      bold: true,
      fontSize: 14,
      margin: [0, 5, 0, 5],
    },
    {
      table: {
        widths: ["*", 150, 150],
        body: [
          [
            { text: "Services", bold: true },
            { text: "Result", bold: true },
            { text: "Reference", bold: true },
          ],
          [
            { text: "Fasting Blood Sugar " },
            {
              text: results.fbs,
              bold: true,
            },
            { text: "70-110 mg/dL" },
          ],
          [
            { text: "1st Hour" },
            {
              text: results.fhr,
              bold: true,
            },
            { text: "up to 180 mg/dL" },
          ],
          [
            { text: "2nd Hour" },
            {
              text: results.shr,
              bold: true,
            },
            { text: "up to 153 mg/dL" },
          ],
        ],
      },
      layout: "lightHorizontalLines",
    },
  ];
};

export default Ogtt;
