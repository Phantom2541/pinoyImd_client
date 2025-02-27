import { Services, Templates } from "../../fakeDb";

const harvestTask = (menu) =>
  Services.whereIn(
    menu?.reduce((collection, deal) => collection.concat(deal.packages), [])
  ).reduce((collection, service) => {
    console.log("service", service);
    console.log("collection", collection);
    
    let forms = Templates.find(
      ({ department }) => console.log("lol",department === service?.department)
      
    )?.components[service?.template];
    console.log("forms", forms);
    
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
        // case "Miscellaneous":
        // case "Hematology":
        collection[forms] = [...(collection[forms] || []), service.id];
    }

    return collection;
  }, {});

export default harvestTask;
