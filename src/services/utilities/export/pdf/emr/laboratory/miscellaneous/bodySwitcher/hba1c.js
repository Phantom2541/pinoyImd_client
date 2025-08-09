const Glucose = (task) => {
  const { results } = task;
  return [
    // Main test title
    {
      text: "GLYCOSYLATED HEMOGLOBIN TEST",
      alignment: "center",
      bold: true,
      fontSize: 14,
      margin: [0, 5, 0, 5],
    },
    // Inner results table
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
            { text: "GLYCOSYLATED HEMOGLOBIN" },
            {
              text: results.hba1c,
              bold: true,
              color:
                results?.hba1c < 4
                  ? "blue"
                  : results?.hba1c > 6
                  ? "red"
                  : "black",
            },
            { text: "4 - 6 %" },
          ],
        ],
      },
      layout: "lightHorizontalLines",
    },
  ];
};

export default Glucose;
