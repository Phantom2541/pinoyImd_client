import { Services, Templates } from "../../fakeDb";

const harvestTask = (menu) => {
  // Ensure Templates is an array
  if (!Array.isArray(Templates)) {
    console.error("❌ Error: Templates is not an array", Templates);
    return {};
  }

  return Services.whereIn(
    menu?.reduce((collection, deal) => collection.concat(deal.packages), [])
  ).reduce((collection, service) => {
    console.log("collection", collection);
    console.log("service", service);

    // Find the correct template
    const templateData = Templates.find(
      ({ department }) => department === service.department
    );

    if (!templateData) {
      console.warn(
        `⚠️ Warning: No template found for department ${service.department}`
      );
      return collection;
    }

    // Ensure components exist before accessing service.template
    let forms = templateData.components?.[service.template];

    if (!forms) {
      console.warn(
        `⚠️ Warning: No form found for template "${service.template}" in department "${service.department}"`
      );
      return collection;
    }

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
