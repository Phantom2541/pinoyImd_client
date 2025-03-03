import { Services, Templates } from "../../fakeDb";

const harvestTask = (menu) => {
  return Services.whereIn(
    menu?.reduce((collection, deal) => collection.concat(deal.packages), [])
  ).reduce((collection, service) => {
    console.log("Processing service:", service);

    // Find the matching template for the department
    const foundTemplate = Templates.collections.find(
      ({ department }) => department === service.department
    );

    if (!foundTemplate) {
      console.warn(`No template found for department: ${service.department}`);
      return collection; // Skip this iteration
    }

    console.log("Found Template:", foundTemplate);

    // Ensure service.template exists in components
    let forms = foundTemplate.components[service.template];

    if (!forms) {
      console.warn(
        `Template "${service.template}" not found in department: ${service.department}`
      );
      return collection; // Skip this iteration
    }

    console.log("Processing form type:", forms);

    switch (forms) {
      case "Chemistry":
      case "Electrolyte":
      case "Serology":
        collection[forms] = {
          ...collection[forms],
          [service.id]: "",
        };
        break;
      default:
        collection[forms] = [...(collection[forms] || []), service.id];
    }

    return collection;
  }, {});
};

export default harvestTask;
