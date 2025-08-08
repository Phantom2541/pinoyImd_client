const Dengue = (task) => {
  const { packages = [] } = task;
  const { ns1, igg, igm } = task?.results || {};

  var result = packages.includes(77)
    ? "DENGUE SCREENING"
    : packages.includes(120)
    ? "TYPHOID ANTIBODY"
    : "";
  return [
    {
      text: [result, " RESULTS:"],
      fontSize: 12,
      margin: [10, 5, 0, 5],
    },
    {
      text: [
        `NS1 Antigen: `,
        {
          text: ns1 ? "POSITIVE" : "NEGATIVE",
          bold: true,
          color: ns1 ? "red" : "black",
        },
      ],
      margin: [150, 0, 0, 2], // indent
    },
    {
      text: "Antibody :",
      margin: [150, 0, 0, 2],
    },
    {
      text: [
        `IgG: `,
        {
          text: igg ? "POSITIVE" : "NEGATIVE",
          bold: true,
          color: igg ? "red" : "black",
        },
      ],
      margin: [170, 0, 0, 2], // mas malaki indent
    },
    {
      text: [
        `IgM: `,
        {
          text: igm ? "POSITIVE" : "NEGATIVE",
          bold: true,
          color: igm ? "red" : "black",
        },
      ],
      margin: [170, 0, 0, 2],
    },
  ];
};

export default Dengue;
