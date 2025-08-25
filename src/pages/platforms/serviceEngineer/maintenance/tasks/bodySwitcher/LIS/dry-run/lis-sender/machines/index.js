import A15 from "./A15";

const MachineSender = async (
  workID,
  section,
  services,
  pi,
  machine,
  domain
) => {
  //pi =Patient Identifier
  switch (section) {
    case "Chemistry":
      return await A15(workID, services, pi, machine, domain);

    default:
      console.warn(`❌ No machine sender assigned for: ${section}`);
  }
};

export default MachineSender;
