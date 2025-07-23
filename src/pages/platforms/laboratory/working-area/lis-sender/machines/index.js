import A15 from "./A15";

const MachineSender = async (section, services, pi) => {
  //pi =Patient Identifier
  switch (section) {
    case "Chemistry":
      return await A15(services, pi);

    default:
      console.warn(`❌ No machine sender assigned for: ${section}`);
  }
};

export default MachineSender;
