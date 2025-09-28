import platelet from "./platelet";
import rbc from "./rbc";
import wbc from "./wbc";

const Pbs = {
  rbc: {
    collections: rbc,
    getLabel: (index) => rbc[index]?.label,
    getValues: (index) => rbc[index]?.values,
  },
  wbc,
  platelet,
};

export default Pbs;
