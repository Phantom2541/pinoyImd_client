import A15 from "./A15";

const MachineSender = (forms = {}, deal) => {
  //forms,patientNumber
  const sections = Object.keys(forms);
  sections.forEach(async (element) => {
    switch (element) {
      case "Chemistry":
        return await A15(forms[element], element, deal);

      default:
        console.warn(`❌ No machine sender assigned for: ${element}`);
    }
  });
};

export default MachineSender;
