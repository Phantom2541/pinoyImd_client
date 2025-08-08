import { Services } from "../../../../../../../fakeDb";
const test = [68, 69, 70, 97, 131];
const Cluster = (task) => {
  const { results } = task;
  const services = Object.keys(results)
    .filter((key) => test.includes(Number(key)))
    .map((key) => Services.find(key));
  return [
    {
      text: "Results: ",
      fontSize: 12,
      margin: [10, 5, 0, 5],
    },
    ...services.map((service, i) => {
      const hasService = results[service?.id] === "true";
      const isLast = i === services.length - 1; // check kung last index
      return {
        text: [
          `${service?.name || service?.abbreviation}: `,
          {
            text: hasService ? "REACTIVE" : "NON-REACTIVE",
            bold: true,
            color: hasService ? "red" : "black",
          },
        ],
        margin: [60, i === 0 ? 5 : 0, 0, isLast ? 10 : 2], // indent
      };
    }),
  ];
};

export default Cluster;
