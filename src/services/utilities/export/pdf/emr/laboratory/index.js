import Miscellaneous from "./miscellaneous";
import Chemistry from "./chemistry";
import Hematology from "./hematology";
import Parasitology from "./parasitology";
import Urinalysis from "./urinalysis";

const Laboratory = async ({ form, task, result }) => {
  try {
    switch (form) {
      case "Hematology":
        await Hematology({ form, task, result });
        break;

      case "Urinalysis":
        await Urinalysis({ form, task, result });
        break;

      case "Parasitology":
        await Parasitology({ form, task, result });
        break;

      case "Chemistry":
        await Chemistry({ form, task, result });
        break;

      default:
        await Miscellaneous({ form, task, result });

        break;
    }
  } catch (err) {
    console.error("Error in Laboratory:", err);
    throw err; // rethrow if you want the calling function to handle it
  }
};

export default Laboratory;
