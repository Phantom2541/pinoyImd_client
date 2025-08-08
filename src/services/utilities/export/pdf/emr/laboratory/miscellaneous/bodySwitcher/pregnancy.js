const Pregnancy = (task) => {
  const { packages = [], results } = task;

  var result = packages.includes(67)
    ? "PREGNANCY"
    : packages.includes(84)
    ? "FECAL OCCULT BLOOD"
    : "";
  return [
    {
      text: [
        `${result} TEST: `,
        {
          text: results ? "POSITIVE" : "NEGATIVE",
          bold: true,
          color: results ? "red" : "black",
        },
      ],
      fontSize: 12,
      margin: [200, 25, 0, 25],
    },
  ];
};

export default Pregnancy;
